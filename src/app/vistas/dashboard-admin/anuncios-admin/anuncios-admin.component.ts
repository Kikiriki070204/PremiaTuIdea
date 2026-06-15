import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroment/enviroment';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-anuncios-admin',
  standalone: true,
  imports: [FormsModule, QuillEditorComponent],
  templateUrl: './anuncios-admin.component.html',
  styleUrl: './anuncios-admin.component.css'
})
export class AnunciosAdminComponent implements OnInit {
  activo    = false
  mensaje   = ''
  dias      = 0
  guardando = false
  toast: { text: string; ok: boolean } | null = null
  private toastTimer: any

  editorModules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'clean'],
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.api_url}/anuncios/config`).subscribe({
      next: (r) => {
        this.activo  = r.activo
        this.mensaje = r.mensaje ?? ''
        this.dias    = r.dias ?? 0
      },
      error: () => {}
    })
  }

  guardar(): void {
    this.guardando = true
    this.toast = null
    this.http.put<any>(`${environment.api_url}/anuncios/update`, {
      activo:  this.activo,
      mensaje: this.mensaje,
      dias:    this.dias
    }).subscribe({
      next: () => {
        this.guardando = false
        this.showToast('El anuncio fue publicado correctamente.', true)
      },
      error: () => {
        this.guardando = false
        this.showToast('Hubo un error al guardar. Intenta de nuevo.', false)
      }
    })
  }

  private showToast(text: string, ok: boolean): void {
    clearTimeout(this.toastTimer)
    this.toast = { text, ok }
    this.toastTimer = setTimeout(() => { this.toast = null }, 5000)
  }
}
