import { Routes } from '@angular/router';

import { DefaultComponent } from './default/default.component';

export const dashboard: Routes = [
    {
        path: 'default',
        component: DefaultComponent,
        data : {
            pageTitle: "Default Dashboard",
            title : "Default",
            breadcrumb: "Default"
        },
    },
];
