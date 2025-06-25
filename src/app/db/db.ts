import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ProjectDto } from './dtos/project';
import { HttpClient } from '@angular/common/http';

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
      const response = await this.http.get<ProjectDto[]>('http://localhost:5000/api/projects').toPromise();
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
  

  async voteForProject(projectId: string, votetype: VoteTypes): Promise<void> {
    try {
      await this.http.post(`http://localhost:5000/api/votes`, {employeeid: 2, projectId: projectId, votetype: votetype.valueOf()}).toPromise();   // ACHTUNG EMPLOYEEID PLACEHOLDER
    } catch (error) {
      console.error('Error voting for project:', error);
    }
  }

  plainToInstance(cls: any, plain: any): any {
    const instance = new cls();
    Object.keys(plain).forEach(key => {
      if (key in instance) {
        // Check if the property is a Date and convert it
        if (instance[key] instanceof Date) {
          instance[key] = new Date(plain[key]);
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
