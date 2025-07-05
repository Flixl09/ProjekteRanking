import { Component, OnInit } from '@angular/core';
import { DbService } from '../db/db';
import { ProjectDto } from '../db/dtos/project';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { VoteTypes } from '../db/votetypes';
import { AccountService } from '../account';

@Component({
  selector: 'app-votepage',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './votepage.html',
  styleUrl: './votepage.scss',
})
export class Votepage {

  private db: DbService;

  protected account: AccountService;

  protected projects: ProjectDto[] = [];

  protected actualProject: ProjectDto | null = null;
  protected actualProjectImage: string | null = null;
  protected beforeProject: ProjectDto | null = null;

  VoteTypes = VoteTypes;

  constructor(db: DbService, account: AccountService) {44
    this.account = account;
    this.db = db;
    if (this.account.isLoggedIn()) {
      this.db.getUnvotedProjects(this.account.getAuthkey()!).then(projects => {
        this.projects = projects;
        if (this.projects.length > 0) {
          this.actualProject = this.projects[0];
          this.getProjectImage(this.actualProject);
        }
        console.log('Projects fetched:', this.projects);
      }).catch(error => {
        console.error('Error fetching projects:', error);
      });
    } else {
      this.projects = [];
      this.actualProject = null;
    }
  }

  private getProjectImage(project: ProjectDto): void {
    this.db.getProjectImages(project.projectid!).then(images => {
      if (images.length > 0) {
        this.actualProjectImage = images[0];
      } else {
        this.actualProjectImage = null;
      }
    }).catch(error => {
      console.error('Error fetching project images:', error);
      this.actualProjectImage = null;
    });
  }

  nextProject(): void {
    const currentIndex = this.projects.indexOf(this.actualProject!);
    if (currentIndex < this.projects.length - 1) {
      this.beforeProject = this.actualProject;
      this.actualProject = this.projects[currentIndex + 1];
      this.getProjectImage(this.actualProject);
    } else {
      this.beforeProject = this.actualProject;
      this.actualProject = null;
      this.actualProjectImage = null;
    }
  }

  back(): void {
    if (this.beforeProject) {
      const currentIndex = this.projects.indexOf(this.actualProject!);
      const beforeIndex = this.projects.indexOf(this.beforeProject);
      if (beforeIndex >= 0 && beforeIndex < currentIndex) {
        this.actualProject = this.beforeProject;
        this.beforeProject = null;
        this.getProjectImage(this.actualProject);
      } else {
        console.warn('No previous project to go back to.');
      }
    } else {
      console.warn('No previous project to go back to.');
    }
  }

  vote(project: ProjectDto, vote: VoteTypes): void {
    this.db.voteForProject(project.projectid!, vote, this.account.getAuthkey()!).then(() => {
      this.nextProject();
    }).catch(error => {
      console.error('Error voting for project:', error);
    });
  }
}
