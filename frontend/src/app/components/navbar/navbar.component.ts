import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { get } from 'node:http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent { 
  LOGO: string = 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RH_logo.svg';
  logoUrl: string = 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RH_logo.svg'; // Update the path to the rh.jpg image

  user: any ;

  constructor(public authService: AuthService,public userService:UserService, private router: Router) {}
  ngOnInit() {
    this.userService.getProfile().subscribe(
      (profile) => {
        this.user = profile; // Store the full user profile
        console.log(this.user); // Verify the user object in the console
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );
   }
   goToProfile() {
    this.router.navigate(['/profile'], { state: { user: this.user } });
  }
  logout() {
    this.authService.logout();
  }


  isAdmin(): boolean {
    return this.authService.getUserRole()=='ADMIN';
  }
  IsCandidat(): boolean {
    return this.authService.getUserRole()=='CANDIDAT';
  }
  IsRh(): boolean {
    return this.authService.getUserRole()=='RH';
  }
}
