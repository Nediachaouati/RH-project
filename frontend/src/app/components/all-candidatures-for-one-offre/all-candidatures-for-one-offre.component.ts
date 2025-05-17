import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidatureService } from '../../services/candidature.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-all-candidatures-for-one-offre',
  imports: [CommonModule],
  templateUrl: './all-candidatures-for-one-offre.component.html',
  styleUrl: './all-candidatures-for-one-offre.component.css'
})
export class AllCandidaturesForOneOffreComponent {
  relevantCandidatures: any[] = [];
  offer:any;
  constructor(private route: ActivatedRoute, private service: CandidatureService,private http:HttpClient) {}

  ngOnInit(): void {
    const offerId = this.route.snapshot.paramMap.get('id');
    this.offer=offerId;
    if (offerId) {
      this.service.getAllcandidaturesOneoffre(offerId).subscribe((data) => {
        this.relevantCandidatures = data;
      });
    }
  }
  getPdfUrl(path:string): string{
    return `http://localhost:3000/${path.replace(/\\/g, '/')}`;
  }
}
