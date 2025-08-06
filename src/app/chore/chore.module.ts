import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChoreRoutingModule } from './chore-routing.module';
import { ChoreDetailComponent } from './chore-detail/chore-detail.component';
import { FormsModule } from '@angular/forms';
import { ChoreListComponent } from './chore-list/chore-list.component';
import { ChoreCalendarComponent } from './chore-calendar/chore-calendar.component';
import { ChoreCalendarAgendaComponent } from "./chore-calendar-agenda/chore-calendar-agenda.component";
import { DateHumanReadable } from "../common/datetime";



@NgModule({
  declarations: [
    ChoreDetailComponent,
    ChoreListComponent,
    ChoreCalendarComponent,
    ChoreCalendarAgendaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ChoreRoutingModule,
    DateHumanReadable
],
  exports: [
    ChoreDetailComponent,
    ChoreListComponent,
    ChoreCalendarComponent,
    ChoreCalendarAgendaComponent
  ]
})
export class ChoreModule { }
