import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { isAuthenticatedGuard } from '../user/is-authenticated.guard';

const routes_user: Routes = [
  {
      path: 'login',
      component: LoginComponent,
      title: 'Login',
    },
    {
      path: 'register',
      component: RegisterComponent,
      title: 'Register'
    },
    {
      path: 'profile',
      component: UserProfileComponent,
      title: 'User profile',
      canActivate: [isAuthenticatedGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes_user)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
