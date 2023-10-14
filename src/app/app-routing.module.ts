import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {authGuard} from "./_helpers/auth.guard";
import {AccessDeniedComponent} from "./errors/access-denied/access-denied.component";
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
  {
    path: '',
    redirectTo:'/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent ,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN','ROLE_USER']}
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: {roles: ['ROLE_ADMIN']}
  },
  {
    path: 'forbidden',
    component: AccessDeniedComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
