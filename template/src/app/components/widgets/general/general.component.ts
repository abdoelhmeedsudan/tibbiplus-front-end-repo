import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DetailsComponent } from '../../dashboards/default/widgets/details/details.component';
import { SessionByDeviceComponent } from './widgets/session-by-device/session-by-device.component';
import { LastMonthDetailsComponent } from "./widgets/last-month-details/last-month-details.component";
import { TotalUsersComponent } from "./widgets/total-users/total-users.component";
import { PageViewsComponent } from "./widgets/page-views/page-views.component";
import { AllVisitsComponent } from "./widgets/all-visits/all-visits.component";
import { details } from '../../../shared/data/dashboard/default';
import { lastMonthDetails } from '../../../shared/data/widgets/general';

@Component({
  selector: 'app-general',
  imports: [CommonModule, 
            DetailsComponent, SessionByDeviceComponent, 
            LastMonthDetailsComponent, TotalUsersComponent, PageViewsComponent, 
            AllVisitsComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})

export class GeneralComponent {

  public details = details;
  public lastMonthDetails = lastMonthDetails;

}
