import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-t border-black/5 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          <div class="col-span-2 lg:col-span-1">
            <span class="text-xl font-bold text-primary">Daw9.ma</span>
            <p class="text-[#717171] text-sm mt-4 leading-relaxed">
              Organisez votre mariage en toute simplicité. Téléchargez vos photos, notre IA vous propose les meilleurs prestataires.
            </p>
          </div>

          <div>
            <h4 class="font-bold text-[#1a1a1a] text-sm mb-4 uppercase tracking-wider">Platform</h4>
            <ul class="space-y-3 text-[#717171] text-sm">
              <li><a href="#" class="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-[#1a1a1a] text-sm mb-4 uppercase tracking-wider">Resources</h4>
            <ul class="space-y-3 text-[#717171] text-sm">
              <li><a href="#" class="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-[#1a1a1a] text-sm mb-4 uppercase tracking-wider">Social</h4>
            <div class="flex gap-3">
              <a *ngFor="let social of socials" href="#" 
                 class="w-10 h-10 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#717171] hover:text-primary hover:border-primary transition-all">
                <span class="material-symbols-outlined text-lg">{{ social.icon }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-[#717171] text-sm">© 2026 Daw9.ma. All rights reserved.</p>
          <div class="flex gap-6 items-center">
            <span class="text-[#717171] text-sm cursor-pointer hover:text-primary">English (US)</span>
            <span class="text-[#717171] text-sm cursor-pointer hover:text-primary">MAD (Dhs)</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  socials = [
    { name: 'Instagram', icon: 'photo_camera' },
    { name: 'Facebook', icon: 'facebook' },
    { name: 'YouTube', icon: 'play_circle' }
  ];
}