import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobOfferService } from '../../services/job-offer.service';
import { Router } from 'express';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-user',
  imports: [CommonModule,FormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  userId: string | null = null;
  user: any = {}; // Replace with your user model if available

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((data) => {
        this.user = data;
        console.log(this.user);
      });
    }
  }

  updateUser(): void {
    this.userService.updateUser(this.userId, this.user).subscribe(() => {
      alert('User updated successfully!');
    });
  }
}
