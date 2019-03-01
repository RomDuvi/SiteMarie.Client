import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/guard/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})

export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  submitted = false;
  error;

  constructor(protected authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    if (this.authService.isAdminLogged()) {
      this.router.navigate(['/admin']);
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      (data: User) => {
          this.router.navigate(['/categories']);
      },
      (error) => {
        this.error = error.error;
        console.log(this.error);
      });
  }
}
