import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ProjectDto, UserDto } from './dtos/project';
import { HttpClient } from '@angular/common/http';
import { VoteTypes } from './votetypes';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async getAllProjects(): Promise<ProjectDto[]> {
    try {
      const response = await this.http.get<ProjectDto[]>(`http://localhost:5000/api/projects`).toPromise();
      return this.plainToInstances(ProjectDto, response!);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getUnvotedProjects(employeeId: number): Promise<ProjectDto[]> {
    try {
      const response = await this.http.get<ProjectDto[]>(`http://localhost:5000/api/projects/unvoted/${employeeId}`).toPromise();
      return this.plainToInstances(ProjectDto, response!);
    } catch (error) {
      console.error('Error fetching unvoted projects:', error);
      return [];
    }
  }

  async getVotedProjects(employeeId: number): Promise<ProjectDto[]> {
    try {
      const response = await this.http.get<ProjectDto[]>(`http://localhost:5000/api/projects/voted/${employeeId}`).toPromise();
      return this.plainToInstances(ProjectDto, response!);
    } catch (error) {
      console.error('Error fetching voted projects:', error);
      return [];
    }
  }
  

  async voteForProject(projectId: number, votetype: VoteTypes, employeeid: number): Promise<void> {
    try {
      console.log(`Voting for project ${projectId} with type ${votetype} by employee ${employeeid}`);
      await this.http.post(`http://localhost:5000/api/votes`, {employeeid: employeeid, projectid: projectId, votetype: votetype.valueOf()}).toPromise(); 
    } catch (error) {
      console.error('Error voting for project:', error);
    }
  }

  async getFavoriteProject(employeeId: number): Promise<number> {
    try {
      const response = await this.http.get<{ projectid: number }>(`http://localhost:5000/api/favourite/${employeeId}`).toPromise();
      return response!.projectid || -1; // Return -1 if no favourite project found
    } catch (error) {
      console.error('Error fetching favorite project:', error);
      return -1; // Return -1 or some other value to indicate no favorite found
    }
  }


  plainToInstance(cls: any, plain: any): any {
    const instance = new cls();
    Object.keys(plain).forEach(key => {
      if (key in instance) {
        // Check if the property is a Date and convert it
        if (instance[key] instanceof Date) {
          instance[key] = new Date(plain[key]);
        } else if (Array.isArray(instance[key])) {
          instance[key] = new UserDto().plainToInstance(plain[key]);
        }
        instance[key] = plain[key];
      }
    });
    return instance;
  }

  plainToInstances(cls: any, plains: any[]): any[] {
    return plains.map(plain => this.plainToInstance(cls, plain));
  }
}
