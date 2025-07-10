import { Routes } from '@angular/router';

export const content: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../components/dashboards/dashboard.routes').then(r => r.dashboard),
        data: {
            title: "Dashboard",
            breadcrumb: "Dashboard"
        },
    },
    {
        path: 'widgets',
        loadChildren: () => import('../../components/widgets/widgets.routes').then(r => r.widgets),
        data: {
            title: "Widgets",
            breadcrumb: "Widgets"
        },
    },
    {
        path: 'forms/form-control',
        data: {
            breadcrumb: 'Form Controls'
        },
        loadChildren: () => import('../../components/forms/form-controls/form-controls.routes').then(r => r.formControls),
    },
    {
        path: 'forms/form-widgets',
        data: {
            breadcrumb: 'Form Widgets'
        },
        loadChildren: () => import('../../components/forms/form-widgets/form-widgets.routes').then(r => r.formWidgets),
    },
    {
        path: 'forms/form-layout',
        data: {
            breadcrumb: 'Form Layout'
        },
        loadChildren: () => import('../../components/forms/form-layout/form-layout.routes').then(r => r.formLayout),
    },
    {
        path: 'table/bootstrap-tables',
        data: {
            breadcrumb: 'Bootstrap Tables'
        },
        loadChildren: () => import('../../components/table/bootstrap-tables/bootstrap-table.routes').then(r => r.bootstrapTables),
    },
    {
        path: 'table/data-table',
        loadChildren: () => import('../../components/table/data-table/data-table-routes').then(r => r.dataTable)
    },
    {
        path: 'user',
        loadChildren: () => import('../../components/users/users.routes').then(r => r.users),
        data: {
            title: "User",
            breadcrumb: "User"
        },
    },
    {
        path: 'bookmark',
        loadChildren: () => import('../../components/bookmark/bookmark.routes').then(r => r.bookmark)
    },
    {
        path: 'task',
        loadChildren: () => import('../../components/task/task.routes').then(r => r.task)
    },
    {
        path: 'ui-kits',
        loadChildren: () => import('../../components/ui-kits/ui-kits.routes').then(r => r.uiKits),
        data: {
            title: 'Ui Kits',
            breadcrumb: 'Ui Kits'
        }
    },
    {
        path: 'animation',
        loadChildren: () => import('../../components/animation/animation.routes').then(r => r.animation),
        data: {
            title: 'Animation',
            breadcrumb: 'Animation'
        }
    },
    {
        path: 'icon',
        loadChildren: () => import('../../components/icons/icons.routes').then(r => r.icons),
        data: {
            title: 'Icons',
            breadcrumb: 'Icons'
        }
    },
    {
        path: 'button',
        loadChildren: () => import('../../components/button/button.routes').then(r => r.button)
    },
    {
        path: 'internationalization',
        loadChildren: () => import('../../components/internationalization/internationalization.routes').then(r => r.internationalization),
        data: {
            title: 'Pages',
            breadcrumb: 'Pages'
        }
    },
    {
        path: 'lookups',
        loadChildren: () => import('../../pages/lookups/lookups.routes').then(r => r.lookups),
        data: {
            title: 'البيانات الأساسية',
            breadcrumb: 'البيانات الأساسية'
        }
    }
];
