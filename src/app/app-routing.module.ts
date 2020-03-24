import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { IsOwnerGuard } from './auth/guards/is-owner.guard';
import { AuthFingerprintGuard } from './auth/guards/auth-fingerprint.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectAuthorizedToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/main/main.module').then(m => m.MainPageModule),
        canActivate: [AuthFingerprintGuard]
    },
    {
        path: 'help',
        loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule),
    },
    {
        path: 'list/add',
        loadChildren: () => import('./home/add-list/add-list.module').then(m => m.AddlistPageModule),
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'list/:id',
        loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksPageModule),
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'login',
        loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectAuthorizedToHome }
    },
    {
        path: 'profil',
        loadChildren: () => import('./auth/profil/profil.module').then(m => m.ProfilPageModule),
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'register',
        loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
    },
    {
        path: 'list/:id/share',
        loadChildren: () => import('./home/list-sharing/list-sharing.module').then(m => m.ListSharingPageModule),
        canLoad: [IsOwnerGuard],
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'reset-password',
        loadChildren: () => import('./auth/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
    },
    {
        path: 'list/:id/edit',
        loadChildren: () => import('./home/edit-list/edit-list.module').then(m => m.EditListPageModule),
        canLoad: [IsOwnerGuard],
        canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
    }


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
