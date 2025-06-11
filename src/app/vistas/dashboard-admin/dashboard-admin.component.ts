import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    initFlowbite()
  }



}
