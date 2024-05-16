import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-idea-data',
  standalone: true,
  imports: [],
  templateUrl: './idea-data.component.html',
  styleUrl: './idea-data.component.css'
})
export class IdeaDataComponent implements OnInit{

  constructor(private activatedRoute: ActivatedRoute) {}

ngOnInit() {
  this.activatedRoute.params.subscribe(params => {
    var idea_id = params['id']; 
  });
}
}
