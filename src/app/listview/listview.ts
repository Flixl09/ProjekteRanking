import { Component, OnInit } from '@angular/core';
import { DbService } from '../db/db';
import { CommonModule } from '@angular/common';
import { ProjectDto } from '../db/dtos/project';

@Component({
  selector: 'app-listview',
  imports: [CommonModule],
  templateUrl: './listview.html',
  styleUrl: './listview.scss'
})
export class Listview implements OnInit {
  db: DbService;
  projects: ProjectDto[] = [];

  constructor(db: DbService) {
    this.db = db;
  }
  ngOnInit(): void {
    this.db.getAllProjects().then(projects => {
      this.projects = projects;
      console.log('Projects fetched:', this.projects);  
    }).catch(error => {
      console.error('Error fetching projects:', error);
    });
  }


  

}
