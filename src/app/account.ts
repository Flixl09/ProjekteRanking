import { Injectable, OnInit } from '@angular/core';
import { StorageService } from './storage';
import { DbService } from './db/db';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private finished = new BehaviorSubject<boolean>(false);
  public finished$ = this.finished.asObservable();

  private loginFinished: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  public loginFinished$ = this.loginFinished.asObservable();

  constructor(private storage: StorageService, private db: DbService) {
    if (this.hasAuthkey()) {
      this.authkey = this.storage.getAuthkey();
      this.db.validateAuthkey(this.authkey!).then(isValid => {
        if (isValid) {
          this.loggedIn = true;
          console.log('Authentication key is valid');
          this.finished.next(true);
          this.db.getUserData(this.authkey!).then(userData => {
            if (userData) {
              this.name = userData.name;
              this.votes = userData.votes || 0;
              console.log('User data retrieved:', this.name);
            } else {
              console.error('Failed to retrieve user data');
            }
          }).catch(error => {
            console.error('Error retrieving user data:', error);
          });
        } else {
          this.clearAuthkey();
          console.log('Authentication key is invalid, cleared');
          this.finished.next(true);
          this.loggedIn = false;
        }
      }).catch(error => {
        console.error('Error validating authkey:', error);
        this.clearAuthkey();
        this.finished.next(true);
        this.loggedIn = false;
      });
    } else {
      console.log('No authentication key found');
      this.finished.next(true);
      this.loggedIn = false;
    }
  }

  private authkey: string | null = null;
  private loggedIn: boolean = false;
  private name: string = '';
  private votes: number = 0;

  public hasAuthkey(): boolean {
    return this.storage.getAuthkey() !== null;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public getAuthkey(): string | null {
    return this.authkey;
  }

  public clearAuthkey(): void {
    this.authkey = null;
    this.loggedIn = false;
    this.storage.clearAuthkey();
  }

  public getName(): string {
    return this.name;
  }

  public clearName(): void {
    this.name = '';
  }

  public getVotes(): number {
    return this.votes;
  }

  public login(username: string, password: string): void {
    this.db.login(username, password).then(response => {
      if (response !== null) {
        this.authkey = response!;
        this.db.getUserData(this.authkey!).then(userData => {
          if (userData) {
            this.name = userData.name;
            this.votes = userData.votes || 0;
          } else {
            console.error('Failed to retrieve user data after login');
            this.loginFinished.next(false);
          }
        });
        this.loggedIn = true;
        this.storage.saveAuthkey(this.authkey!);
        console.log('Login successful, authkey set:', this.authkey);
        this.loginFinished.next(true);
      } else {
        console.error('Login failed:', response);
        this.loggedIn = false;
        this.loginFinished.next(false);
      }
    }).catch(error => {
      console.error('Error during login:', error);
      this.loggedIn = false;
      this.loginFinished.next(false);
    });
  }

}
