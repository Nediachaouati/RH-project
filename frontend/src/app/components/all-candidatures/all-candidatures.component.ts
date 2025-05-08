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
  constructor(private myCandService: CandidatureService){}
  ngOnInit(): void {
    this.myCandService.getAllCandidatures().subscribe({
      next:(data)=>{this.myCandidatures=data;},
      error:(err)=>{console.error('failed to load condidatures',err);}
    });
  }
  getPdfUrl(path:string): string{
    return `http://localhost:3000/${path.replace(/\\/g, '/')}`;
  }
}
