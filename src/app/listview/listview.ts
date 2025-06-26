import { Component, OnInit } from '@angular/core';
import { DbService } from '../db/db';
import { CommonModule } from '@angular/common';
import { ProjectDto } from '../db/dtos/project';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listview',
  imports: [CommonModule, RouterLink],
  templateUrl: './listview.html',
  styleUrl: './listview.scss'
})
export class Listview {
  db: DbService;
  projects: ProjectDto[] = [];
  activeUser: number;
  fav: number | undefined;

  constructor(db: DbService) {
    this.db = db;
    this.activeUser = 92041720210421; // ACHTUNG EMPLOYEEID PLACEHOLDER
    this.loadProjects();
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
}
