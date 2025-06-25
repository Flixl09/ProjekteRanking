import { Component, OnInit } from '@angular/core';
import { DbService } from '../db/db';
import { ProjectDto } from '../db/dtos/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-votepage',
  imports: [CommonModule],
  templateUrl: './votepage.html',
  styleUrl: './votepage.scss'
})
export class Votepage implements OnInit {

  db: DbService

  projects: ProjectDto[] = [];

  actualProject: ProjectDto | null = null;

  constructor(db: DbService) {
    this.db = db;
    this.db.getUnvotedProjects(2).then(projects => { // ACHTUNG EMPLOYEEID PLACEHOLDER
      this.projects = projects;
      if (this.projects.length > 0) {
        this.actualProject = this.projects[0];
      }
      console.log('Projects fetched:', this.projects);  
    }).catch(error => {
      console.error('Error fetching projects:', error);
    }); // ACHTUNG EMPLOYEEID PLACEHOLDER
   }

  ngOnInit(): void {
    if (this.projects.length === 0) {
      console.log('No projects available for voting.'); // HIER EIN POPUP ODER SO ETWAS
    }
  }
}
