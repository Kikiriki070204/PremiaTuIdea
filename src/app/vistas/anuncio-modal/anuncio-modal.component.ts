import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../enviroment/enviroment';

@Component({
  selector: 'app-anuncio-modal',
  standalone: true,
  imports: [],
  templateUrl: './anuncio-modal.component.html',
  styleUrl: './anuncio-modal.component.css'
})
export class AnuncioModalComponent implements OnInit {
  visible = false;
  anuncio: { mensaje: string; dias: number; updated_at: string } | null = null;
  safeHtml: SafeHtml = '';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.api_url}/anuncios/current`).subscribe({
      next: (res) => {
        if (!res.visible) return;
        const key = `anuncio_visto_${res.updated_at}`;
        if (localStorage.getItem(key)) return;
        this.anuncio = res;
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(res.mensaje ?? '');
        this.visible = true;
      },
      error: () => {}
    });
  }

  cerrar(): void {
    if (this.anuncio) {
      localStorage.setItem(`anuncio_visto_${this.anuncio.updated_at}`, '1');
    }
    this.visible = false;
  }
}
