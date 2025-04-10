import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-profil',
  imports: [
    CommonModule,
    FormsModule, 
    RouterModule
  ],
  standalone: true,
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user: User | null = null;
  isEditing: boolean = true;
  loading: boolean = true;

  constructor(private authService:AuthService,private router: Router,private http: HttpClient,private userService:UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        console.log('User data:', this.user); // Check if all fields are populated
      },
      error: (err) => {
        console.error('Failed to fetch user profile', err);
      }
    });
  }
  // .
  editProfile(): void {
    console.log('Edit Profile button clicked');
   
  }
  
  saveProfile(): void {
    console.log('Save Profile button clicked');
   
  }
  toggleEdit(): void {
    this.isEditing = false; 
    console.log('Edit mode:', this.isEditing);
  }
  isCandidat(): boolean {
    return this.user?.role === 'CANDIDAT'; // Ensure the role matches your logic
  }

  updateProfile(): void {
    if (this.user) {
      const { password, ...userWithoutPassword } = this.user; // Exclude password
      console.log('Payload being sent:', userWithoutPassword);
      this.userService.updateProfile(userWithoutPassword).subscribe({
        next: (updatedUser) => {
          console.log('Profile updated successfully:', updatedUser);
          alert('Profile updated successfully!');
          this.isEditing = true; 
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert('Failed to update profile. Please try again.');
        }
      });
    }
  }
}
