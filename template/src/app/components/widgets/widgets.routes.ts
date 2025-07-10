import { Routes } from "@angular/router";

import { GeneralComponent } from "./general/general.component";

export const widgets: Routes = [
    {
        path: 'general',
        component: GeneralComponent,
        data : {
            pageTitle: "General Widgets",
            title : "General",
            breadcrumb: "General"
        },
    }
]
