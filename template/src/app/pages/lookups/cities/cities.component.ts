import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitiesService, City } from '../../../shared/services/cities.service';
import { CountriesService, Country } from '../../../shared/services/countries.service';
import { AddCityModalComponent } from './add-city-modal.component';
import { EditCityModalComponent } from './edit-city-modal.component';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule]
})
export class CitiesComponent implements OnInit {
  cities: City[] = [];
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

  constructor(
    private translate: TranslateService, 
    private citiesService: CitiesService, 
    private countriesService: CountriesService,
    private modalService: NgbModal, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadCountries();
    this.loadCities();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      countryId: ['']
    });
  }

  loadCountries(): void {
    console.log("start get List Of Countries");
    this.countriesService.getAllCountries().subscribe({
      next: (response) => {
        this.countries = response.data;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  loadCities(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    const countryId = this.searchForm.get('countryId')?.value || '';
    
    const params = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: searchTerm,
      CountryId: countryId
    };

    this.citiesService.getCities(params).subscribe({
      next: (response: any) => {
      
        // Handle different response formats
        if (response.succeeded) {
          const data = response.data || response;
          if (data.items) {
            // Paginated response
            this.cities = data.items;
            this.currentPage = data.currentPage || 1;
            this.totalCount = data.totalCount || 0;
            this.hasPrevious = data.hasPrevious || false;
            this.hasNext = data.hasNext || false;
          } else if (Array.isArray(data)) {
            // Array response
            this.cities = data;
            this.currentPage = 1;
            this.totalCount = data.length;
            this.hasPrevious = false;
            this.hasNext = false;
          } else {
            this.cities = [];
            this.errorMessage = 'Invalid response format';
          }
          console.log('Cities loaded:', this.cities);
        } else {
          this.errorMessage = response.message || 'Failed to load cities';
        }
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.errorMessage = 'An error occurred while loading cities';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addNew(): void {
    const modalRef = this.modalService.open(AddCityModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then((result) => {
      if (result) {
        this.citiesService.createCity(result).subscribe({
          next: (response: any) => {
            if (response.succeeded) {
              this.loadCities();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to create city';
            }
          },
          error: (error) => {
            console.error('Error creating city:', error);
            this.errorMessage = 'An error occurred while creating the city';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  editCity(city: City): void {
    const modalRef = this.modalService.open(EditCityModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Pass the city data to the modal
    modalRef.componentInstance.city = { ...city };

    modalRef.result.then((result) => {
      if (result) {
        this.citiesService.updateCity(city.id, result).subscribe({
          next: (response: any) => {
            if (response.succeeded) {
              this.loadCities();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to update city';
            }
          },
          error: (error) => {
            console.error('Error updating city:', error);
            this.errorMessage = 'An error occurred while updating the city';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  deleteCity(city: City): void {
    const confirmMessage = this.translate.instant('Are you sure you want to delete') + 
                          ' "' + city.nameEn + '"?';
    
    if (confirm(confirmMessage)) {
      this.deleting = true;
      this.errorMessage = '';
      
      this.citiesService.deleteCity(city.id).subscribe({
        next: (response: any) => {
          if (response.succeeded) {
            this.loadCities();
            // You could add a success toast here
          } else {
            this.errorMessage = response.message || 'Failed to delete city';
          }
        },
        error: (error) => {
          console.error('Error deleting city:', error);
          this.errorMessage = 'An error occurred while deleting the city';
        },
        complete: () => {
          this.deleting = false;
        }
      });
    }
  }

  getCountryName(city: City): string {
    if (city.countryNameEn) {
      return city.countryNameEn;
    }
    const country = this.countries.find(c => c.id === city.countryId);
    return country ? country.nameEn : 'Unknown';
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCities();
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
