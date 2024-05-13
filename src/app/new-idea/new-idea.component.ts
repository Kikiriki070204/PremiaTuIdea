import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';

@Component({
  selector: 'app-new-idea',
  standalone: true,
  imports: [AppNavbarComponent],
  templateUrl: './new-idea.component.html',
  styleUrl: './new-idea.component.css'
})
export class NewIdeaComponent {

}
