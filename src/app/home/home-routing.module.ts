import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { flatSelectedGuard } from '../flat/flat-selected.guard';

const routes_homepage: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [flatSelectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes_homepage)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
