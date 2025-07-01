import { Component, OnDestroy, OnInit } from '@angular/core';
import { DbService } from '../db/db';
import { CommonModule } from '@angular/common';
import { ProjectDto } from '../db/dtos/project';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VoteTypes } from '../db/votetypes';
import { AccountService } from '../account';

@Component({
  selector: 'app-listview',
  imports: [CommonModule, RouterLink],
  templateUrl: './listview.html',
  styleUrl: './listview.scss'
})
export class Listview implements OnInit, OnDestroy {
  projects: ProjectDto[] = [];
  fav: number | undefined;
  private intervalId: any;
  protected account: AccountService

  constructor(private db: DbService, account: AccountService) {
    this.account = account;
    this.loadProjects();
    this.account.finished$.subscribe((finished) => {
      if (finished) {
        this.loadProjects();
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => this.loadProjects(), 30000);
  }

  loadProjects() {
    if (this.account.isLoggedIn()) {
      this.db.getUnvotedProjects(this.account.getAuthkey()!).then((unvotedProjects) => {
        this.db.getVotedProjects(this.account.getAuthkey()!).then((votedProjects) => {
          this.projects = [...unvotedProjects, ...votedProjects];
          this.projects.sort((a, b) => a.title.localeCompare(b.title));
        }).catch((error) => {
          console.error('Error fetching projects:', error);
        });
      });
      this.db.getFavoriteProject(this.account.getAuthkey()!).then((favProjectId) => {
        if (favProjectId === -1) {
          this.fav = undefined;
        }
        this.fav = favProjectId;
      });
    } else {
      this.db.getAllProjects().then((projects) => {
        this.projects = projects;
        this.projects.sort((a, b) => a.title.localeCompare(b.title));
      }).catch((error) => {
        console.error('Error fetching projects:', error);
      });
      this.fav = undefined;
    }
  }

  async favourise(projectId: number) {
    if (this.fav === projectId) {
      this.fav = undefined;
      await this.db.voteForProject(projectId, VoteTypes.UNFAVOURITE, this.account.getAuthkey()!);
    } else {
      this.fav = projectId;
      await this.db.voteForProject(projectId, VoteTypes.FAVOURITE, this.account.getAuthkey()!);
    }
    this.loadProjects();
  }
}
