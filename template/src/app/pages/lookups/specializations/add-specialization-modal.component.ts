import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { JobTitlesService, JobTitle } from '../../../shared/services/job-titles.service';

@Component({
  selector: 'app-add-specialization-modal',
  templateUrl: './add-specialization-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class AddSpecializationModalComponent implements OnInit {
  specializationForm!: FormGroup;
  jobTitles: JobTitle[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private jobTitlesService: JobTitlesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadJobTitles();
  }

  initForm(): void {
    this.specializationForm = this.fb.group({
      nameAr: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      nameEn: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      jobTitleId: ['', Validators.required]
    });
  }

  loadJobTitles(): void {
    this.jobTitlesService.getAllJobTitles().subscribe({
      next: (response: any) => {
        if (response.succeeded || response.success) {
          this.jobTitles = response.data || response;
        } else {
          console.error('Failed to load job titles:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading job titles:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.specializationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.specializationForm.value;
      console.log('Submitting specialization data:', formData);

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
    Object.keys(this.specializationForm.controls).forEach(key => {
      const control = this.specializationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.specializationForm.get(controlName);
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