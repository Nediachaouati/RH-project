import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedJob: any = null;

  constructor(public authService: AuthService, private router: Router) {}

  jobListings = [
    { title: "Conducteur de Travaux", company: "MCF", location: "Radès, Ben Arous, Tunisie", date: "01/03/2025", description: "Job description here..." },
    { title: "Opérateur Conducteur de Machines", company: "Optylab", location: "Sfax, Tunisie", date: "01/03/2025", description: "Job description here..." },
    { title: "Responsable de Production", company: "Entreprise X", location: "Tunis, Tunisie", date: "01/03/2025", description: "Job description here..." },
    { title: "Conducteur de Travaux", company: "MCF", location: "Radès, Ben Arous, Tunisie", date: "01/03/2025", description: "Job description here..." },
    { title: "Opérateur Conducteur de Machines", company: "Optylab", location: "Sfax, Tunisie", date: "01/03/2025", description: "Job description here..." },
    { title: "Responsable de Production", company: "Entreprise X", location: "Tunis, Tunisie", date: "01/03/2025", description: "Job description here..." }
  ];

  openJobDetails(job: any) {
    this.selectedJob = job;
  }

  closeJobDetails() {
    this.selectedJob = null;
  }

  applyForJob() {
    if (!this.authService.isLoggedIn()) {
      alert('You have to log in first.');
      this.router.navigate(['/login']);
    } else {
      
      alert('Application submitted successfully.');
    }
  }
}
