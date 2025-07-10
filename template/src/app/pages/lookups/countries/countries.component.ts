import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountriesService, Country, CountriesApiResponse } from '../../../shared/services/countries.service';
import { AddCountryModalComponent } from './add-country-modal.component';
import { EditCountryModalComponent } from './edit-country-modal.component';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule]
})
export class CountriesComponent implements OnInit {
  countries: Country[] = [];
  loading = false;
  deleting = false;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  hasPrevious = false;
  hasNext = false;
  searchForm!: FormGroup;
  errorMessage = '';

  constructor(private translate: TranslateService, private countriesService: CountriesService, private modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadCountries();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  loadCountries(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    
    const params = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: searchTerm
    };

    this.countriesService.getCountries(params).subscribe({
      next: (response: CountriesApiResponse) => {
        if (response.succeeded) {
          this.countries = response.data.items;
          this.currentPage = response.data.currentPage;
          this.totalCount = response.data.totalCount;
          this.hasPrevious = response.data.hasPrevious;
          this.hasNext = response.data.hasNext;
        } else {
          this.errorMessage = response.message || 'Failed to load countries';
        }
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'An error occurred while loading countries';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addNew(): void {
    const modalRef = this.modalService.open(AddCountryModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then((result) => {
      if (result) {
        this.countriesService.createCountry(result).subscribe({
          next: (response) => {
            if (response.succeeded) {
              this.loadCountries();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to create country';
            }
          },
          error: (error) => {
            console.error('Error creating country:', error);
            this.errorMessage = 'An error occurred while creating the country';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  editCountry(country: Country): void {
    const modalRef = this.modalService.open(EditCountryModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Pass the country data to the modal
    modalRef.componentInstance.country = { ...country };

    modalRef.result.then((result) => {
      if (result) {
        this.countriesService.updateCountry(country.id, result).subscribe({
          next: (response) => {
            if (response.succeeded) {
              this.loadCountries();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to update country';
            }
          },
          error: (error) => {
            console.error('Error updating country:', error);
            this.errorMessage = 'An error occurred while updating the country';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  deleteCountry(country: Country): void {
    const confirmMessage = this.translate.instant('Are you sure you want to delete') + 
                          ' "' + country.nameEn + '" (' + country.code + ')?';
    
    if (confirm(confirmMessage)) {
      this.deleting = true;
      this.errorMessage = '';
      
      this.countriesService.deleteCountry(country.id).subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.loadCountries();
            // You could add a success toast here
          } else {
            this.errorMessage = response.message || 'Failed to delete country';
          }
        },
        error: (error) => {
          console.error('Error deleting country:', error);
          this.errorMessage = 'An error occurred while deleting the country';
        },
        complete: () => {
          this.deleting = false;
        }
      });
    }
  }
//ggg
  clearError(): void {
    this.errorMessage = '';
  }
}
