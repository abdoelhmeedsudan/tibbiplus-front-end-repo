import { Routes } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { CitiesComponent } from './cities/cities.component';
import { JobTitlesComponent } from './job-titles/job-titles.component';
import { NationalitiesComponent } from './nationalities/nationalities.component';
import { SpecializationsComponent } from './specializations/specializations.component';
import { SubSpecializationsComponent } from './sub-specializations/sub-specializations.component';

export const lookups: Routes = [
    {
        path: 'countries',
        component: CountriesComponent,
        data: {
            title: 'الدول',
            breadcrumb: 'الدول'
        }
    },
    {
        path: 'cities',
        component: CitiesComponent,
        data: {
            title: 'المدن',
            breadcrumb: 'المدن'
        }
    },
    {
        path: 'job-titles',
        component: JobTitlesComponent,
        data: {
            title: 'المسميات الوظيفية',
            breadcrumb: 'المسميات الوظيفية'
        }
    },
    {
        path: 'nationalities',
        component: NationalitiesComponent,
        data: {
            title: 'الجنسيات',
            breadcrumb: 'الجنسيات'
        }
    },
    {
        path: 'specializations',
        component: SpecializationsComponent,
        data: {
            title: 'التخصصات',
            breadcrumb: 'التخصصات'
        }
    },
    {
        path: 'sub-specializations',
        component: SubSpecializationsComponent,
        data: {
            title: 'التخصصات الفرعية',
            breadcrumb: 'التخصصات الفرعية'
        }
    }
]; 