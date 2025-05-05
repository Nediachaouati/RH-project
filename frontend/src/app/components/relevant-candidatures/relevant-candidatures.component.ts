import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../services/candidature.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relevant-candidatures',
  imports: [CommonModule],
  templateUrl: './relevant-candidatures.component.html',
  styleUrl: './relevant-candidatures.component.css'
})
export class RelevantCandidaturesComponent implements OnInit {
  relevantCandidatures: any[] = [];

  constructor(private route: ActivatedRoute, private service: CandidatureService) {}

  ngOnInit(): void {
    const offerId = this.route.snapshot.paramMap.get('id');
    if (offerId) {
      this.service.getRelevantCandidatures(offerId).subscribe((data) => {
        this.relevantCandidatures = data;
      });
    }
  }
}
