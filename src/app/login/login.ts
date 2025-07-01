import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private username: string = '';
  private password: string = '';
  protected account: AccountService;
  private router: Router;
  protected wrongLogin: boolean;

  constructor(account: AccountService, router: Router) {
    this.account = account;
    this.router = router;
    this.wrongLogin = false;
  }

  loginForm = new FormGroup({
    username: new FormControl(this.username, Validators.required),
    password: new FormControl(this.password, Validators.required)
  });

  onSubmit() {
    console.log('Form submitted:', this.loginForm.value);
    this.account.login(this.loginForm.value.username!, this.loginForm.value.password!);
    this.loginForm.reset();
    this.account.loginFinished$.subscribe((success: boolean | undefined) => {
      if (success) {
        this.wrongLogin = false;
        console.log('Login successful, redirecting to home page');
        this.router.navigate(['/']);
      } else {
        this.wrongLogin = true;
      }
    });
  }

  logout() {
    this.account.clearAuthkey();
    this.account.clearName();
    this.router.navigate(['/']);
  }
}
