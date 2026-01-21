// src/app/features/home/home.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroSectionComponent } from './components/hero-section/hero-section.component';

import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AiInspirationComponent } from './components/ai-inspiration/ai-inspiration.component';
import { FeaturedProvidersComponent } from './components/featured-providers/featured-providers.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { FooterComponent } from './components/footer/footer.component';
import { CtaSectionComponent } from './components/cta-section/cta-section.component'; // ← هادي كانت ناقصة

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    HowItWorksComponent,
    CategoriesComponent,
    AiInspirationComponent,
    FeaturedProvidersComponent,
    TestimonialsComponent,
    FooterComponent,
    CtaSectionComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}