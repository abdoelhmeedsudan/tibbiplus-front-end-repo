import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { JobTitlesService, JobTitle } from '../../../shared/services/job-titles.service';

@Component({
  selector: 'app-add-rank-modal',
  templateUrl: './add-rank-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class AddRankModalComponent implements OnInit {
  rankForm!: FormGroup;
  loading = false;
  jobTitles: JobTitle[] = [];
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private jobTitlesService: JobTitlesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadJobTitles();
  }

  initForm(): void {
    this.rankForm = this.fb.group({
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      jobTitleId: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.rankForm.valid) {
      this.activeModal.close(this.rankForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  markFormGroupTouched(): void {
    Object.keys(this.rankForm.controls).forEach(key => {
      const control = this.rankForm.get(key);
      control?.markAsTouched();
    });
  }

  loadJobTitles(): void {
    this.jobTitlesService.getAllJobTitles().subscribe({
      next: (response: any) => {
        if (response.succeeded || response.success) {
          this.jobTitles = response.data || response;
        } else {
          console.error('Failed to load job titles:', response.message);
        }
      },
      error: (error) => {
        console.error('Error loading job titles:', error);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.rankForm.get(controlName);
    if (control?.hasError('required')) {
      return this.translate.instant(`${controlName} is required`);
    }
    return '';
  }
} 