import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../shared/services/countries.service';

@Component({
  selector: 'app-edit-country-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ 'Edit Country' | translate }}</h4>
      <button type="button" class="btn-close" (click)="close()"></button>
    </div>
    
    <div class="modal-body">
      <form [formGroup]="countryForm" (ngSubmit)="save()">
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
            <span *ngIf="countryForm.get('nameAr')?.errors?.['required']">
              {{ 'Name in Arabic is required' | translate }}
            </span>
            <span *ngIf="countryForm.get('nameAr')?.errors?.['minlength']">
              {{ 'Name in Arabic must be at least 2 characters' | translate }}
            </span>
            <span *ngIf="countryForm.get('nameAr')?.errors?.['maxlength']">
              {{ 'Name in Arabic cannot exceed 50 characters' | translate }}
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
            <span *ngIf="countryForm.get('nameEn')?.errors?.['required']">
              {{ 'Name in English is required' | translate }}
            </span>
            <span *ngIf="countryForm.get('nameEn')?.errors?.['minlength']">
              {{ 'Name in English must be at least 2 characters' | translate }}
            </span>
            <span *ngIf="countryForm.get('nameEn')?.errors?.['maxlength']">
              {{ 'Name in English cannot exceed 50 characters' | translate }}
            </span>
          </div>
          <div class="valid-feedback" *ngIf="isFieldValid('nameEn')">
            {{ 'Looks good!' | translate }}
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">{{ 'Code' | translate }} *</label>
          <input 
            type="text" 
            class="form-control" 
            formControlName="code"
            maxlength="3"
            [placeholder]="'Enter country code (e.g., USA, UAE)' | translate"
            [class.is-invalid]="isFieldInvalid('code')"
            [class.is-valid]="isFieldValid('code')"
          >
          <div class="invalid-feedback" *ngIf="isFieldInvalid('code')">
            <span *ngIf="countryForm.get('code')?.errors?.['required']">
              {{ 'Country code is required' | translate }}
            </span>
            <span *ngIf="countryForm.get('code')?.errors?.['minlength']">
              {{ 'Country code must be at least 2 characters' | translate }}
            </span>
            <span *ngIf="countryForm.get('code')?.errors?.['maxlength']">
              {{ 'Country code cannot exceed 3 characters' | translate }}
            </span>
            <span *ngIf="countryForm.get('code')?.errors?.['pattern']">
              {{ 'Country code must contain only letters' | translate }}
            </span>
          </div>
          <div class="valid-feedback" *ngIf="isFieldValid('code')">
            {{ 'Looks good!' | translate }}
          </div>
          <div class="form-text">
            {{ 'Enter a 2-3 letter country code (e.g., USA, UAE, KSA)' | translate }}
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
        [disabled]="countryForm.invalid || saving"
      >
        <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
        {{ saving ? ('Updating...' | translate) : ('Update' | translate) }}
      </button>
    </div>
  `
})
export class EditCountryModalComponent implements OnInit {
  @Input() country: Country = {
    id: '',
    nameAr: '',
    nameEn: '',
    code: ''
  };

  countryForm!: FormGroup;
  saving = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.countryForm = this.fb.group({
      nameAr: [this.country.nameAr, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50)
      ]],
      nameEn: [this.country.nameEn, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50)
      ]],
      code: [this.country.code, [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(3),
        Validators.pattern(/^[A-Za-z]+$/)
      ]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.countryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.countryForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  save(): void {
    if (this.countryForm.valid) {
      this.saving = true;
      
      // Convert code to uppercase
      const formValue = {
        ...this.countryForm.value,
        code: this.countryForm.value.code.toUpperCase()
      };
      
      const updatedCountry = {
        ...this.country,
        ...formValue
      };
      
      this.activeModal.close(updatedCountry);
    } else {
      this.markFormGroupTouched();
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.countryForm.controls).forEach(key => {
      const control = this.countryForm.get(key);
      control?.markAsTouched();
    });
  }
} 