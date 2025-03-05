import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  candidates: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCandidatesList().subscribe((data) => {
      this.candidates = data;
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.candidates = this.candidates.filter(candidate => candidate.id !== id);
          alert('User deleted successfully.');
        },
        error: (error) => {
          console.error('Delete error', error);
          alert('Failed to delete user.');
        }
      });
    }
  }
}
