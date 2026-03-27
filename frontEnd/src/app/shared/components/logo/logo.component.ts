import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo-container" [style.--size]="size + 'px'" [class.dark]="variant === 'dark'">
      <span class="brand-text">Daw9<span class="dot">.</span>ma</span>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      --gold: #D4AF37;
      --text-color: #1A1A1A;
      font-family: 'Playfair Display', serif;
    }

    .logo-container.dark {
      --text-color: #FFFFFF;
    }

    .brand-text {
      font-size: calc(var(--size) * 0.45);
      font-weight: 800;
      color: var(--text-color);
      letter-spacing: -0.01em;
      white-space: nowrap;
      user-select: none;
      transition: all 0.3s ease;
    }

    .dot {
      color: var(--gold);
    }

    .brand-text:hover {
      letter-spacing: 0.05em;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .brand-text { font-size: calc(var(--size) * 0.35); }
    }
  `]
})
export class LogoComponent {
  @Input() size: number = 80;
  @Input() variant: 'light' | 'dark' = 'light';
  @Input() showTagline: boolean = false;
}
