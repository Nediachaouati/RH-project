import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent { 
  LOGO: string = '../../../assests/icon.png';

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole()=='ADMIN';
  }
}
