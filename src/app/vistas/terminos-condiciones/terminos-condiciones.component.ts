import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuillEditorComponent } from 'ngx-quill';
import { AuthService } from '../../servicios/auth.service';
import { TerminosService, TerminosImagen, TerminosSeccion } from '../../servicios/terminos.service';

export interface TabConfig {
  key: string;
  label: string;
  baseTitle: string;
}

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillEditorComponent],
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.css',
})
export class TerminosCondicionesComponent implements OnInit {
  activeTab = 'sec1';
  isAdmin = false;

  editingSection: string | null = null;
  editBases = '';
  editPremiacion = '';
  saving = false;
  uploadingSlot: number | null = null;
  toast: { msg: string; ok: boolean } | null = null;

  apiData: Record<string, TerminosSeccion> = {};

  readonly editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [2, 3, false] }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  readonly tabs: TabConfig[] = [
    { key: 'sec1', label: 'Ideas (Premia tu idea)',      baseTitle: 'Puntaje para las ideas' },
    { key: 'sec2', label: 'Lean Workshops',              baseTitle: 'Puntaje para workshops' },
    { key: 'sec3', label: 'Cambio de nivel de técnicos', baseTitle: 'Puntaje para cambio de nivel de técnicos' },
    { key: 'sec4', label: 'Scrap y mejora continua',     baseTitle: 'Puntaje para proyectos de scrap y mejora continua' },
    { key: 'sec5', label: 'OE',                          baseTitle: 'Puntaje para proyectos de OE' },
    { key: 'sec6', label: 'Ahorro de energía',           baseTitle: 'Puntaje para proyectos de ahorro de energía' },
  ];

  private readonly defaultBases: Record<string, string> = {
    sec1: `<ul><li>Las ideas serán evaluadas por el comité OpEx, el estatus del proyecto o idea se encontrará disponible dentro de la sección de tus ideas.</li><li>La idea <strong>NO</strong> puede ser un proyecto que se te haya asignado por tus funciones o responsabilidades.</li><li>Si la propuesta es colectiva, los puntos se dividirán entre los colaboradores de la idea.</li><li>En caso de ser rechazada tu primer idea, se te otorgaran 20 puntos por única ocasión.</li></ul>`,
    sec2: `<ul><li>Las ideas serán evaluadas por el comité OpEx, el estatus del proyecto o idea se encontrará disponible dentro de la sección de tus ideas.</li><li>La idea <strong>NO</strong> puede ser un proyecto que se te haya asignado por tus funciones o responsabilidades.</li><li>Si la propuesta es colectiva, los puntos se dividirán entre los colaboradores de la idea.</li></ul>`,
    sec3: `<ul><li>Solo se podrá realizar un proyecto por año y deberá ser uno aprobado por su jefe y seguridad.</li><li>Solo se puede subir un nivel anualmente, independientemente del ahorro en USD logrado.</li><li>En caso de superar la meta establecida para su cambio de nivel, se te asignará el 10% del excedente del ahorro en puntos para poder intercambiarlos por premios.</li></ul>`,
    sec4: `<p>El rendimiento por medio de bonos se realizará cuando los proyectos lleven el % de scrap vs ventas por debajo de su meta.</p><ul><li>El bono será repartido entre los miembros del equipo de Solución de Problemas.</li><li>El bono será calculado de manera mensual y se pagará de manera trimestral.</li><li>Si los proyectos están enfocados en 1 segmento de línea, la meta del % del scrap vs ventas será calculada dividiendo el métrico de toda la línea entre el número de segmentos con equipos de solución de problemas.</li><li>El bono de los proyectos cerrados no es acumulativo, cada proyecto será premiado solo una vez.</li><li>El retrabajo o contenciones de calidad no serán consideradas como acciones correctivas.</li><li>La efectividad de las acciones correctivas será evaluada 1 mes después de la implementación de estas.</li><li>Las metas de % de scrap vs ventas serán redefinidas después de la implementación de acciones correctivas de proyectos.</li><li>Las mejoras relacionadas a cambios de diseño generados externamente o mejoras de precios de componentes no serán consideradas como acciones correctivas.</li></ul>`,
    sec5: `<p>El reconocimiento con bono se obtendrá cuando el proyecto lleve el impacto en %OE por "Equipment Breakdown" registrado en OMS por debajo de la meta definida.</p><ul><li>El bono será repartido entre los miembros del equipo de solución de problemas.</li><li>Los equipos deberán ser conformados por al menos 1 coordinador de mantenimiento y un técnico de mantenimiento, el número máximo de miembros en el equipo es de 3 personas.</li><li>El reconocimiento-bono del proyecto cerrado no es acumulativo, cada proyecto será premiado solo 1 vez.</li><li>La efectividad de las acciones correctivas será evaluada 1 mes después de la implementación.</li><li>Los eventos con una causa especial ("1 timer") no serán considerados como proyectos de mejora.</li><li>Los meses atípicos con bajas ventas o paros de línea no serán considerados para el cálculo del bono.</li><li>El bono será calculado de manera mensual y se pagará de manera trimestral.</li></ul>`,
    sec6: `<ul><li>Las ideas serán evaluadas por el comité OpEx, el estatus del proyecto o idea se encontrará disponible dentro de la sección de tus ideas.</li><li>La idea <strong>NO</strong> puede ser un proyecto que se te haya asignado por tus funciones o responsabilidades.</li><li>Si la propuesta es colectiva, los puntos se dividirán entre los colaboradores de la idea.</li><li>En caso de ser rechazada tu primer idea, se te otorgaran 20 puntos por única ocasión.</li></ul>`,
  };

  private readonly defaultImages: Record<string, Array<{title: string; src: string; wide?: boolean}>> = {
    sec1: [
      { title: 'Ideas no contables',    src: 'assets/ideas no contables.png' },
      { title: 'Ideas contables',        src: 'assets/ideas contables2.png' },
      { title: 'Tabulación de puntaje en base al 10% del excedente de la meta', src: 'assets/tabulacion de puntos actualizada.png', wide: true },
    ],
    sec2: [
      { title: 'Tabulación de puntaje en base al 10% del excedente de la meta', src: 'assets/tabulacion de puntos actualizada.png', wide: true },
    ],
    sec3: [
      { title: 'Tabulación de puntaje en base al 10% del excedente de la meta', src: 'assets/tabulacion de puntos actualizada.png', wide: true },
    ],
    sec6: [
      { title: 'Proyectos',             src: 'assets/ideas contables2.png',                  wide: true },
      { title: 'Tabulación de puntaje en base al 10% del excedente de la meta', src: 'assets/ahorro de energía actualizado.png', wide: true },
    ],
  };

  private readonly defaultPremiacion: Record<string, string> = {
    sec1: `<ul><li>Después de los $4,500 USD de ahorro se darán 325 puntos independientemente de cuánto ahorro se consiga.</li></ul>`,
    sec2: `<ul><li>El premio en puntos será evaluado con el 10% del excedente de la meta establecida y seguirá las reglas aplicadas en el origen de Premia Tu Idea.</li><li>Se otorgarán 15 puntos de gratificación por haber participado.</li><li>Recursos humanos otorgará un diploma por la participación y un presente.</li><li>Se otorgarán 2 puntos por registrar un proyecto, pero al completar 3 rechazadas ya no se otorgarán puntos por simplemente registrarlo.</li></ul>`,
    sec3: `<ul><li>Existen 6 niveles de técnicos, técnico 1, 2 y 3, y técnico especial 1, 2, y 3. Para pasar de nivel 1 a 2 de técnico se necesita llegar a una meta mínima de 1,200 USD y así va aumentando el mínimo en 200 USD para los siguientes niveles.</li><li>El premio será el 10% del excedente de la meta establecida, siguiendo el criterio de Premia Tu Idea.</li><li>En caso de no exceder la meta establecida se gratificará con 15 puntos.</li><li>Se otorgarán 2 puntos por registrar un proyecto, pero al completar 3 rechazadas ya no se otorgarán puntos por simplemente registrarlo.</li></ul>`,
    sec4: `<p>El porcentaje del bono será calculado en base al 10% del ahorro del proyecto con un tope máximo de 11,000 pesos.</p><p>Cualquier otra situación no considerada en las condiciones será evaluada por el Staff de la planta.</p>`,
    sec5: `<p>El bono será calculado en base a los siguientes criterios de impacto:</p><ol><li><strong>Tiempo extra:</strong> El gasto en dólares evitado por la producción no realizada por las fallas del equipo.</li><li><strong>Mejoras en tiempos de ciclo</strong> que ayudarán a incrementar la salida de piezas.</li></ol><p>Cualquier otra situación no considerada en las condiciones será evaluada por el Staff de la planta.</p>`,
    sec6: `<ul><li>Después de los $4,835 USD de ahorro se darán 325 puntos independientemente de cuánto ahorro se consiga.</li></ul>`,
  };

  constructor(
    private authService: AuthService,
    private terminosService: TerminosService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authService.meplus().subscribe({
      next: (p: any) => { this.isAdmin = p?.rol_id === 1; },
      error: () => {},
    });
    this.terminosService.getAll().subscribe({
      next: (data) => { this.apiData = data.secciones || {}; },
      error: () => {},
    });
  }

  getTabConfig(key: string): TabConfig {
    return this.tabs.find(t => t.key === key)!;
  }

  getBasesHtml(sec: string): SafeHtml {
    const html = this.apiData[sec]?.bases_html ?? this.defaultBases[sec] ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getPremiacionHtml(sec: string): SafeHtml {
    const html = this.apiData[sec]?.premiacion_html ?? this.defaultPremiacion[sec] ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getApiImages(sec: string): TerminosImagen[] {
    return this.apiData[sec]?.imagenes ?? [];
  }

  getDefaultImages(sec: string): Array<{title: string; src: string; wide?: boolean}> {
    return this.defaultImages[sec] ?? [];
  }

  getApiImageForSlot(sec: string, orden: number): TerminosImagen | undefined {
    return this.getApiImages(sec).find(img => img.orden === orden);
  }

  startEdit(sec: string): void {
    this.editBases      = this.apiData[sec]?.bases_html      ?? this.defaultBases[sec]      ?? '';
    this.editPremiacion = this.apiData[sec]?.premiacion_html  ?? this.defaultPremiacion[sec] ?? '';
    this.editingSection = sec;
  }

  cancelEdit(): void {
    this.editingSection = null;
  }

  saveEdit(): void {
    if (!this.editingSection) return;
    const sec = this.editingSection;
    this.saving = true;

    this.terminosService.update(sec, this.editBases, this.editPremiacion).subscribe({
      next: () => {
        if (!this.apiData[sec]) {
          this.apiData[sec] = { bases_html: null, premiacion_html: null, imagenes: [] };
        }
        this.apiData[sec].bases_html      = this.editBases;
        this.apiData[sec].premiacion_html  = this.editPremiacion;
        this.editingSection = null;
        this.saving = false;
        this.showToast('Sección guardada correctamente', true);
      },
      error: () => {
        this.saving = false;
        this.showToast('Error al guardar, intenta de nuevo', false);
      },
    });
  }

  uploadImagenForSlot(event: Event, sec: string, orden: number): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    this.uploadingSlot = orden;

    this.terminosService.uploadImagen(sec, file, orden).subscribe({
      next: (img) => {
        if (!this.apiData[sec]) {
          this.apiData[sec] = { bases_html: null, premiacion_html: null, imagenes: [] };
        }
        const idx = this.apiData[sec].imagenes.findIndex(i => i.orden === orden);
        if (idx >= 0) {
          this.apiData[sec].imagenes[idx] = img;
        } else {
          this.apiData[sec].imagenes.push(img);
        }
        this.uploadingSlot = null;
        this.showToast('Imagen subida correctamente', true);
        input.value = '';
      },
      error: () => {
        this.uploadingSlot = null;
        this.showToast('Error al subir la imagen', false);
      },
    });
  }

  deleteImagen(id: number): void {
    if (!this.editingSection) return;
    const sec = this.editingSection;

    this.terminosService.deleteImagen(id).subscribe({
      next: () => {
        if (this.apiData[sec]) {
          this.apiData[sec].imagenes = this.apiData[sec].imagenes.filter(i => i.id !== id);
        }
        this.showToast('Imagen eliminada', true);
      },
      error: () => this.showToast('Error al eliminar la imagen', false),
    });
  }

  switchTab(key: string): void {
    this.cancelEdit();
    this.activeTab = key;
  }

  showToast(msg: string, ok: boolean): void {
    this.toast = { msg, ok };
    setTimeout(() => (this.toast = null), 3500);
  }
}
