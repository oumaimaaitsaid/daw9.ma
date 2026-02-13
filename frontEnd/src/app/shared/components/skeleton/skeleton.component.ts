import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngStyle]="styles" class="skeleton-pulse bg-primary/5 border border-primary/5"></div>
  `,
  styles: [`
    .skeleton-pulse {
      background: linear-gradient(
        90deg,
        rgba(212, 175, 55, 0.05) 25%,
        rgba(212, 175, 55, 0.1) 50%,
        rgba(212, 175, 55, 0.05) 75%
      );
      background-size: 200% 100%;
      animation: pulse 1.5s infinite linear;
    }
    @keyframes pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() borderRadius: string = '8px';
  @Input() circle: boolean = false;

  get styles() {
    return {
      width: this.width,
      height: this.height,
      'border-radius': this.circle ? '50%' : this.borderRadius,
      display: 'inline-block'
    };
  }
}
