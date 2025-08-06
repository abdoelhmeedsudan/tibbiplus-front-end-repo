import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Rank } from '../../../shared/services/ranks.service';
import { JobTitlesService, JobTitle } from '../../../shared/services/job-titles.service';

@Component({
  selector: 'app-edit-rank-modal',
  templateUrl: './edit-rank-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class EditRankModalComponent implements OnInit {
  @Input() rank!: Rank;
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
      nameAr: [this.rank?.nameAr || '', [Validators.required]],
      nameEn: [this.rank?.nameEn || '', [Validators.required]],
      jobTitleId: [this.rank?.jobTitleId || '', [Validators.required]]
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