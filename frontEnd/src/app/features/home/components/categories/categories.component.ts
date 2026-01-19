import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 lg:py-24 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex flex-col sm:flex-row justify-between items-end mb-8">
          <div>
            <h2 class="text-2xl lg:text-3xl font-bold text-[#1a1a1a]">Explorez par catégorie</h2>
            <p class="text-[#717171] text-sm mt-1">Découvrez chaque catégorie selon votre style</p>
          </div>
          <a href="#" class="text-primary font-semibold text-sm hover:underline">Show all</a>
        </div>
        
        <div class="relative" (mouseenter)="pause()" (mouseleave)="play()">
          <div #carouselTrack class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4" (scroll)="onScroll()">
            <div *ngFor="let cat of displayItems" class="flex-shrink-0 w-[240px] snap-center">
              <div class="relative h-[320px] rounded-2xl overflow-hidden group">
                <img [src]="cat.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-5 w-full">
                  <div class="h-1 w-8 bg-primary mb-3"></div>
                  <span class="text-white font-bold text-lg">{{ cat.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`]
})
export class CategoriesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carouselTrack') track?: ElementRef<HTMLDivElement>;

  categories = [
    { name: 'Negafa', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbzu0taXUYzLbiy7w6dRJkJm_0N8247ugv3zdsKFFSfxpcszhkeRlDSZLj9BTO-o3NymtfwDoJjwWpzZM8bjiQG0wYaM_bLUxpfklPpEI0wAdO60FhLUArUsYPWwawRmQR_NJ_5AsRzTdnCS2QC51M8Nyh8D4DVhDmwXs4pAJbVKxO7HkEVP-5rdADe_ufWSHFc4N9ZAEEFRg63fdNqpJ6TYpzwM4jSbX-b7m0B-bKXNcLTvt3xUxSIQMUUTJDEpNZ8nieyewYzCo' },
    { name: 'Traiteur', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvuWBtQ-udMGHc0D_-epnTpBXee13cDJ1hiQaPITn_B9Bo9J4wBQrD7C2CruZPE4jrp7aH8aLnVtP0oA8YJnpR4dSPY8lfTeFbPbe7_L0daAhkCx-NnKhf_jK8BpheNyf53G8SJOM8hxJglPb31CkGt8LefShY7uG0da8OmNf80e0YTD5Ywc_-y__yxWmdnbTAzzqqGJ1vAmwNEZCEJbaIOzuokazKxnTsvmV9U7fO2xJVWZ2zd7yx7kenTFFm4zNIVewlB_vQMFA' },
    { name: 'Photographe', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1KcCBLTHp0YtzHQ8bDR4pF4fGFND04VU9_AXdBla4A7Tn8RaM8j8ziewhksChxsRmpp7127-YdVYiWWOjB_e4Oz0oC8K-AyJxVdqzZscod1jPUD3pXyw1vcndg6QVoKwVSEBGL_GSCY66q2wsCaOVjphW9YbAueaQDf_f2DqJpa-aWCsxFIDluAFqqzN9MgG-EzXsLCiup5oV2p4-PPdq_cbSUwesCMhHx2d5Pb5zRjTuW5o487lueEB-59T4okuyD8c4EuFn6Nc' },
    { name: 'DJ & Orchestre', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgx5NyQu5dlZIY_WyjWRDDvlaONQnb-XsFz9V0j1hWpHnA3M1sFWbbX9A-jN0JAQry3PUyksw3MQdS5L2gWnkk6q27Yi3FJ0LmuLnuEc2azQm6I1_d0OkGvoAUuRe8A4ey1Kw4vJtby_jRK9GBc52ovzrVxz-d4ZD3euYsYYmELr9E9QAOj5xKvB1qoqkkIbOVSz_ZGQKJK7hE2knXJXky3lF7nzCyo542_o2n_O3e5fnf9H82VuFkl5QcqSwlQetic2mWbXJP1-w' }
  ];
  displayItems = [...this.categories, ...this.categories, ...this.categories];
  private timer: any;

  ngAfterViewInit() { this.play(); }
  ngOnDestroy() { this.pause(); }

  play() { this.timer = setInterval(() => this.next(), 3000); }
  pause() { clearInterval(this.timer); }

  next() {
    if (this.track) {
      const el = this.track.nativeElement;
      el.scrollLeft += 264;
      if (el.scrollLeft >= (el.scrollWidth / 1.5)) el.scrollLeft = 0;
    }
  }
  onScroll() { }
}