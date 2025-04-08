import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
getProfile(): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
}
  getRHList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/rh`, { headers: this.getAuthHeaders() });
  }

  getCandidatesList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/candidats`, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user, { headers: this.getAuthHeaders() });
  }

}
