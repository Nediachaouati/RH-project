import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rh-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rh-list.component.html',
  styleUrls: ['./rh-list.component.css']
})
export class RhListComponent implements OnInit {
  rhList: User[] = [];

  constructor(private userService: UserService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userService.getRHList().subscribe((data) => {
      this.rhList = data;
    });
  }

  // addRh() {
  //   const newRh = { name: 'New RH', email: 'newrh@example.com', password: 'password123' };
  //   this.http.post('/api/users/add-rh', newRh).subscribe(response => {
  //     console.log('RH added successfully', response);
  //     this.ngOnInit(); // Refresh the list
  //   }, error => {
  //     console.error('Error adding RH', error);
  //   });
  // }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.rhList = this.rhList.filter(candidate => candidate.id !== id);
          alert('User deleted successfully.');
        },
        error: (error) => {
          console.error('Delete error', error);
          alert('Failed to delete user.');
        }
      });
    }
  }

  navigateToAddRh() {
    this.router.navigate(['/add-rh']);
  }
}
