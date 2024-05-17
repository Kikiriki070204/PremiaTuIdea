import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdeasService } from '../../servicios/ideas.service';
import { IdeaData } from '../../interfaces/idea';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';

@Component({
  selector: 'app-idea-data',
  standalone: true,
  imports: [AppNavbarComponent],
  templateUrl: './idea-data.component.html',
  styleUrl: './idea-data.component.css'
})
export class IdeaDataComponent implements OnInit{
idea: IdeaData | null = null
idea_id: number | null = null
  constructor(private activatedRoute: ActivatedRoute, protected ideaService: IdeasService) {}

ngOnInit() {
  this.activatedRoute.params.subscribe(params => {
    var idea_id = params['id']; 
    this.idea_id = idea_id
    console.log(params['id'])
  });
  this.ideaData()
}

ideaData(): void
  {
    this.ideaService.ideaData(this.idea_id)
    .subscribe(myIdeas => {
      this.idea = myIdeas;
      console.log(this.idea)
    }); 
  }

}
