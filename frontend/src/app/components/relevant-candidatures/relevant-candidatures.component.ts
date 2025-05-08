import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../services/candidature.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-relevant-candidatures',
  imports: [CommonModule],
  templateUrl: './relevant-candidatures.component.html',
  styleUrl: './relevant-candidatures.component.css'
})
export class RelevantCandidaturesComponent implements OnInit {
  relevantCandidatures: any[] = [];
  offer:any;
  constructor(private route: ActivatedRoute, private service: CandidatureService,private http:HttpClient) {}

  ngOnInit(): void {
    const offerId = this.route.snapshot.paramMap.get('id');
    this.offer=offerId;
    if (offerId) {
      this.service.getRelevantCandidatures(offerId).subscribe((data) => {
        this.relevantCandidatures = data;
      });
    }
  }

  updateStat(candidatureId: string, newStatus: string) {
    this.service.updateStatus(candidatureId, newStatus).subscribe({
      next: (res) => {
        console.log('Status updated successfully', res);
        // Optional: update UI immediately
        const item = this.relevantCandidatures.find(c => c.id === candidatureId);
        if (item) item.status = newStatus;
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
  }
}
