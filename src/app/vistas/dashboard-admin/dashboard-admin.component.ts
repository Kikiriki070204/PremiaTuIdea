import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  user: any = []
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // this.goToReportes()
    initFlowbite()
    this.getUser()
  }

  getUser() {
    this.user = this.authService.getUser()
    console.log(this.authService.getUser())
  }


  goToReportes() {
    this.router.navigate(['admin/reportes-admin'])
  }

}
