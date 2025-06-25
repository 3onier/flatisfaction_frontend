import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InviteOpenComponent } from './invite-open/invite-open.component';

const routes_invites: Routes = [
  {
    path: 'open/:invite_code',
    component: InviteOpenComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes_invites)],
  exports: [RouterModule]
})
export class InviteRoutingModule {}
