import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Nationality } from '../../../shared/services/nationalities.service';

@Component({
  selector: 'app-edit-nationality-modal',
  templateUrl: './edit-nationality-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class EditNationalityModalComponent implements OnInit {
  @Input() nationality!: Nationality;
  
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
    this.populateForm();
  }

  initForm(): void {
    this.nationalityForm = this.fb.group({
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]]
    });
  }

  populateForm(): void {
    if (this.nationality) {
      this.nationalityForm.patchValue({
        nameAr: this.nationality.nameAr,
        nameEn: this.nationality.nameEn
      });
    }
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