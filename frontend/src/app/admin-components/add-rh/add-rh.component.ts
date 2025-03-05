import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-rh',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-rh.component.html',
  styleUrls: ['./add-rh.component.css']
})
export class AddRhComponent {
  addRhForm: FormGroup;
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.addRhForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  onSubmit() {
    if (this.addRhForm.valid) {
      this.http.post(`${this.apiUrl}/add-rh`, this.addRhForm.value, { headers: this.getAuthHeaders() }).subscribe(response => {
        console.log('RH added successfully', response);
        this.router.navigate(['/rh-list']);
      }, error => {
        console.error('Error adding RH', error);
      });
    }
  }
}
