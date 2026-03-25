import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo-container" [style.--size]="size + 'px'" [class.dark]="variant === 'dark'">
      <div class="emblem-wrapper">
         <span class="d-bg italic">D</span>
         <span class="brand-name">Daw9</span>
         
         <div class="orbit"></div>
         <div class="orbit-reverse"></div>
      </div>
      
      @if (showTagline) {
        <div class="tagline-wrapper">
           <span class="tagline">Daw9ak howa kolchi</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      --gold: #D4AF37;
      --secondary: #1A1A1A;
      --text-color: #1A1A1A;
      --bg-d: rgba(26, 26, 26, 0.15);
    }

    .logo-container.dark {
      --text-color: #FFFFFF;
      --bg-d: rgba(255, 255, 255, 0.1);
    }

    .emblem-wrapper {
      position: relative;
      width: var(--size);
      height: var(--size);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .d-bg {
      position: absolute;
      font-family: 'Playfair Display', serif;
      font-size: calc(var(--size) * 1);
      font-weight: 700;
      color: var(--bg-d);
      user-select: none;
      z-index: 0;
      transform: translateY(-5%);
    }

    .brand-name {
      position: relative;
      font-family: 'Playfair Display', serif;
      font-size: calc(var(--size) * 0.4);
      font-weight: 800;
      color: var(--text-color);
      letter-spacing: -0.02em;
      z-index: 10;
    }

    .orbit {
      position: absolute;
      inset: 0;
      border: 0.5px solid var(--gold);
      border-radius: 50%;
      opacity: 0.3;
      animation: orbit 10s infinite linear;
    }

    .orbit-reverse {
      position: absolute;
      inset: -10%;
      border: 0.2px solid var(--gold);
      border-radius: 50%;
      opacity: 0.15;
      animation: orbit-rev 15s infinite linear;
    }

    .tagline-wrapper {
      margin-top: calc(var(--size) * 0.15);
      overflow: hidden;
    }

    .tagline {
      font-family: 'Playfair Display', serif;
      font-size: calc(var(--size) * 0.12);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.4em;
      color: var(--gold);
      white-space: nowrap;
    }

    @keyframes orbit {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes orbit-rev {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
  `]
})
export class LogoComponent {
  @Input() size: number = 80;
  @Input() variant: 'light' | 'dark' = 'light';
  @Input() showTagline: boolean = true;
}
