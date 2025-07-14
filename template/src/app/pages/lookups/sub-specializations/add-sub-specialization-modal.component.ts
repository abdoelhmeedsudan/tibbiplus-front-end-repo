import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {SpecializationsService} from '../../../shared/services/specializations.service'

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
    private translate: TranslateService,
    private SpecializationsService :SpecializationsService
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
  this.SpecializationsService.getAllSpecializations().subscribe({
    next: (response: any) => {
      if (response.succeeded || response.success) {
        this.specializations = response.data || response;
      } else {
        console.error('Failed to load specializations:', response.message);
      }
    },
    error: (error) => {
      console.error('Error loading specializations:', error);
    }
  });
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