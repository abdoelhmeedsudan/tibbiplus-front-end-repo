import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SubSpecialization } from '../../../shared/services/sub-specializations.service';

// Mock interface for Specialization - you'll need to create a proper service for this
interface Specialization {
  id: string;
  nameAr: string;
  nameEn: string;
}

@Component({
  selector: 'app-edit-sub-specialization-modal',
  templateUrl: './edit-sub-specialization-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class EditSubSpecializationModalComponent implements OnInit {
  @Input() subSpecialization!: SubSpecialization;
  
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
    this.populateForm();
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
      { id: '1', nameAr: 'طب عام', nameEn: 'General Medicine' },
      { id: '2', nameAr: 'جراحة', nameEn: 'Surgery' },
      { id: '3', nameAr: 'أمراض القلب', nameEn: 'Cardiology' },
      { id: '4', nameAr: 'طب الأطفال', nameEn: 'Pediatrics' }
    ];
  }

  populateForm(): void {
    if (this.subSpecialization) {
      this.subSpecializationForm.patchValue({
        nameAr: this.subSpecialization.nameAr,
        nameEn: this.subSpecialization.nameEn,
        specializationId: this.subSpecialization.specializationId
      });
    }
  }

  onSubmit(): void {
    if (this.subSpecializationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.subSpecializationForm.value;
      console.log('Updating sub specialization data:', formData);

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