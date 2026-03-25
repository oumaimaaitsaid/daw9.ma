import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center py-24 px-4 relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div class="max-w-2xl w-full relative z-10 reveal">
        <!-- Brand Header -->
        <div class="text-center mb-12">
          <h1 class="font-serif text-5xl font-bold text-secondary mb-3">Daw9<span class="text-primary italic">.ma</span></h1>
          <p class="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Service de Conciergerie Royal</p>
        </div>

        <!-- Registration Card -->
        <div class="premium-card bg-white rounded-[40px] p-12 shadow-2xl shadow-secondary/5">
          <div class="mb-12">
            <h2 class="font-serif text-2xl font-bold text-secondary uppercase tracking-tight">Rejoignez l'Excellence</h2>
            <p class="text-xs text-text-muted mt-2">Créez votre profil pour accéder à notre catalogue exclusif de prestataires.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-2 gap-8">
              <!-- Nom -->
              <div class="mb-6">
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Nom</label>
                <input type="text" formControlName="nom"
                       [class.border-red-400]="form.get('nom')?.invalid && form.get('nom')?.touched"
                       class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none">
                @if (form.get('nom')?.invalid && form.get('nom')?.touched) {
                  <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">Nom requis (min. 2 car.)</p>
                }
              </div>

              <!-- Prénom -->
              <div class="mb-6">
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Prénom</label>
                <input type="text" formControlName="prenom"
                       [class.border-red-400]="form.get('prenom')?.invalid && form.get('prenom')?.touched"
                       class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none">
                @if (form.get('prenom')?.invalid && form.get('prenom')?.touched) {
                  <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">Prénom requis</p>
                }
              </div>
            </div>

            <!-- Email -->
            <div class="mb-6">
              <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Email Professionnel</label>
              <input type="email" formControlName="email"
                     [class.border-red-400]="form.get('email')?.invalid && form.get('email')?.touched"
                     class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                     placeholder="votre@email.com">
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">Email invalide</p>
              }
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Mot de passe de protection</label>
              <input type="password" formControlName="password"
                     [class.border-red-400]="form.get('password')?.invalid && form.get('password')?.touched"
                     class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                     placeholder="••••••••">
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">Min. 6 caractères requis</p>
              }
            </div>

            <div class="grid grid-cols-2 gap-8 mb-6">
              <!-- Phone -->
              <div>
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Téléphone</label>
                <input type="tel" formControlName="phone"
                       [class.border-red-400]="form.get('phone')?.invalid && form.get('phone')?.touched"
                       class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                       placeholder="06 00 00 00 00">
                @if (form.get('phone')?.invalid && form.get('phone')?.touched) {
                  <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">Format: 06/07/05XXXXXXXX</p>
                }
              </div>

              <!-- Ville -->
              <div>
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Ville de célébration</label>
                <select formControlName="ville"
                        [class.border-red-400]="form.get('ville')?.invalid && form.get('ville')?.touched"
                        class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none cursor-pointer">
                  <option value="">Sélectionner</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Fès">Fès</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Meknès">Meknès</option>
                </select>
                @if (form.get('ville')?.invalid && form.get('ville')?.touched) {
                  <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">Ville requise</p>
                }
              </div>
            </div>
            <!-- Error Message -->
            @if (error) {
              <div class="mb-10 p-5 bg-red-50 border border-red-100 rounded-2xl">
                <p class="text-red-700 text-xs font-medium">{{ error }}</p>
              </div>
            }

            <!-- Submit -->
            <button type="submit" [disabled]="loading || form.invalid"
                    class="w-full bg-secondary text-white py-5 rounded-2xl font-serif font-bold text-lg hover:bg-primary transition-all duration-500 shadow-xl shadow-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading) {
                <span class="flex items-center justify-center">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Création de votre espace...
                </span>
              } @else {
                Créer mon compte Client
              }
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-12 pt-10 border-t border-primary/5 text-center">
            <p class="text-xs text-text-muted mb-6">Vous avez déjà un compte ?</p>
            <a routerLink="/auth/login"
               class="inline-block text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-primary/30 pb-1 hover:border-primary transition-all">
              Se connecter à mon espace
            </a>
          </div>
        </div>

        <p class="text-center mt-12 text-[9px] text-text-muted uppercase tracking-[0.3em]">© 2026 Daw9.ma — L'Art de l'Événementiel Marocain</p>
      </div>
    </div>
  `
})
export class RegisterClientComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required, Validators.pattern(/^(06|07|05)[0-9]{8}$/)]],
    ville: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.registerClient(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/client/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
} 
