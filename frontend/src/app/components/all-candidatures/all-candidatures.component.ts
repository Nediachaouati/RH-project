import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CandidatureService } from '../../services/candidature.service';

@Component({
  selector: 'app-all-candidatures',
  imports: [CommonModule],
  templateUrl: './all-candidatures.component.html',
  styleUrl: './all-candidatures.component.css'
})
export class AllCandidaturesComponent  implements OnInit{
  myCandidatures:any[]=[];
  groupedCandidatures: { [title: string]: any[] } = {};
  activeJob: string = ''; // Tracks active job title for sidebar

  constructor(private myCandService: CandidatureService) {}

  ngOnInit(): void {
    this.myCandService.getAllCandidatures().subscribe({
      next: (data) => {
        this.myCandidatures = data;
        this.groupByJobOfferTitle();
      },
      error: (err) => {
        console.error('failed to load candidatures', err);
      }
    });
  }

  groupByJobOfferTitle(): void {
    this.groupedCandidatures = {};

    for (const cand of this.myCandidatures) {
      const title = cand.jobOffer?.title || 'Sans titre';

      if (!this.groupedCandidatures[title]) {
        this.groupedCandidatures[title] = [];
      }

      this.groupedCandidatures[title].push(cand);
    }
  }

  getPdfUrl(path: string): string {
    return `http://localhost:3000/${path.replace(/\\/g, '/')}`;
  }
}