import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CountriesService, Country } from '../../../shared/services/countries.service';

@Component({
  selector: 'app-add-city-modal',
  templateUrl: './add-city-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class AddCityModalComponent implements OnInit {
  cityForm!: FormGroup;
  countries: Country[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCountries();
  }

  initForm(): void {
    this.cityForm = this.fb.group({
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      countryId: ['', [Validators.required]]
    });
  }

  loadCountries(): void {
    this.countriesService.getAllCountries().subscribe({
      next: (response: any) => {
        if (response.succeeded) {
          console.log(response.data )
          this.countries = response.data || response;
          console.log("countries loaded:", this.countries);
        } else {
          this.errorMessage = response.message || 'Failed to load countries';
        }
      },
      error: (error) => {
       
        this.errorMessage = 'Failed to load countries';
      }
    });
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      this.activeModal.close(this.cityForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  markFormGroupTouched(): void {
    Object.keys(this.cityForm.controls).forEach(key => {
      const control = this.cityForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.cityForm.get(controlName);
    if (control?.hasError('required')) {
      return this.translate.instant(`${controlName} is required`);
    }
    return '';
  }
} 