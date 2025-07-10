import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-nationality-modal',
  templateUrl: './add-nationality-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class AddNationalityModalComponent implements OnInit {
  nationalityForm!: FormGroup;
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
    this.nationalityForm = this.fb.group({
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.nationalityForm.valid) {
      this.activeModal.close(this.nationalityForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  markFormGroupTouched(): void {
    Object.keys(this.nationalityForm.controls).forEach(key => {
      const control = this.nationalityForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.nationalityForm.get(controlName);
    if (control?.hasError('required')) {
      return this.translate.instant(`${controlName} is required`);
    }
    return '';
  }
} 