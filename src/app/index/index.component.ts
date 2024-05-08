import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [AppNavbarComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent  {

}
