import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-inspiration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 lg:py-24 bg-[#f9f8f3]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="rounded-3xl bg-white p-8 lg:p-16 shadow-sm flex flex-col lg:flex-row gap-16 items-center border border-black/5">
          <div class="flex-1">
            <span class="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest">AI Matching</span>
            <h2 class="text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-6 leading-tight">Téléchargez vos photos<br>l'IA s'occupe du reste</h2>
            <p class="text-[#717171] text-lg leading-relaxed mb-8">
              Téléchargez vos photos d'inspiration préférées et notre IA vous proposera les meilleurs prestataires qui correspondent exactement à ce style.
            </p>
            <div class="flex items-center gap-4">
              <div class="flex -space-x-3">
                <div *ngFor="let i of [1,2,3,4]" class="w-10 h-10 rounded-full border-2 border-white bg-accent-soft flex items-center justify-center font-bold text-xs text-primary">U{{i}}</div>
              </div>
              <span class="text-sm font-medium text-[#717171]">Utilisé par 400+ couples ce mois-ci</span>
            </div>
          </div>
          <div class="w-full max-w-md bg-[#fafafa] border-2 border-dashed border-[#e5e5e5] rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-5xl text-primary mb-4 block">cloud_upload</span>
            <p class="font-bold text-[#1a1a1a] mb-1">Quickstart Upload</p>
            <p class="text-[#717171] text-sm mb-6">Envoyez-nous vos photos préférées ici</p>
            <div class="space-y-3">
              <div *ngFor="let item of items" class="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-black/5">
                <div class="w-12 h-12 rounded-lg bg-accent-soft overflow-hidden">
                  <img [src]="item.img" class="w-full h-full object-cover">
                </div>
                <span class="text-sm font-semibold text-[#1a1a1a] flex-1 text-left">{{item.name}}</span>
                <span class="material-symbols-outlined text-primary">check_circle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AiInspirationComponent {
  items = [
    { name: 'Traditional Kaftan Style', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClu0tuS0FYJYccZaCYvfzEo9-cYwY2S8ov37U3u1tT05x_Oy0qW35HfTOJ4tVU3WkI0yVkDZjOarulddZdGpWhQWCsLiRcumR63sdghcm4y8ydQjBbUJNfMyckax9yzvR-R-3WOwSIoG5jO3FHjqZs-X6_lqLjrt01QLBwozyq-3IOsNenEiqS37no8XSPjV8kAwcGrmsS1bCqMNBSUdaWx1UbBB6DGgAeL6Rpy-OgYcvC09XDSta-37kLXmxJ_NAGyuxPvJ7eX0g' },
    { name: 'Modern Floral Setup', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvuWBtQ-udMGHc0D_-epnTpBXee13cDJ1hiQaPITn_B9Bo9J4wBQrD7C2CruZPE4jrp7aH8aLnVtP0oA8YJnpR4dSPY8lfTeFbPbe7_L0daAhkCx-NnKhf_jK8BpheNyf53G8SJOM8hxJglPb31CkGt8LefShY7uG0da8OmNf80e0YTD5Ywc_-y__yxWmdnbTAzzqqGJ1vAmwNEZCEJbaIOzuokazKxnTsvmV9U7fO2xJVWZ2zd7yx7kenTFFm4zNIVewlB_vQMFA' }
  ];
}