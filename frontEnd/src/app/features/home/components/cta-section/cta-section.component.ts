import { Component } from '@angular/core';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  template: `
    <section class="py-16 lg:py-24 bg-[#f5f5f5]">
      <div class="max-w-3xl mx-auto text-center px-6">
        <h2 class="text-2xl lg:text-4xl font-bold text-[#1a1a1a]">Commencez à planifier votre mariage</h2>
        <p class="text-[#717171] text-sm mt-4">Join 10.000+ couples planning their dream wedding with AI.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button class="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
            Zid t-tzaawj gratuitement
          </button>
          <button class="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg font-semibold text-sm hover:bg-primary/5 transition-colors">
            Oplate 3li l providers
          </button>
        </div>
      </div>
    </section>
  `
})
export class CtaSectionComponent { }