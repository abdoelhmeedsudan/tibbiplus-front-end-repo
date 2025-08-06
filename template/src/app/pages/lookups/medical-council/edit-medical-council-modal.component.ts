import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MedicalCouncil } from '../../../shared/services/medical-council.service';

@Component({
  selector: 'app-edit-medical-council-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ 'Edit Medical Council' | translate }}</h4>
      <button type="button" class="btn-close" (click)="close()"></button>
    </div>
    
    <div class="modal-body">
      <form [formGroup]="medicalCouncilForm" (ngSubmit)="save()">
        <div class="mb-3">
          <label class="form-label">{{ 'Name in Arabic' | translate }} *</label>
          <input 
            type="text" 
            class="form-control" 
            formControlName="nameAr"
            [placeholder]="'Enter Arabic name' | translate"
            [class.is-invalid]="isFieldInvalid('nameAr')"
            [class.is-valid]="isFieldValid('nameAr')"
          >
          <div class="invalid-feedback" *ngIf="isFieldInvalid('nameAr')">
            <span *ngIf="medicalCouncilForm.get('nameAr')?.errors?.['required']">
              {{ 'Name in Arabic is required' | translate }}
            </span>
            <span *ngIf="medicalCouncilForm.get('nameAr')?.errors?.['minlength']">
              {{ 'Name in Arabic must be at least 2 characters' | translate }}
            </span>
            <span *ngIf="medicalCouncilForm.get('nameAr')?.errors?.['maxlength']">
              {{ 'Name in Arabic cannot exceed 100 characters' | translate }}
            </span>
          </div>
          <div class="valid-feedback" *ngIf="isFieldValid('nameAr')">
            {{ 'Looks good!' | translate }}
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">{{ 'Name in English' | translate }} *</label>
          <input 
            type="text" 
            class="form-control" 
            formControlName="nameEn"
            [placeholder]="'Enter English name' | translate"
            [class.is-invalid]="isFieldInvalid('nameEn')"
            [class.is-valid]="isFieldValid('nameEn')"
          >
          <div class="invalid-feedback" *ngIf="isFieldInvalid('nameEn')">
            <span *ngIf="medicalCouncilForm.get('nameEn')?.errors?.['required']">
              {{ 'Name in English is required' | translate }}
            </span>
            <span *ngIf="medicalCouncilForm.get('nameEn')?.errors?.['minlength']">
              {{ 'Name in English must be at least 2 characters' | translate }}
            </span>
            <span *ngIf="medicalCouncilForm.get('nameEn')?.errors?.['maxlength']">
              {{ 'Name in English cannot exceed 100 characters' | translate }}
            </span>
          </div>
          <div class="valid-feedback" *ngIf="isFieldValid('nameEn')">
            {{ 'Looks good!' | translate }}
          </div>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="close()">
        {{ 'Cancel' | translate }}
      </button>
      <button 
        type="button" 
        class="btn btn-primary" 
        (click)="save()"
        [disabled]="medicalCouncilForm.invalid || saving"
      >
        <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
        {{ saving ? ('Updating...' | translate) : ('Update' | translate) }}
      </button>
    </div>
  `
})
export class EditMedicalCouncilModalComponent implements OnInit {
  @Input() medicalCouncil: MedicalCouncil = {
    id: '',
    nameAr: '',
    nameEn: ''
  };

  medicalCouncilForm!: FormGroup;
  saving = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.medicalCouncilForm = this.fb.group({
      nameAr: [this.medicalCouncil.nameAr, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]],
      nameEn: [this.medicalCouncil.nameEn, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.medicalCouncilForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.medicalCouncilForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  save(): void {
    if (this.medicalCouncilForm.valid) {
      this.saving = true;
      
      const updatedMedicalCouncil = {
        ...this.medicalCouncil,
        ...this.medicalCouncilForm.value
      };
      
      this.activeModal.close(updatedMedicalCouncil);
    } else {
      this.markFormGroupTouched();
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.medicalCouncilForm.controls).forEach(key => {
      const control = this.medicalCouncilForm.get(key);
      control?.markAsTouched();
    });
  }
} 