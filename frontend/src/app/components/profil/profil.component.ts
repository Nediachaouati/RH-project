import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
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
      next: (profile) => {
        this.user = profile;

        // Prepend backend URL to the photo path if it exists
        if (this.user.photo) {
          this.user.photo = `http://localhost:3000/${this.user.photo}`;
        }

        console.log('User profile photo:', this.user.photo);
        console.log('User profile fetched:', this.user);
      },
      error: (err) => console.error('Error fetching profile:', err)
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
    return this.authService.getUserRole()=='CANDIDAT';
  }

  updateProfile(): void {
    if (this.user) {
      this.userService.updateProfile(this.user).subscribe({
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
