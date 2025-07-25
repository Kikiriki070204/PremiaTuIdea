import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-ideas-admin',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './ideas-admin.component.html',
  styleUrl: './ideas-admin.component.css'
})
export class IdeasAdminComponent implements OnInit {

  constructor(
    protected router: Router,
  ) { }

  ngOnInit(): void {
    // this.router.navigateByUrl('/admin/ideas-admin/revision');
  }



}
