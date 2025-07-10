import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

// Mock interface for Specialization - you'll need to create a proper service for this
interface Specialization {
  id: string;
  nameAr: string;
  nameEn: string;
}

@Component({
  selector: 'app-add-sub-specialization-modal',
  templateUrl: './add-sub-specialization-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class AddSubSpecializationModalComponent implements OnInit {
  subSpecializationForm!: FormGroup;
  specializations: Specialization[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSpecializations();
  }

  initForm(): void {
    this.subSpecializationForm = this.fb.group({
      nameAr: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      nameEn: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      specializationId: ['', Validators.required]
    });
  }

  loadSpecializations(): void {
    // Mock data - replace with actual service call
    this.specializations = [
      { id: '550e8400-e29b-41d4-a716-446655440101', nameAr: 'طب عام', nameEn: 'General Medicine' },
      { id: '550e8400-e29b-41d4-a716-446655440102', nameAr: 'جراحة', nameEn: 'Surgery' },
      { id: '550e8400-e29b-41d4-a716-446655440103', nameAr: 'أمراض القلب', nameEn: 'Cardiology' },
      { id: '550e8400-e29b-41d4-a716-446655440104', nameAr: 'طب الأطفال', nameEn: 'Pediatrics' }
    ];
  }

  onSubmit(): void {
    if (this.subSpecializationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.subSpecializationForm.value;
      console.log('Submitting sub specialization data:', formData);

      // Close modal with form data
      this.activeModal.close(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  markFormGroupTouched(): void {
    Object.keys(this.subSpecializationForm.controls).forEach(key => {
      const control = this.subSpecializationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.subSpecializationForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return this.translate.instant(`${controlName} is required`);
      }
      if (control.errors['minlength']) {
        return this.translate.instant(`${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`);
      }
      if (control.errors['maxlength']) {
        return this.translate.instant(`${controlName} must not exceed ${control.errors['maxlength'].requiredLength} characters`);
      }
    }
    return '';
  }
} 