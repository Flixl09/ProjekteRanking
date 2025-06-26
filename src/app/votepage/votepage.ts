import { Component, OnInit } from '@angular/core';
import { DbService } from '../db/db';
import { ProjectDto } from '../db/dtos/project';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VoteTypes } from '../db/votetypes';

@Component({
  selector: 'app-votepage',
  imports: [CommonModule, RouterLink],
  templateUrl: './votepage.html',
  styleUrl: './votepage.scss',
})
export class Votepage {

  db: DbService;

  projects: ProjectDto[] = [];

  actualProject: ProjectDto | null = null;

  actualUser: number;

  VoteTypes = VoteTypes; 

  constructor(db: DbService) {
    this.db = db;
    this.actualUser = 92041720210421; // ACHTUNG EMPLOYEEID PLACEHOLDER
    this.db.getUnvotedProjects(this.actualUser).then(projects => {
      this.projects = projects;
      if (this.projects.length > 0) {
        this.actualProject = this.projects[0];
      }
      console.log('Projects fetched:', this.projects);  
    }).catch(error => {
      console.error('Error fetching projects:', error);
    });
  }

  nextProject(): void {
    const currentIndex = this.projects.indexOf(this.actualProject!);
    if (currentIndex < this.projects.length - 1) {
      this.actualProject = this.projects[currentIndex + 1];
    } else {
      this.actualProject = null;
    }
  }

  vote(project: ProjectDto, vote: VoteTypes): void {
    this.db.voteForProject(project.projectid, vote, this.actualUser).then(() => {
      this.nextProject();
    }).catch(error => {
      console.error('Error voting for project:', error);
    });
  }
}
