import { Component, OnInit } from '@angular/core';
import { CandidatureService } from '../../services/candidature.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-candidatures',
  imports: [CommonModule],
  templateUrl: './my-candidatures.component.html',
  styleUrl: './my-candidatures.component.css'
})
export class MyCandidaturesComponent implements OnInit{
  myCandidatures:any[]=[];
  constructor(private myCandService: CandidatureService){}
  ngOnInit(): void {
    this.myCandService.getMyCandidatures().subscribe({
      next:(data)=>{this.myCandidatures=data;},
      error:(err)=>{console.error('failed to load condidatures',err);}
    });
  }
  getPdfUrl(path:string): string{
    return `http://localhost:3000/${path.replace(/\\/g, '/')}`;
  }
}
