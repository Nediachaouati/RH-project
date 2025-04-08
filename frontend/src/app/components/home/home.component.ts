import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { JobOfferService } from '../../services/job-offer.service';
import { JobOffer } from '../../models/job-offer.model';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { response } from 'express';

@Component({
  selector: 'app-home',
  imports: [CommonModule,
    FormsModule,
  RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedJob: JobOffer | null = null;
  jobListings: JobOffer[] = [];
  newOffer: any = {}; 
  newJobOffer: any = {};
  filteredJobListings = [...this.jobListings]; // Copy of job listings for filtering
  filterJobTitle: string = ''; // Variable to hold the filter input

  constructor(
    public authService: AuthService,
    private jobOfferService: JobOfferService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userRole = this.authService.getUserRole(); 
    if (userRole=== 'RH') {
      this.jobOfferService.getJobOffers().subscribe(
        (offers) => {
          this.jobListings = offers;
          this.filteredJobListings = [...this.jobListings];
        },
        (error) => {
          console.error('Error fetching job offers:', error);
        }
      );
    } else {
      this.jobOfferService.getJobOfferspublic().subscribe(
        (offers) => {
          this.jobListings = offers;
          this.filteredJobListings = [...this.jobListings];
        },
        (error) => {
          console.error('Error fetching job offers:', error);
        }
      );
    }
  }

  addJobOffer(): void {
    this.jobOfferService.createJobOffer(this.newJobOffer as JobOffer).subscribe({
      next: (response) => {
        console.log('Job offer added successfully:', response);
        alert('Job offer added successfully!');
        this.router.navigate(['/']);
        window.location.reload();
      },
      error: (err) => {
        console.error('Error adding job offer:', err);
        alert('Failed to add job offer. Please try again.');
      }
    });
  }
 isRH(): boolean {
    return this.authService.getUserRole()=='RH';
  }
 isCandidat(): boolean {
    return this.authService.getUserRole()=='CANDIDAT';
  }

  openJobDetails(job: JobOffer): void {
    this.selectedJob = job;
  }

  closeJobDetails(): void {
    this.selectedJob = null;
  }

  applyForJob(): void {
    if (!this.authService.isLoggedIn()) {
      alert('You have to log in first.');
      this.router.navigate(['/login']);
    } else {
      alert('Application submitted successfully.');
    }
  }
  applyFilters() {
    if (this.filterJobTitle.trim()) {
      this.filteredJobListings = this.jobListings.filter(job =>
        job.title.toLowerCase().includes(this.filterJobTitle.toLowerCase().trim())
      );
    } else {
      this.filteredJobListings = [...this.jobListings];
    }
  }
  deleteJob(id:number):void{
    if(confirm("are you sure to delete this Job offer")){
      this.jobOfferService.deleteJobOffer(id).subscribe({
        next:(response)=>{
          console.log('Job offer deleted successfully:', response);
          alert('Job offer deleted successfully!');
          window.location.reload();
        },
        error:(err)=>{
          console.error('Error deleting job offer:', err);
          alert('Failed to delete job offer. Please try again.');
        }
      })
    }
  }
}
