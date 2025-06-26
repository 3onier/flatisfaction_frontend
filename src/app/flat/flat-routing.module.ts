import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlatDetailComponent } from './flat-detail/flat-detail.component';
import { FlatCreateComponent } from './flat-create/flat-create.component';

import { flatSelectedGuard } from './flat-selected.guard';

const routes_flat: Routes = [
    {
      path: 'detail',
      component: FlatDetailComponent,
      canActivate: [flatSelectedGuard]
    },
    {
      path: 'create',
      component: FlatCreateComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes_flat)],
  exports: [RouterModule]
})
export class FlatRoutingModule {}
