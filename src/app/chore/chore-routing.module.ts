import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoreDetailComponent } from './chore-detail/chore-detail.component';
import { ChoreListComponent } from './chore-list/chore-list.component';
import { ChoreCalendarComponent } from './chore-calendar/chore-calendar.component';

const routes_user: Routes = [
    {
      path: 'detail',
      component: ChoreDetailComponent,
      title: 'View and Edit chore',
    },
    {
      path: 'detail/:id',
      component: ChoreDetailComponent,
      title: 'Edt Chore'
    },
    {
      path: 'list',
      component: ChoreListComponent,
      title: 'Our Chores'
    },
    {
      path: 'calendar',
      component: ChoreCalendarComponent,
      title: 'Chore Calendar'
    }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes_user)],
  exports: [RouterModule]
})
export class ChoreRoutingModule {}
