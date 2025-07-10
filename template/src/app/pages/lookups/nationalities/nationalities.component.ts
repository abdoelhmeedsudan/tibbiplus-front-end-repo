import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NationalitiesService, Nationality, NationalitiesApiResponse } from '../../../shared/services/nationalities.service';
import { AddNationalityModalComponent } from './add-nationality-modal.component';
import { EditNationalityModalComponent } from './edit-nationality-modal.component';

@Component({
  selector: 'app-nationalities',
  templateUrl: './nationalities.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule]
})
export class NationalitiesComponent implements OnInit {
  nationalities: Nationality[] = [];
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
    private nationalitiesService: NationalitiesService, 
    private modalService: NgbModal, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadNationalities();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  loadNationalities(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    
    const params = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: searchTerm
    };

    this.nationalitiesService.getNationalities(params).subscribe({
      next: (response: any) => {
        console.log('Nationalities API response:', response);
        
        // Handle different response formats
        if (response.succeeded) {
          const data = response.data || response;
          if (data.items) {
            // Paginated response
            this.nationalities = data.items;
            this.currentPage = data.currentPage || 1;
            this.totalCount = data.totalCount || 0;
            this.hasPrevious = data.hasPrevious || false;
            this.hasNext = data.hasNext || false;
          } else if (Array.isArray(data)) {
            // Array response
            this.nationalities = data;
            this.currentPage = 1;
            this.totalCount = data.length;
            this.hasPrevious = false;
            this.hasNext = false;
          } else {
            this.nationalities = [];
            this.errorMessage = 'Invalid response format';
          }
          console.log('Nationalities loaded:', this.nationalities);
        } else {
          this.errorMessage = response.message || 'Failed to load nationalities';
        }
      },
      error: (error) => {
        console.error('Error loading nationalities:', error);
        this.errorMessage = 'An error occurred while loading nationalities';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addNew(): void {
    const modalRef = this.modalService.open(AddNationalityModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then((result) => {
      if (result) {
        this.nationalitiesService.createNationality(result).subscribe({
          next: (response: any) => {
            if ( response.succeeded) {
              this.loadNationalities();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to create nationality';
            }
          },
          error: (error) => {
            console.error('Error creating nationality:', error);
            this.errorMessage = 'An error occurred while creating the nationality';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  editNationality(nationality: Nationality): void {
    const modalRef = this.modalService.open(EditNationalityModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Pass the nationality data to the modal
    modalRef.componentInstance.nationality = { ...nationality };

    modalRef.result.then((result) => {
      if (result) {
        this.nationalitiesService.updateNationality(nationality.id, result).subscribe({
          next: (response: any) => {
            if (response.succeeded) {
              this.loadNationalities();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to update nationality';
            }
          },
          error: (error) => {
            console.error('Error updating nationality:', error);
            this.errorMessage = 'An error occurred while updating the nationality';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  deleteNationality(nationality: Nationality): void {
    const confirmMessage = this.translate.instant('Are you sure you want to delete') + 
                          ' "' + nationality.nameEn + '"?';
    
    if (confirm(confirmMessage)) {
      this.deleting = true;
      this.errorMessage = '';
      
      this.nationalitiesService.deleteNationality(nationality.id).subscribe({
        next: (response: any) => {
          if (response.succeeded) {
            this.loadNationalities();
            // You could add a success toast here
          } else {
            this.errorMessage = response.message || 'Failed to delete nationality';
          }
        },
        error: (error) => {
          console.error('Error deleting nationality:', error);
          this.errorMessage = 'An error occurred while deleting the nationality';
        },
        complete: () => {
          this.deleting = false;
        }
      });
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadNationalities();
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
