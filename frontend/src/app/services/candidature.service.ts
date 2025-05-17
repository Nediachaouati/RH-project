import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

 
  private apiUrl = `${environment.apiUrl}/candidatures`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  applyToJob(jobId: number, cvFile: File, motivationLetterFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('jobOfferId', jobId.toString());
    formData.append('cv', cvFile);
    formData.append('coverLetter', motivationLetterFile);

    return this.http.post(`${this.apiUrl}/apply`, formData, {headers: this.getAuthHeaders()});
  }
  getRelevantCandidatures(offerId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/rh-candidatures/offer/${offerId}/relevant`, {headers: this.getAuthHeaders()});
  }
  getAllcandidaturesOneoffre(offerId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/rh-candidatures/offer/${offerId}`, {headers: this.getAuthHeaders()});
  }
  getMyCandidatures() {
    return this.http.get<any[]>(`${this.apiUrl}/my-candidatures`, {headers: this.getAuthHeaders()});
  }
  getAllCandidatures() {
    return this.http.get<any[]>(`${this.apiUrl}/rh-candidatures`, {headers: this.getAuthHeaders()});
  }
  updateStatus(offerId: string, status: string) {
    const body = { status }; 
    return this.http.patch<any>(`${this.apiUrl}/rh-candidatures/${offerId}/validate`, body, {
      headers: this.getAuthHeaders()
    });
  }
  countByStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/by-status`);
  }

  averageScorePerOffer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/average-score-per-offer`);
  }

  candidaturesPerMonth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/per-month`);
  }

}
