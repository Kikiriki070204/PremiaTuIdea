import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.goToReportes()
    initFlowbite()
  }

  goToReportes() {
    this.router.navigate(['admin/reportes-admin'])
  }

}
