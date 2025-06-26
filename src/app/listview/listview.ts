import { Component, OnDestroy, OnInit } from '@angular/core';
import { DbService } from '../db/db';
import { CommonModule } from '@angular/common';
import { ProjectDto } from '../db/dtos/project';
import { RouterLink } from '@angular/router';
import { VoteTypes } from '../db/votetypes';

@Component({
  selector: 'app-listview',
  imports: [CommonModule, RouterLink],
  templateUrl: './listview.html',
  styleUrl: './listview.scss'
})
export class Listview implements OnInit, OnDestroy {
  db: DbService;
  projects: ProjectDto[] = [];
  activeUser: number;
  fav: number | undefined;
  private intervalId: any;

  constructor(db: DbService) {
    this.db = db;
    this.activeUser = 92041720210421; // ACHTUNG EMPLOYEEID PLACEHOLDER
    this.loadProjects();
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  ngOnInit(): void {
    this.intervalId = setInterval(() => this.loadProjects(), 30000);
  }

  loadProjects() {
    this.db.getUnvotedProjects(this.activeUser).then((unvotedProjects) => {
      this.db.getVotedProjects(this.activeUser).then((votedProjects) => {
        this.projects = [...unvotedProjects, ...votedProjects];
        this.projects.sort((a, b) => a.title.localeCompare(b.title));
      }).catch((error) => {
        console.error('Error fetching projects:', error);
      });
    });
    this.db.getFavoriteProject(this.activeUser).then((favProjectId) => {
      this.fav = favProjectId;
      console.log(favProjectId);
    });
  }

  async favourise(projectId: number) {
    if (this.fav === projectId) {
      this.fav = undefined;
      this.db.voteForProject(projectId, VoteTypes.FAVOURITE, this.activeUser);
    } else {
      this.fav = projectId;
      await this.db.voteForProject(projectId, VoteTypes.FAVOURITE, this.activeUser);
    }
    this.loadProjects();
  }
}
