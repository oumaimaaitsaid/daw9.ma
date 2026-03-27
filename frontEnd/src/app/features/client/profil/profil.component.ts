import { Component, inject, OnInit, ChangeDetectorRef, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfilService } from '../../../core/services/profil.service';
import { Client, ClientProfileUpdate } from '../../../core/models/client.model';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-client-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent],
  templateUrl: './profil.component.html',
  styles: [`
    :host { display: block; }

    .shadow-premium {
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.03);
    }

    .shadow-luxury {
      box-shadow: 0 40px 100px -20px rgba(26, 26, 26, 0.1), 0 0 40px rgba(212, 175, 55, 0.03);
    }

    .reveal {
      animation: reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }

    .reveal-up {
      animation: revealUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }

    @keyframes reveal {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes revealUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    input:focus {
      outline: none;
      box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.05);
    }
  `]
})
export class ClientProfilComponent implements OnInit {
  private profilService = inject(ProfilService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  client = signal<Client | null>(null);
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  successMessage = signal<string>('');

  private fb = inject(FormBuilder);
  
  profileForm: FormGroup = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^(06|07|05)[0-9]{8}$/)]],
    ville: ['', Validators.required],
    budget: [0, [Validators.min(1000)]],
    dateMarriage: ['', [Validators.required, this.futureDateValidator]]
  });

  futureDateValidator(control: any) {
    if (!control.value) return null;
    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today ? { pastDate: true } : null;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.profilService.getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.client.set(data);
          this.profileForm.patchValue({
            phone: data.phone || '',
            ville: data.ville || '',
            budget: data.budget || 0,
            dateMarriage: data.dateMarriage || ''
          });
          this.loading.set(false);
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading.set(false);
          this.cdr.detectChanges();
        }
      });
  }

  save() {
    if (!this.client() || this.profileForm.invalid) {
       this.profileForm.markAllAsTouched();
       return;
    }

    this.saving.set(true);
    this.profilService.updateProfile(this.profileForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.client.set(data);
          this.saving.set(false);
          this.successMessage.set('Mis à jour avec succès');
          this.cdr.detectChanges();

          setTimeout(() => {
            this.successMessage.set('');
            this.cdr.detectChanges();
          }, 3000);
        },
        error: () => {
          this.saving.set(false);
          this.cdr.detectChanges();
        }
      });
  }
}
