import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-primary overflow-hidden relative">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <h2 class="text-3xl font-bold text-white text-center mb-16">Chi 7aja f-l-khiyal</h2>
        <div class="grid md:grid-cols-2 gap-10">
          <div *ngFor="let t of testimonials" class="bg-white/10 backdrop-blur-md p-8 lg:p-12 rounded-3xl border border-white/20">
            <span class="text-white/30 text-7xl font-serif absolute -top-4 left-6">“</span>
            <p class="text-white text-xl leading-relaxed italic mb-8 relative z-10 font-serif">{{t.quote}}</p>
            <div class="flex items-center gap-4">
              <img [src]="t.avatar" class="w-14 h-14 rounded-full border-2 border-white">
              <div>
                <h4 class="text-white font-bold">{{t.name}}</h4>
                <p class="text-white/60 text-sm uppercase tracking-widest">{{t.role}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class TestimonialsComponent {
  testimonials = [
    { name: 'Sara & Ahmed', role: 'Couples', quote: 'Daw9.ma 3tana l-3ers li konna n7lamu bih. Kol 7aja mchawra w m9adda.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKU79EXodtFlbuDcwbV5XP3ne_SnVkr-bw_keOQqGYjOKax41VRQteUYgB_mdlwI6Zca8YMm48UtuKWU1ueamxe5s_tzAtayjbc3pcba5ca6eyZPKb5muo8RncO5HUAvtyNEqwk4ALhHsqEpEnEpw4kmmjXgqMbNAN2VzD-FcZxp8cP9NxnguqY0BcbH_JE1UcEoU_i_zH7RqX-eh_dIIyFl8cxVtA7vQswCCX5BQgAJu5U4oIEGf25K3wGz6j8jxchfESxVPae9s' },
    { name: 'Mouna & Anas', role: 'Couples', quote: 'L-AI matching kan howa l-mofaji2a krt lina l-weqt bzaf.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMkMq7MEIW8WPh6Jc7KIyaPziH7rDjDdcQWG-4TCif1OPwnPIOl4Zrdv1IUyiA9FtsNaXiM9z77Rnc7p7yhMC_AsaD7WY8niNnZSJHAbhFlHCbNCzBsxo1Om3piJLMhDTeCZxpPaO_0-mTnkYRCgvjCiJdFPlJYNIu6c9eBsqr2li5fYr1T01Wh5YJjCKTrG9Bfk_dfJFdW8XSGi7pjba_d6yee6UYv2Vs-ULRoAgIKuYetILXvYM5Kd5f-niHYUbsM4eueqKG920' }
  ];
}