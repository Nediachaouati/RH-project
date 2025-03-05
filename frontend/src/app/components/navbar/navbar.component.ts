import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent { 
  LOGO: string = '../../../assests/icon.png';
  logoUrl: string = 'assets/logo.png'; 

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole()=='ADMIN';
  }
}
