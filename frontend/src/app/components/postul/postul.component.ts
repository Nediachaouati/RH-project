import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobOfferService } from '../../services/job-offer.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CandidatureService } from '../../services/candidature.service';
@Component({
  selector: 'app-postul',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './postul.component.html',
  styleUrl: './postul.component.css'
})
export class PostulComponent implements OnInit {
  jobId: number;
  jobDetails: any; // This will hold the job details
  isLoading = true; // To show loading indicator while data is being fetched
  errorMessage: string;
  applicationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private jobOfferService: JobOfferService,
    private fb: FormBuilder,
    private http: HttpClient,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.jobId = +params['id']; // Grab job ID from URL
      console.log('Job ID:', this.jobId);
      this.fetchJobDetails(this.jobId); // Fetch job details
    });

    // Initialize form
    this.applicationForm = this.fb.group({
      cv: ['', Validators.required], // CV is required
      motivationLetter: ['', Validators.required], // Motivation Letter is required
    });
  }

  fetchJobDetails(id: number): void {
    this.jobOfferService.getJobDetails(id).subscribe(
      (data) => {
        this.jobDetails = data; // Store job details in a variable
        this.isLoading = false; // Hide loading indicator
      },
      (error) => {
        this.errorMessage = 'Could not fetch job details. Please try again later.';
        this.isLoading = false; // Hide loading indicator even if there's an error
      }
    );
  }

  // Handle file selection
  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.applicationForm.patchValue({
        [field]: file,
      });
    }
  }

  // Handle form submission
  onSubmit() {
    const cvFile = this.applicationForm.get('cv')?.value;
    const motivationLetterFile = this.applicationForm.get('motivationLetter')?.value;
  
    if (cvFile && motivationLetterFile) {
      this.candidatureService
        .applyToJob(this.jobId, cvFile, motivationLetterFile)
        .subscribe(
          (response) => {
            alert('Job offer added successfully!');
            window.location.reload();
          },
          (error) => {
            console.error('Error submitting application', error);
          }
        );
    } else {
      console.warn('Missing CV or motivation letter.');
    }
  }
}