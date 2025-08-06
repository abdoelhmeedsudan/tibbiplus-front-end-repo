import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { JobTitle } from '../../../shared/services/job-titles.service';

@Component({
  selector: 'app-edit-job-title-modal',
  templateUrl: './edit-job-title-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class EditJobTitleModalComponent implements OnInit {
  @Input() jobTitle!: JobTitle;
  jobTitleForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.jobTitleForm = this.fb.group({
      nameAr: [this.jobTitle?.nameAr || '', [Validators.required]],
      nameEn: [this.jobTitle?.nameEn || '', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.jobTitleForm.valid) {
      this.activeModal.close(this.jobTitleForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  markFormGroupTouched(): void {
    Object.keys(this.jobTitleForm.controls).forEach(key => {
      const control = this.jobTitleForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.jobTitleForm.get(controlName);
    if (control?.hasError('required')) {
      return this.translate.instant(`${controlName} is required`);
    }
    return '';
  }
} 