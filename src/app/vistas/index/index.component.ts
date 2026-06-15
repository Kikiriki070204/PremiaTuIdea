import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { CarruselService } from '../../servicios/carrusel.service';
import { CarruselImagen } from '../../interfaces/carrusel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoggedIn = false;
  stat1 = 0;
  stat2 = 0;
  stat3 = 0;

  carruselImagenes: CarruselImagen[] = [];
  carruselIndex = 0;
  private carruselTimer: any = null;

  private observers: IntersectionObserver[] = [];
  private animFrame = 0;
  private scrollHandler = () => this.onScroll();
  private resizeHandler = () => this.onResize();

  constructor(
    protected authService: AuthService,
    protected router: Router,
    private ngZone: NgZone,
    private carruselService: CarruselService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn && this.authService.getRoleId() === 1) {
      this.router.navigate(['/admin']);
    }
    this.carruselService.list().subscribe({
      next: res => {
        this.carruselImagenes = res.imagenes;
        if (this.carruselImagenes.length > 1) this.startCarrusel();
      },
      error: () => {}
    });
  }

  carruselImageUrl(id: number): string {
    return this.carruselService.imageUrl(id);
  }

  carruselPrev(): void {
    this.carruselIndex = (this.carruselIndex - 1 + this.carruselImagenes.length) % this.carruselImagenes.length;
    this.resetCarruselTimer();
  }

  carruselNext(): void {
    this.carruselIndex = (this.carruselIndex + 1) % this.carruselImagenes.length;
    this.resetCarruselTimer();
  }

  carruselGoTo(i: number): void {
    this.carruselIndex = i;
    this.resetCarruselTimer();
  }

  private startCarrusel(): void {
    this.carruselTimer = setInterval(() => {
      this.ngZone.run(() => {
        this.carruselIndex = (this.carruselIndex + 1) % this.carruselImagenes.length;
      });
    }, 4000);
  }

  private resetCarruselTimer(): void {
    if (this.carruselTimer) clearInterval(this.carruselTimer);
    if (this.carruselImagenes.length > 1) this.startCarrusel();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initParticles();
      this.initMouseGlow();
      this.initParallax();
      this.initScrollProgress();
      this.initTilt();
    });
    this.initScrollReveal();
    this.initStatsCounter();
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
    cancelAnimationFrame(this.animFrame);
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
    if (this.carruselTimer) clearInterval(this.carruselTimer);
  }

  dashboard(): void { this.router.navigate(['/dashboard']); }

  // ── Partículas (canvas) ──────────────────────────────────────
  private initParticles(): void {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const pts: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.8 + 0.4,
      a:  Math.random() * 0.55 + 0.1,
    }));

    const D = 130;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,215,255,${p.a})`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < D) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(140,195,255,${(1 - d / D) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      this.animFrame = requestAnimationFrame(draw);
    };
    draw();
  }

  // ── Glow que sigue el mouse ──────────────────────────────────
  private initMouseGlow(): void {
    const hero = document.querySelector('.hero-bg') as HTMLElement;
    if (!hero) return;
    hero.addEventListener('mousemove', (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty('--my', `${((e.clientY - r.top)  / r.height) * 100}%`);
    });
  }

  // ── Parallax orbes al scroll ─────────────────────────────────
  private initParallax(): void {
    const o1 = document.querySelector('.orb-1') as HTMLElement;
    const o2 = document.querySelector('.orb-2') as HTMLElement;
    const o3 = document.querySelector('.orb-3') as HTMLElement;
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      if (o1) o1.style.transform = `translate(${s * 0.06}px, ${-s * 0.09}px)`;
      if (o2) o2.style.transform = `translate(${-s * 0.05}px, ${s * 0.07}px)`;
      if (o3) o3.style.transform = `translate(${s * 0.03}px, ${-s * 0.04}px)`;
    }, { passive: true });
  }

  // ── Barra de progreso de scroll ──────────────────────────────
  private initScrollProgress(): void {
    const bar = document.getElementById('scroll-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${(window.scrollY / total) * 100}%`;
    }, { passive: true });
  }

  // ── Tilt 3D en cards ─────────────────────────────────────────
  private initTilt(): void {
    const cards = document.querySelectorAll<HTMLElement>('.step-card, .benefit-card');
    cards.forEach(el => {
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y - r.height / 2) / r.height) * -12;
        const ry = ((x - r.width  / 2) / r.width ) *  12;
        el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.02)`;
        el.style.transition = 'transform 0.05s';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.4s ease';
      });
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────────
  private initScrollReveal(): void {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    this.observers.push(obs);
  }

  // ── Contador de stats ─────────────────────────────────────────
  private initStatsCounter(): void {
    const el = document.querySelector('.hero-stats');
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.ngZone.run(() => {
          this.animateCounter('stat1', 500, 1800);
          this.animateCounter('stat2', 120, 1600);
          this.animateCounter('stat3', 80,  1400);
        });
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    this.observers.push(obs);
  }

  private animateCounter(prop: 'stat1'|'stat2'|'stat3', target: number, duration: number): void {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      (this as any)[prop] = Math.floor(ease * target);
      if (t < 1) requestAnimationFrame(step);
      else (this as any)[prop] = target;
    };
    requestAnimationFrame(step);
  }

  private onScroll(): void {}
  private onResize(): void {}
}
