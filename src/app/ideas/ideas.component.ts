import { Component, OnInit } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Idea } from '../interfaces/idea';
import { IdeasService } from '../servicios/ideas.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [AppNavbarComponent, NgFor],
  templateUrl: './ideas.component.html',
  styleUrl: './ideas.component.css'
})
export class IdeasComponent implements OnInit{
 ideas: Idea[] = []

 constructor(protected ideaService: IdeasService, protected router: Router){}
  ngOnInit(): void {
    this.misIdeas()
  }

  misIdeas(): void
  {
    this.ideaService.allIdeas()
    .subscribe(myIdeas => {
      this.ideas = myIdeas.ideas;
      console.log(this.ideas)
    }); 
  }
}
