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
    id: 0, // Default value for ID
    email: '',
    password: '',
    name: '',
    role: 'CANDIDAT', // Default role
    phoneNumber: '',
    address: '',
    birthDate: undefined,
    specialty: '',
    school: '',
    degree: '',
    graduationYear: '',
    experienceLevel: '',
    photo: '',
    created_at: new Date(),
    updated_at: new Date()
  };
  register() {
    this.http.post(`${environment.apiUrl}/auth/register`, this.user)
      .subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']); 
        
        },
        (error) => {
          console.error('Registration error', error);
         
        }
      );
  }
  
 
}
