import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from './user/is-authenticated.guard';
import { flatSelectedGuard } from './flat/flat-selected.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'flat',
    loadChildren: () => import('./flat/flat.module').then(m => m.FlatModule),
    canActivate: [isAuthenticatedGuard]
  }, 
  {
    path: 'invite',
    loadChildren: () => import('./invite/invite.module').then(m => m.InviteModule),
    canActivate: [isAuthenticatedGuard]
  },
  {
    path: 'chore',
    loadChildren: () => import('./chore/chore.module').then(m => m.ChoreModule),
    canActivate: [isAuthenticatedGuard, flatSelectedGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
