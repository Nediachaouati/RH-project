import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-password',
  imports: [
    ReactiveFormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup;
  currentUser: User | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.updatePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Failed to fetch user profile', err);
      }
    });
  }
  onSubmit(): void {
    const { currentPassword, newPassword, confirmPassword } = this.updatePasswordForm.value;
  
    if (this.updatePasswordForm.invalid) {
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
  
    // Update the user's password
    const updatedUser = { ...this.currentUser, password: newPassword };
    this.userService.updateProfile(updatedUser).subscribe({
      next: () => {
        // Show the modal
        const modalElement = document.getElementById('logoutModal');
        // Ensure Bootstrap is imported
        import('bootstrap').then((bootstrap: any) => {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }).catch((err) => {
          console.error('Failed to load Bootstrap library', err);
        });
      },
      error: (err) => {
        console.error('Failed to update password', err);
      },
    });
  }
  logout(): void {
   
    localStorage.clear();
    alert('You have been logged out.');
    window.location.href = '/login'; 
  }

  stayOnPage(): void {
   
    alert('Redirecting to the home page.');
    window.location.href = '/'; 
  }
}
