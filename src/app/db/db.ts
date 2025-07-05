import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ImageDto, ProjectDto, UserDto } from './dtos/project';
import { HttpClient } from '@angular/common/http';
import { VoteTypes } from './votetypes';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  http: HttpClient;
  hosturl: String = "https://projektrankapi.gordlby.at";

  constructor(http: HttpClient) {
    this.http = http;
  }

  async getAllProjects(): Promise<ProjectDto[]> {
    try {
      const response = await this.http.get<ProjectDto[]>(`${this.hosturl}/api/projects`).toPromise();
      return this.plainToInstances(ProjectDto, response!);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getUnvotedProjects(authkey: string): Promise<ProjectDto[]> {
    try {
      const response = await this.http.get<ProjectDto[]>(`${this.hosturl}/api/projects/unvoted/${authkey}`).toPromise();
      return this.plainToInstances(ProjectDto, response!);
    } catch (error) {
      console.error('Error fetching unvoted projects:', error);
      return [];
    }
  }

  async getVotedProjects(authkey: string): Promise<ProjectDto[]> {
    try {
      const response = await this.http.get<ProjectDto[]>(`${this.hosturl}/api/projects/voted/${authkey}`).toPromise();
      return this.plainToInstances(ProjectDto, response!);
    } catch (error) {
      console.error('Error fetching voted projects:', error);
      return [];
    }
  }

  async voteForProject(projectId: number, votetype: VoteTypes, authkey: string): Promise<void> {
    try {
      await this.http.post(`${this.hosturl}/api/votes`, {employeeid: authkey, projectid: projectId, votetype: votetype.valueOf()}).toPromise();
    } catch (error) {
      console.error('Error voting for project:', error);
    }
  }

  async getFavoriteProject(authkey: string): Promise<number> {
    try {
      const response = await this.http.get<{ projectid: number }>(`${this.hosturl}/api/favourite/${authkey}`).toPromise();
      if (response!.projectid === -1) {
        return -1;
      }
      return response!.projectid || -1;
    } catch (error) {
      return -1;
    }
  }

  async validateAuthkey(authkey: string): Promise<boolean> {
    try {
      const response = await this.http.post<boolean>(`${this.hosturl}/api/user/validate`, {authkey: authkey}).toPromise();
      console.log('Authkey validation response:', response);
      return true;
    } catch (error) {
      console.error('Error validating authkey:', error);
      return false;
    }
  }

  async login(username: string, password: string): Promise<string | null> {
    try {
      const response = await this.http.post<{ authkey: string }>(`${this.hosturl}/api/user/login`, { username: username, password: password }).toPromise();
      if (response && response.authkey) {
        return response.authkey;
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
    return null;
  }

  async getUserData(authkey: string): Promise<UserDto | null> {
    try {
      const response = await this.http.get<UserDto>(`${this.hosturl}/api/user/${authkey}`).toPromise();
      if (response) {
        return this.plainToInstance(UserDto, response);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  }

  async pushProject(authkey: string, project: ProjectDto, images: string[]): Promise<void> {
    try {
      const response = await this.http.post(`${this.hosturl}/api/projects`, { authkey: authkey, project: project }).toPromise();
      console.log('Project pushed successfully:', response);
    } catch (error) {
      console.error('Error pushing project:', error);
    }
  }

  async getProject(projectId: number): Promise<ProjectDto | null> {
    try {
      const response = await this.http.get<ProjectDto>(`${this.hosturl}/api/projects/${projectId}`).toPromise();
      if (response) {
        return this.plainToInstance(ProjectDto, response);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
    return null;
  }

  async getProjectImages(projectId: number): Promise<string[]> {
    try {
      const response = await this.http.get<any>(`${this.hosturl}/api/projects/images/${projectId}`).toPromise();
      return response!.images;
    } catch (error) {
      console.error('Error fetching project images:', error);
      return [];
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
          instance[key] = plain[key].map((item: any) => this.plainToInstance(item.constructor, item));
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
