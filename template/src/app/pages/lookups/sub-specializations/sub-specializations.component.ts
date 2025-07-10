import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSpecializationsService, SubSpecialization, SubSpecializationsApiResponse } from '../../../shared/services/sub-specializations.service';
import { AddSubSpecializationModalComponent } from './add-sub-specialization-modal.component';
import { EditSubSpecializationModalComponent } from './edit-sub-specialization-modal.component';

@Component({
  selector: 'app-sub-specializations',
  templateUrl: './sub-specializations.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, AddSubSpecializationModalComponent, EditSubSpecializationModalComponent]
})
export class SubSpecializationsComponent implements OnInit {
  subSpecializations: SubSpecialization[] = [];
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
    private subSpecializationsService: SubSpecializationsService, 
    private modalService: NgbModal, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadSubSpecializations();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  loadSubSpecializations(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    
    const params = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: searchTerm
    };

    console.log('Loading sub specializations with params:', params);

    this.subSpecializationsService.getSubSpecializations(params).subscribe({
      next: (response: any) => {
        console.log('Sub Specializations API response:', response);
        
        // Handle different response formats
        if (response.succeeded || response.success) {
          const data = response.data || response;
          if (data.items) {
            // Paginated response
            this.subSpecializations = data.items;
            this.currentPage = data.currentPage || 1;
            this.totalCount = data.totalCount || 0;
            this.hasPrevious = data.hasPrevious || false;
            this.hasNext = data.hasNext || false;
          } else if (Array.isArray(data)) {
            // Array response
            this.subSpecializations = data;
            this.currentPage = 1;
            this.totalCount = data.length;
            this.hasPrevious = false;
            this.hasNext = false;
          } else {
            this.subSpecializations = [];
            this.errorMessage = 'Invalid response format';
          }
          console.log('Sub Specializations loaded:', this.subSpecializations);
        } else {
          this.errorMessage = response.message || 'Failed to load sub specializations';
        }
      },
      error: (error) => {
        console.error('Error loading sub specializations:', error);
        this.errorMessage = 'An error occurred while loading sub specializations';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addNew(): void {
    const modalRef = this.modalService.open(AddSubSpecializationModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then((result) => {
      if (result) {
        this.subSpecializationsService.createSubSpecialization(result).subscribe({
          next: (response: any) => {
            if (response.success || response.succeeded) {
              this.loadSubSpecializations();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to create sub specialization';
            }
          },
          error: (error) => {
            console.error('Error creating sub specialization:', error);
            this.errorMessage = 'An error occurred while creating the sub specialization';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  editSubSpecialization(subSpecialization: SubSpecialization): void {
    const modalRef = this.modalService.open(EditSubSpecializationModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Pass the sub specialization data to the modal
    modalRef.componentInstance.subSpecialization = { ...subSpecialization };

    modalRef.result.then((result) => {
      if (result) {
        this.subSpecializationsService.updateSubSpecialization(subSpecialization.id, result).subscribe({
          next: (response: any) => {
            if (response.success || response.succeeded) {
              this.loadSubSpecializations();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to update sub specialization';
            }
          },
          error: (error) => {
            console.error('Error updating sub specialization:', error);
            this.errorMessage = 'An error occurred while updating the sub specialization';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  deleteSubSpecialization(subSpecialization: SubSpecialization): void {
    const confirmMessage = this.translate.instant('Are you sure you want to delete') + 
                          ' "' + subSpecialization.nameEn + '"?';
    
    if (confirm(confirmMessage)) {
      this.deleting = true;
      this.errorMessage = '';
      
      this.subSpecializationsService.deleteSubSpecialization(subSpecialization.id).subscribe({
        next: (response: any) => {
          if (response.success || response.succeeded) {
            this.loadSubSpecializations();
            // You could add a success toast here
          } else {
            this.errorMessage = response.message || 'Failed to delete sub specialization';
          }
        },
        error: (error) => {
          console.error('Error deleting sub specialization:', error);
          this.errorMessage = 'An error occurred while deleting the sub specialization';
        },
        complete: () => {
          this.deleting = false;
        }
      });
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadSubSpecializations();
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
