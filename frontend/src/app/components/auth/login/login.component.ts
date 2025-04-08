import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  user:any = {
    email: '',
    password: ''
  };

  login() {
    this.authService.login(this.user.email, this.user.password).subscribe({
      next: (response: any) => {
        console.log('login successful', response);
        const { access_token: token, role: userRole } = response;

        this.authService.saveToken(token);

        const redirectRoute = userRole === 'ADMIN' ? '/' : '/home';
        this.router.navigate([redirectRoute]);
      },
      error: (error) => {
        console.error('Login error', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }
}
