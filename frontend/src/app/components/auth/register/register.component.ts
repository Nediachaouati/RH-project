import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../../models/user.model';


;

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private http: HttpClient,private router:Router) {}

  user: User = {
    email: '',
    password: '',
    name: ''
  };


  register() {
    this.http.post(`${environment.apiUrl}/auth/register`, this.user)
      .subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']); 
          // Handle successful registration (e.g., redirect to login page)
        },
        (error) => {
          console.error('Registration error', error);
          // Handle error (e.g., show an error message)
        }
      );
  }
  
 
}
