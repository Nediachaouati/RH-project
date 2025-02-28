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
  constructor(private http: HttpClient,private router:Router) {}

  user:any = {
    email: '',
    password: ''
  };

  login() {
    this.http.post(`${environment.apiUrl}/auth/login`, this.user)
      .subscribe(
        (response) => {
          console.log('login successful', response);
          this.router.navigate(['/http://localhost:4200/home']); 
          // Handle successful registration (e.g., redirect to login page)
        },
        (error) => {
          console.error('Registration error', error);
          // Handle error (e.g., show an error message)
        }
      );
  }
}
