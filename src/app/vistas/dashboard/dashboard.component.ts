import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { ReportesService } from '../../servicios/reportes.service';
import { Profile } from '../../interfaces/profile';
import { Top10User } from '../../interfaces/reportes';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: Profile | null = null

  // Estadísticas admin
  totalIdeas          = 0
  totalAhorro         = 0
  totalAhorroUsd      = 0
  totalPuntosContables    = 0
  totalPuntosNoContables  = 0
  top5: Top10User[]   = []
  statsLoaded         = false

  get totalPuntos() { return this.totalPuntosContables + this.totalPuntosNoContables }

  constructor(
    protected authService: AuthService,
    protected reportesService: ReportesService
  ) {}

  ngOnInit(): void {
    initFlowbite()
    const desdeLogin = sessionStorage.getItem('desdeLogin')
    if (desdeLogin === 'true') {
      sessionStorage.removeItem('desdeLogin')
      location.reload()
    }
    this.me()
  }

  me() {
    this.authService.meplus().subscribe({
      next: (value: Profile) => {
        this.user = value
        if (value.rol_id === 1) {
          this.loadAdminStats()
        }
      },
      error: (err) => console.log(err),
    })
  }

  loadAdminStats() {
    const TOTAL_CALLS = 5
    let completed = 0
    const done = () => { if (++completed >= TOTAL_CALLS) this.statsLoaded = true }

    this.reportesService.ideasTotalesHistoricas().subscribe({
      next: (r) => { this.totalIdeas = r.total_ideas; done() },
      error: (err) => { console.warn('ideasTotales:', err); done() }
    })

    this.reportesService.ahorroHistorico().subscribe({
      next: (r) => {
        this.totalAhorro    = r.msg.total_ahorros
        this.totalAhorroUsd = r.msg.total_ahorros_usd
        done()
      },
      error: (err) => { console.warn('ahorro:', err); done() }
    })

    this.reportesService.puntosContablesHistoricos().subscribe({
      next: (r) => { this.totalPuntosContables = r.msg.total_puntos; done() },
      error: (err) => { console.warn('puntosContables:', err); done() }
    })

    this.reportesService.puntosNoContablesHistoricos().subscribe({
      next: (r) => { this.totalPuntosNoContables = r.msg.total_puntos; done() },
      error: (err) => { console.warn('puntosNoContables:', err); done() }
    })

    this.reportesService.top10historico().subscribe({
      next: (r) => { this.top5 = r.historial.slice(0, 5); done() },
      error: (err) => { console.warn('top10:', err); done() }
    })
  }
}
