import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../services/job-offer.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-job',
  imports: [CommonModule,
      FormsModule],
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.css']
})
export class UpdateJobComponent implements OnInit {
  jobId!: number;
  jobData: any = {}; // Holds the job data to pre-fill the form

  constructor(
    private route: ActivatedRoute,
    private jobOfferService: JobOfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
   
    this.jobId = +this.route.snapshot.paramMap.get('id')!;
    
    
    this.jobOfferService.getJobOfferById(this.jobId).subscribe({
      next: (data) => {
        this.jobData = data; 
      },
      error: (err) => {
        console.error('Error fetching job data:', err);
      }
    });
  }

  updateJob(): void {
    this.jobOfferService.updateJobOffer(this.jobId, this.jobData).subscribe({
      next: (response) => {
        console.log('Job offer updated successfully:', response);
        alert('Job offer updated successfully!');
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error updating job offer:', err);
        alert('Failed to update job offer. Please try again.');
      }
    });
  }
}
