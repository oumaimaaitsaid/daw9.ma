import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  template: `
    <section class="hero-full-bleed relative min-h-[90vh] w-full flex items-center overflow-hidden">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover object-right" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgEKZiEl3O1tFErAIJ4uAFu9hHftBVTMllfMYWq_BfIKWKqrjE3uur6MNrACvf66RItUF4rSJL9EaiSk8OqTdz42EiuXw4TwBuCc-3d4CQVeq835_DAmN_6Y4PTnQuLEhPuiOBtZePKPXPM-IIut-w2yWAipQQN9jO6u6wGdtiz3LhkT2o4iRBsQR4ZWvPJFK7lpgUO8WVnmEitw889CVZw_nMIJ2vMs99nNHmWIFhSMBOW9NntOHaxRy8-lrUyTAg_WTktSS-VNs" alt="Mariée" />
      </div>
      <div class="hero-overlay absolute inset-0 z-[1]"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-24 lg:pt-0">
        <div class="max-w-xl reveal">
          <h1 class="text-[52px] sm:text-[64px] lg:text-[72px] font-bold text-white leading-[1.05] tracking-tight">Organisez votre mariage</h1>
          <p class="text-[44px] sm:text-[52px] lg:text-[58px] font-bold text-primary italic leading-[1.1] mt-1 pl-2 font-serif">en toute simplicité</p>
          <p class="text-white text-base sm:text-lg mt-8 leading-relaxed max-w-lg">
            Téléchargez vos photos d'inspiration et notre IA vous proposera les meilleurs prestataires : negafa, traiteur, photographe et bien plus.
          </p>
          <div class="flex flex-wrap items-center gap-4 mt-10">
            <button class="bg-primary inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold text-[15px] hover:bg-primary-hover transition-colors">
              <span class="material-symbols-outlined text-[22px]">photo_camera</span> Ajoutez vos photos
            </button>
            <button class="px-8 py-4 rounded-lg text-white font-semibold text-[15px] border border-white/40 bg-black/30 backdrop-blur-sm hover:bg-black/45 transition-all">
              Découvrir les prestataires
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-overlay {
      background: linear-gradient(to right, rgba(26, 22, 16, 0.9) 0%, rgba(26, 22, 16, 0.5) 50%, transparent 80%);
    }
    .reveal {
      animation: reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HeroSectionComponent { }