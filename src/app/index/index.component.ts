import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [AppNavbarComponent, RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent  {

}
