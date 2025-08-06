import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MedicalCouncilService, MedicalCouncil, MedicalCouncilsApiResponse } from '../../../shared/services/medical-council.service';
import { AddMedicalCouncilModalComponent } from './add-medical-council-modal.component';
import { EditMedicalCouncilModalComponent } from './edit-medical-council-modal.component';

@Component({
  selector: 'app-medical-council',
  templateUrl: './medical-council.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule]
})
export class MedicalCouncilComponent implements OnInit {
  medicalCouncils: MedicalCouncil[] = [];
  loading = false;
  deleting = false;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  hasPrevious = false;
  hasNext = false;
  searchForm!: FormGroup;
  errorMessage = '';

  constructor(private translate: TranslateService, private medicalCouncilService: MedicalCouncilService, private modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadMedicalCouncils();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  loadMedicalCouncils(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    
    const params = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: searchTerm
    };

    this.medicalCouncilService.getMedicalCouncils(params).subscribe({
      next: (response: MedicalCouncilsApiResponse) => {
        if (response.succeeded) {
          this.medicalCouncils = response.data.items;
          this.currentPage = response.data.currentPage;
          this.totalCount = response.data.totalCount;
          this.hasPrevious = response.data.hasPrevious;
          this.hasNext = response.data.hasNext;
        } else {
          this.errorMessage = response.message || 'Failed to load medical councils';
        }
      },
      error: (error) => {
        console.error('Error loading medical councils:', error);
        this.errorMessage = 'An error occurred while loading medical councils';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addNew(): void {
    const modalRef = this.modalService.open(AddMedicalCouncilModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then((result) => {
      if (result) {
        this.medicalCouncilService.createMedicalCouncil(result).subscribe({
          next: (response) => {
            if (response.succeeded) {
              this.loadMedicalCouncils();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to create medical council';
            }
          },
          error: (error) => {
            console.error('Error creating medical council:', error);
            this.errorMessage = 'An error occurred while creating the medical council';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  editMedicalCouncil(medicalCouncil: MedicalCouncil): void {
    const modalRef = this.modalService.open(EditMedicalCouncilModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Pass the medical council data to the modal
    modalRef.componentInstance.medicalCouncil = { ...medicalCouncil };

    modalRef.result.then((result) => {
      if (result) {
        this.medicalCouncilService.updateMedicalCouncil(medicalCouncil.id, result).subscribe({
          next: (response) => {
            if (response.succeeded) {
              this.loadMedicalCouncils();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to update medical council';
            }
          },
          error: (error) => {
            console.error('Error updating medical council:', error);
            this.errorMessage = 'An error occurred while updating the medical council';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  deleteMedicalCouncil(medicalCouncil: MedicalCouncil): void {
    const confirmMessage = this.translate.instant('Are you sure you want to delete') + 
                          ' "' + medicalCouncil.nameEn + '" (' + medicalCouncil.nameAr + ')?';
    
    if (confirm(confirmMessage)) {
      this.deleting = true;
      this.errorMessage = '';
      
      this.medicalCouncilService.deleteMedicalCouncil(medicalCouncil.id).subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.loadMedicalCouncils();
            // You could add a success toast here
          } else {
            this.errorMessage = response.message || 'Failed to delete medical council';
          }
        },
        error: (error) => {
          console.error('Error deleting medical council:', error);
          this.errorMessage = 'An error occurred while deleting the medical council';
        },
        complete: () => {
          this.deleting = false;
        }
      });
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }
} 