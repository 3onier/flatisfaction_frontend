import { Component, inject, OnInit, signal, computed, ViewChild } from '@angular/core';
import { ChoreAppointments } from '../chore-appointment';
import { ScheduleService } from '../schedule.service';
import { ChoreCalendarAgendaComponent } from '../chore-calendar-agenda/chore-calendar-agenda.component';

@Component({
  selector: 'app-chore-calendar',
  templateUrl: './chore-calendar.component.html',
  styleUrls: ['./chore-calendar.component.scss'],
  standalone: false
})
export class ChoreCalendarComponent  implements OnInit {

  public startDate: Date;
  public endDate: Date;

  private _isLoadingCal = signal(false);
  private _isLoadingGeneration = signal(false);
  private _isLoadingClear = signal(false);
  public isLoading = computed( () => this._isLoadingCal() || this._isLoadingGeneration() || this._isLoadingClear())

  public showHelp = false;

  public choreAppointments: ChoreAppointments = [];

  private _scheduleService: ScheduleService = inject(ScheduleService);

  @ViewChild(ChoreCalendarAgendaComponent) agendaCalendar!: ChoreCalendarAgendaComponent;

  constructor() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.endDate.setUTCDate(this.endDate.getUTCDate() + 100);
  }

  ngOnInit() {
  }

  setAgendaLoading(event: boolean){
    this._isLoadingCal.set(event);
  }

  generateChoreSchedule(){
    this._isLoadingGeneration.set(true);
    this._scheduleService.generateSchedule().subscribe({
      next: (ca) => {
        this.agendaCalendar.loadChoreAppointments();
        this._isLoadingGeneration.set(false);
      }
    })
  }

  clearSchedule(){
    this._isLoadingClear.set(true);
    console.log(this.startDate, this.endDate);
    this._scheduleService.clearScheudle(
      this.startDate,
      this.endDate
    ).subscribe({
      next: () => {
        this.agendaCalendar.loadChoreAppointments();
        this._isLoadingClear.set(false);
      }
    });
  }

  clearAllScheudle(){
    this._isLoadingClear.set(true);
    this._scheduleService.clearScheudle().subscribe({
      next: () => {
        this.agendaCalendar.loadChoreAppointments();
        this._isLoadingClear.set(false);
      }
    });
  }

  changeStartDate(e: any){
    this.startDate = new Date(e.detail.value);
    if(this.startDate > this.endDate){
      this.endDate = this.startDate;
      this.endDate.setDate(this.endDate.getDate() + 1)
    }
  }

  changeEndDate(e: any){
    this.endDate = new Date(e.detail.value);
  }

}
