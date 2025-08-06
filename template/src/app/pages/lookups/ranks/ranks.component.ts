import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RanksService, Rank, RanksApiResponse } from '../../../shared/services/ranks.service';
import { AddRankModalComponent } from './add-rank-modal.component';
import { EditRankModalComponent } from './edit-rank-modal.component';

@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule]
})
export class RanksComponent implements OnInit {
  ranks: Rank[] = [];
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
    private ranksService: RanksService, 
    private modalService: NgbModal, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.loadRanks();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  loadRanks(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    
    const params = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: searchTerm
    };

    this.ranksService.getRanks(params).subscribe({
      next: (response: any) => {
        console.log('Ranks API response:', response);
        
        // Handle different response formats
        if (response.succeeded) {
          const data = response.data || response;
          if (data.items) {
            // Paginated response
            this.ranks = data.items;
            this.currentPage = data.currentPage || 1;
            this.totalCount = data.totalCount || 0;
            this.hasPrevious = data.hasPrevious || false;
            this.hasNext = data.hasNext || false;
          } else if (Array.isArray(data)) {
            // Array response
            this.ranks = data;
            this.currentPage = 1;
            this.totalCount = data.length;
            this.hasPrevious = false;
            this.hasNext = false;
          } else {
            this.ranks = [];
            this.errorMessage = 'Invalid response format';
          }
          console.log('Ranks loaded:', this.ranks);
        } else {
          this.errorMessage = response.message || 'Failed to load ranks';
        }
      },
      error: (error) => {
        console.error('Error loading ranks:', error);
        this.errorMessage = 'An error occurred while loading ranks';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addNew(): void {
    const modalRef = this.modalService.open(AddRankModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then((result) => {
      if (result) {
        this.ranksService.createRank(result).subscribe({
          next: (response: any) => {
            if ( response.succeeded) {
              this.loadRanks();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to create rank';
            }
          },
          error: (error) => {
            console.error('Error creating rank:', error);
            this.errorMessage = 'An error occurred while creating the rank';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  editRank(rank: Rank): void {
    const modalRef = this.modalService.open(EditRankModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    // Pass the rank data to the modal
    modalRef.componentInstance.rank = { ...rank };

    modalRef.result.then((result) => {
      if (result) {
        this.ranksService.updateRank(rank.id, result).subscribe({
          next: (response: any) => {
            if (response.succeeded) {
              this.loadRanks();
              // You could add a success toast here
            } else {
              this.errorMessage = response.message || 'Failed to update rank';
            }
          },
          error: (error) => {
            console.error('Error updating rank:', error);
            this.errorMessage = 'An error occurred while updating the rank';
          }
        });
      }
    }, () => {
      // Modal dismissed
    });
  }

  deleteRank(rank: Rank): void {
    const confirmMessage = this.translate.instant('Are you sure you want to delete') + 
                          ' "' + rank.nameEn + '"?';
    
    if (confirm(confirmMessage)) {
      this.deleting = true;
      this.errorMessage = '';
      
      this.ranksService.deleteRank(rank.id).subscribe({
        next: (response: any) => {
          if (response.succeeded) {
            this.loadRanks();
            // You could add a success toast here
          } else {
            this.errorMessage = response.message || 'Failed to delete rank';
          }
        },
        error: (error) => {
          console.error('Error deleting rank:', error);
          this.errorMessage = 'An error occurred while deleting the rank';
        },
        complete: () => {
          this.deleting = false;
        }
      });
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadRanks();
  }

  clearError(): void {
    this.errorMessage = '';
  }
} 