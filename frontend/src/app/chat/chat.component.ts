import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  prompt: string = '';
  messages: string[] = [];
  isChatVisible: boolean = false; // New property to toggle visibility

  constructor(private http: HttpClient,private authService:AuthService) {}

  toggleChat() {
    this.isChatVisible = !this.isChatVisible; // Toggle visibility
  }
  isCandidat(): boolean {
    return this.authService.getUserRole()=='CANDIDAT';
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  sendMessage() {
    if (!this.prompt.trim()) return;

    const headers = this.getAuthHeaders();

    this.http.post('http://localhost:3000/chat', { prompt: this.prompt }, { headers }).subscribe(
      (response: any) => {
        // Access the 'result' property from the response
        const aiMessage = response.result || 'No response message';

        this.messages.push(`You: ${this.prompt}`, `AI: ${aiMessage}`);
        console.error('Response from server:', response);

        this.prompt = '';
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
}
}
