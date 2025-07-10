import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CountriesService, Country } from '../../../shared/services/countries.service';
import { City } from '../../../shared/services/cities.service';

@Component({
  selector: 'app-edit-city-modal',
  templateUrl: './edit-city-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class EditCityModalComponent implements OnInit {
  @Input() city!: City;
  
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
    this.populateForm();
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
          this.countries = response.data || response;
        } else {
          this.errorMessage = response.message || 'Failed to load countries';
        }
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load countries';
      }
    });
  }

  populateForm(): void {
    if (this.city) {
      this.cityForm.patchValue({
        nameAr: this.city.nameAr,
        nameEn: this.city.nameEn,
        countryId: this.city.countryId
      });
    }
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