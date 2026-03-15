import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-providers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-bold text-[#1a1a1a]">Prostataires l-U daro buz</h2>
            <p class="text-[#717171] mt-2 italic font-serif">Top feedback of the month</p>
          </div>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div *ngFor="let p of providers" class="group rounded-2xl overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-500 bg-white">
            <div class="relative h-64 overflow-hidden">
              <img [src]="p.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">{{p.price}}</div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-xl text-[#1a1a1a]">{{p.name}}</h3>
                <div class="flex items-center text-primary"><span class="text-sm font-bold ml-1">{{p.rating}} ★</span></div>
              </div>
              <p class="text-[#717171] text-sm mb-6 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">location_on</span> {{p.location}}
              </p>
              <button class="w-full bg-[#1a1a1a] text-white py-3.5 rounded-xl font-bold hover:bg-primary transition-colors">Check details</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class FeaturedProvidersComponent {
  providers = [
    { name: 'Nouara Dar El Mkhazen', location: 'Casablanca', rating: 4.9, price: '10 000 Dhs', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjylmbTP6PZLfGf5t3aeNJYdpQZqFAlCHKO6tXA770HIPU4OBYONEKrlw4Iq4A7pFjPkjxclk3Qe_vAf6tHFe_xwktSG4ROK-EbiV-nNmV0My1LYnETR9DNdz54uZt2qEzXHdR0dp4ryU4RfTiUYJNfK2vWTvPpUpP8q4srA9Wv7Svj5wWlyB3xx458faNKPvvqzq1pc1aEqMJeLAbqO9V7_gZedllcjIWAnidaweTFtr2B5vw9Eg1MHSuLM-OTPY3fZrbjQrVopk' },
    { name: 'Traiteur Marrakesh', location: 'Marrakech', rating: 4.8, price: '15 000 Dhs', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_pumrEDnTWSU2lbIhDPI268cAUWGRIRJeipwlLzyn0Z2IOejae8pwolXuv_gp65up7Lb4bMHAz9JQcNOgi-3RRWL_Lbyt40Q3xRs7ktDcjAFoJffI4Wj6LkC1HniVXS4a7KKL9tyGpdEnjI7qUeZgeWXONEKDh2Cf6oHi2QIZ8qPUPtXG5e-raSv-ME0m0-BEA-npn53hxWK6GzapwIits72ebxTjZJodzbRYXwi0H5dpYY35C1ioFBDbO-C6dQg-ubHsTtDyiZc' },
    { name: 'Studio Amara', location: 'Tanger', rating: 5.0, price: '8 000 Dhs', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgx5NyQu5dlZIY_WyjWRDDvlaONQnb-XsFz9V0j1hWpHnA3M1sFWbbX9A-jN0JAQry3PUyksw3MQdS5L2gWnkk6q27Yi3FJ0LmuLnuEc2azQm6I1_d0OkGvoAUuRe8A4ey1Kw4vJtby_jRK9GBc52ovzrVxz-d4ZD3euYsYYmELr9E9QAOj5xKvB1qoqkkIbOVSz_ZGQKJK7hE2knXJXky3lF7nzCyo542_o2n_O3e5fnf9H82VuFkl5QcqSwlQetic2mWbXJP1-w' }
  ];
}