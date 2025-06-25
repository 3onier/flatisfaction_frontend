import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { FlatRoutingModule } from './flat-routing.module'
import { FlatDetailComponent } from './flat-detail/flat-detail.component';
import { FlatSelectionComponent } from './flat-selection/flat-selection.component';
import { FlatCreateComponent } from './flat-create/flat-create.component';
import { InviteModule } from "../invite/invite.module";



@NgModule({
  declarations: [
    FlatDetailComponent,
    FlatCreateComponent,
    FlatSelectionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FlatRoutingModule,
    InviteModule
],
  exports: [
    FlatDetailComponent,
    FlatCreateComponent,
    FlatSelectionComponent
  ]
})
export class FlatModule { }
