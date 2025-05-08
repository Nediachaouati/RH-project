import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { JobOffer } from '../models/job-offer.model';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = `${environment.apiUrl}/job-offer`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }
  getJobOfferspublic(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/public`, { headers: this.getAuthHeaders() });
  }
  getJobOfferById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  getJobDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/offer/${id}`,{ headers: this.getAuthHeaders() });
  }
  createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.apiUrl}/add`, jobOffer, { headers: this.getAuthHeaders() });
  }

  updateJobOffer(id: number, jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.patch<JobOffer>(`${this.apiUrl}/${id}`, jobOffer, { headers: this.getAuthHeaders() });
  }

  deleteJobOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }



  updateJob(id: number, jobData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
