import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-[#1a1a1a] text-center mb-4">Comment ça marche ?</h2>
        <div class="w-16 h-1 bg-primary mx-auto mb-14"></div>
        <div class="grid md:grid-cols-3 gap-12">
          <div *ngFor="let step of steps" class="text-center group">
            <div class="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span class="material-symbols-outlined text-3xl">{{ step.icon }}</span>
            </div>
            <h3 class="text-lg font-bold text-[#1a1a1a] mb-3">{{ step.title }}</h3>
            <p class="text-[#717171] text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HowItWorksComponent {
  steps = [
    { icon: 'palette', title: 'Choisissez votre style', desc: 'Définissez le style de votre mariage et vos préférences. Notre IA comprendra vos goûts.' },
    { icon: 'share', title: 'Suggestions intelligentes', desc: 'Après avoir analysé vos photos, nous vous proposons les prestataires qui correspondent à vos envies.' },
    { icon: 'event_available', title: 'Planification simplifiée', desc: 'L\'exécution devient facile avec les meilleurs prestataires sélectionnés pour vous.' }
  ];
}