import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlatService } from '../flat/flat.service';
import { ChoreAppointment, ChoreAppointments } from './chore-appointment';

import { catchError, map, Observable, ObservableInput } from 'rxjs';
import { User } from '../user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public baseUrl = environment.apiUrl;
  public urlSuffix = "schedule/";
  public urlEditSuffix = this.urlSuffix + 'edit/';

  private _httpClient: HttpClient = inject(HttpClient);
  private _flatService: FlatService = inject(FlatService);

  constructor() { }

  public getFlatSchedule(from: Date|null = null, to: Date|null = null, user: User|number|null = null): Observable<ChoreAppointments>{
    let params = new HttpParams();
    if(from)
      params = params.set('from', from.toISOString().split("T")[0])
    if(to)
      params = params.set('to', to.toISOString().split("T")[0])
    if(user){
      if(user instanceof User){
        params = params.set('user', user.id as number);
      }
      if(typeof user == "number"){
        params = params.set('user', user as number);
      }
    }

    let url = this._flatService.getFlatUrl() + this.urlSuffix;
    return this._httpClient.get(url, {params: params}).pipe(
      map( (c) => c as ChoreAppointments ),
      map(ScheduleService.convertChoreAppointmentsDate)
    );
  }

  static convertChoreAppointmentDate(ca: ChoreAppointment): ChoreAppointment{
    let test_string: string = "";
    if(typeof ca.date == typeof test_string) {
      let date = ca.date as unknown as string;
      ca.date = new Date(date);
    }
    return ca;
  }

  static convertChoreAppointmentsDate(arr: ChoreAppointments): Array<ChoreAppointment>{
    return arr.map(ScheduleService.convertChoreAppointmentDate)
  }

  public clearScheudle(from: Date|null = null, to: Date|null = null): Observable<any>{
    let params = new HttpParams();
    if(from)
      params = params.set('from', from.toISOString().split("T")[0])
    if(to)
      params = params.set('to', to.toISOString().split("T")[0])

    return this._httpClient.delete(
      this._flatService.getFlatUrl() + this.urlEditSuffix,
      {
        params: params
      }
    );
  }

  public generateSchedule(from: Date|null = null, to: Date|null = null): Observable<ChoreAppointments>{
    let params = new HttpParams();
    if(from)
      params = params.set('from', from.toISOString().split("T")[0])
    if(to)
      params = params.set('to', to.toISOString().split("T")[0])
    return this._httpClient.post(
      this._flatService.getFlatUrl() + this.urlEditSuffix,
      {}
    ).pipe(
      map(
        (ca) => ca as ChoreAppointments
      )
    )
  }

  public updateChoreAppointment(ca: ChoreAppointment): Observable<ChoreAppointment>{
    return this._httpClient.put(this.baseUrl + this.urlSuffix + ca.id?.toString(), ca).pipe(
      map( (r) => r as ChoreAppointment ),
      map(ScheduleService.convertChoreAppointmentDate),
      catchError( (e) => {
        if(e.status == 403){
          throw new CannotEditChoreAppointment();
        } else if (e.status == 409){
          throw new ChoreAppointmentConflicException();
        }
        throw new CannotEditChoreAppointment();
      })
    )
  }

  public deleteChoreAppointment(ca: ChoreAppointment){
    return this._httpClient.delete( this.baseUrl + this.urlSuffix + ca.id?.toString())
  }

}

export class CannotEditChoreAppointment extends Error{
  override message: string = "Cannot edit the Chore Appointment";
}
export class ChoreAppointmentConflicException extends Error{
  override message: string = "The Chore is conflicting with another appointment. Please mark them in the order the ought to be done";
}
