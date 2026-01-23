import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div class="max-w-md w-full relative z-10 reveal">
        <div class="text-center mb-12">
          <h1 class="font-serif text-5xl font-bold text-secondary mb-3">Daw9<span class="text-primary italic">.ma</span></h1>
          <p class="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">L'Excellence pour votre Mariage</p>
        </div>

        <div class="premium-card bg-white rounded-[40px] p-10 shadow-2xl shadow-secondary/5">
          <div class="mb-10">
            <h2 class="font-serif text-2xl font-bold text-secondary">Connexion</h2>
            <p class="text-xs text-text-muted mt-2">Bienvenue dans votre espace conciergerie privée.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-6">
              <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Email</label>
              <input type="email" formControlName="email"
                     [class.border-red-400]="form.get('email')?.invalid && form.get('email')?.touched"
                     class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                     placeholder="votre@email.com">
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">
                  @if (form.get('email')?.errors?.['required']) { Email requis }
                  @else if (form.get('email')?.errors?.['email']) { Format d'email invalide }
                </p>
              }
            </div>

            <div class="mb-8">
              <div class="flex justify-between items-center mb-3">
                <label class="block text-[10px] font-bold text-text-muted uppercase tracking-widest">Mot de passe</label>
                <a href="#" class="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-75">Oublié ?</a>
              </div>
              <input type="password" formControlName="password"
                     [class.border-red-400]="form.get('password')?.invalid && form.get('password')?.touched"
                     class="w-full px-6 py-4 bg-background border border-primary/10 rounded-2xl focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                     placeholder="••••••••">
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <p class="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-2 ml-4">Le mot de passe est requis</p>
              }
            </div>

            @if (error) {
              <div class="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p class="text-red-600 text-[11px] font-medium">{{ error }}</p>
              </div>
            }

            <button type="submit" [disabled]="loading || form.invalid"
                    class="w-full bg-secondary text-white py-5 rounded-2xl font-serif font-bold text-lg hover:bg-primary transition-all duration-500 shadow-xl shadow-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading) {
                <span class="flex items-center justify-center">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Identification...
                </span>
              } @else {
                Accéder à mon espace
              }
            </button>
          </form>

          <div class="mt-10 pt-10 border-t border-primary/5 text-center">
            <p class="text-xs text-text-muted mb-6">Vous n'avez pas encore de compte ?</p>
            <a routerLink="/auth/register"
               class="inline-block text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-primary/30 pb-1 hover:border-primary transition-all">
              Créer mon compte Client
            </a>
          </div>
        </div>
        
        <p class="text-center mt-12 text-[9px] text-text-muted uppercase tracking-[0.3em]">© 2026 Daw9.ma — Service de Conciergerie Royale</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.authService.redirectByRole();
      },
      error: (err) => {
        console.log('[Login] Erreur reçue:', err);
        this.loading = false;
        this.error = err.error?.message || 'Email ou mot de passe incorrect';
        this.cdr.detectChanges();
      }
    });
  }
}
