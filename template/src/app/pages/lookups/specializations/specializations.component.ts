import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpecializationsService, Specialization, SpecializationsApiResponse } from '../../../shared/services/specializations.service';
import { AddSpecializationModalComponent } from './add-specialization-modal.component';
import { EditSpecializationModalComponent } from './edit-specialization-modal.component';

@Component({
  selector: 'app-specializations',
  templateUrl: './specializations.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule]
})
export class SpecializationsComponent implements OnInit {
  specializations: Specialization[] = [];
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
    private specializationsService: SpecializationsService, 
    private modalService: NgbModal, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadSpecializations();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  loadSpecializations(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    
    const params = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: searchTerm
    };

    console.log('Loading specializations with params:', params);

    this.specializationsService.getSpecializations(params).subscribe({
      next: (response: any) => {
        console.log('Specializations API response:', response);
        
        // Handle different response formats
        if (response.succeeded || response.success) {
          const data = response.data || response;
          if (data.items) {
            // Paginated response
            this.specializations = data.items;
            this.currentPage = data.currentPage || 1;
            this.totalCount = data.totalCount || 0;
            this.hasPrevious = data.hasPrevious || false;
            this.hasNext = data.hasNext || false;
          } else if (Array.isArray(data)) {
            // Array response
            this.specializations = data;
            this.currentPage = 1;
            this.totalCount = data.length;
            this.hasPrevious = false;
            this.hasNext = false;
          } else {
            this.specializations = [];
            this.errorMessage = 'Invalid response format';
          }
          console.log('Specializations loaded:', this.specializations);
        } else {
          this.errorMessage = response.message || 'Failed to load specializations';
        }
      },
      error: (error) => {
        console.error('Error loading specializations:', error);
        this.errorMessage = 'An error occurred while loading specializations';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addNew(): void {
    const modalRef = this.modalService.open(AddSpecializationModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then((result) => {
      if (result) {
        this.specializationsService.createSpecialization(result).subscribe({
          next: (response: any) => {
            if (response.success || response.succeeded) {
              this.loadSpecializations();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to create specialization';
            }
          },
          error: (error) => {
            console.error('Error creating specialization:', error);
            this.errorMessage = 'An error occurred while creating the specialization';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  editSpecialization(specialization: Specialization): void {
    const modalRef = this.modalService.open(EditSpecializationModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Pass the specialization data to the modal
    modalRef.componentInstance.specialization = { ...specialization };

    modalRef.result.then((result) => {
      if (result) {
        this.specializationsService.updateSpecialization(specialization.id, result).subscribe({
          next: (response: any) => {
            if (response.success || response.succeeded) {
              this.loadSpecializations();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to update specialization';
            }
          },
          error: (error) => {
            console.error('Error updating specialization:', error);
            this.errorMessage = 'An error occurred while updating the specialization';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  deleteSpecialization(specialization: Specialization): void {
    const confirmMessage = this.translate.instant('Are you sure you want to delete') + 
                          ' "' + specialization.nameEn + '"?';
    
    if (confirm(confirmMessage)) {
      this.deleting = true;
      this.errorMessage = '';
      
      this.specializationsService.deleteSpecialization(specialization.id).subscribe({
        next: (response: any) => {
          if (response.success || response.succeeded) {
            this.loadSpecializations();
            // You could add a success toast here
          } else {
            this.errorMessage = response.message || 'Failed to delete specialization';
          }
        },
        error: (error) => {
          console.error('Error deleting specialization:', error);
          this.errorMessage = 'An error occurred while deleting the specialization';
        },
        complete: () => {
          this.deleting = false;
        }
      });
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadSpecializations();
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
