import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SigninCallbackComponent } from './auth/signin-callback/signin-callback.component';
import { SignoutCallbackComponent } from './auth/signout-callback/signout-callback.component';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { FullComponent } from './shared/components/layout/full/full.component';
import { AdminGuard } from './shared/guard/admin.guard';
import { content } from './shared/routes/content.routes';
import { full } from './shared/routes/full.routes';
import { TestApiComponent } from './pages/test-api/test-api.component';

export const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent,
    },
    {
        path: 'signin-callback',
        component: SigninCallbackComponent,
    },
    {
        path: 'signout-callback',
        component: SignoutCallbackComponent,
    },
    {
        path: 'test-api',
        component: TestApiComponent,
        canActivate: [AdminGuard],
    },
    {
        path: '',
        component: ContentComponent,
        canActivate: [AdminGuard],
        children: content,
    },
    {
        path: 'full',
        component: FullComponent,
        canActivate: [AdminGuard],
        children: full
    },
    {
        path : '**',
        redirectTo : '/dashboard/default',
    }
];
