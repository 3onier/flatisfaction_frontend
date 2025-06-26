import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteRoutingModule } from './invite.routing.module';
import { InviteListComponent } from './invite-list/invite-list.component';
import { IonicModule } from '@ionic/angular';
import { InviteOpenComponent } from './invite-open/invite-open.component';



@NgModule({
  declarations: [
    InviteListComponent,
    InviteOpenComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    InviteRoutingModule
  ],
  exports: [
    InviteListComponent,
    InviteOpenComponent
  ]
})
export class InviteModule { }
