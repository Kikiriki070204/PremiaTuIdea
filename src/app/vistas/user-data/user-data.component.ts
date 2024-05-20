import { Component } from '@angular/core';
import { AppNavbarComponent } from '../app-navbar/app-navbar.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [AppNavbarComponent, NgFor],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent {

}
