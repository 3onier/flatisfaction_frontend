import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Chore, Chores } from './chore';
import { catchError, map, Observable, ObservableInput } from 'rxjs';
import { FlatService } from '../flat/flat.service';

@Injectable({
  providedIn: 'root'
})
export class ChoreService {


  public urlSuffix = "chores/";
  public baseUrl = environment.apiUrl + this.urlSuffix;

  private _httpClient: HttpClient = inject(HttpClient);
  private _flatServie: FlatService = inject(FlatService);

  constructor() {}

  public getAllChores(): Observable<Chores>{
    return this._httpClient.get(this.baseUrl).pipe(
      map((c) => c as Chores),
      map(ChoreService.convertChoresDate),
      catchError( (e) => this._handleError(e) )
    )
  }

  public getFlatChores(): Observable<Chores>{
    let url = this._flatServie.getFlatUrl() + this.urlSuffix;
    return this._httpClient.get(url).pipe(
      map((c) => c as Chores),
      map(ChoreService.convertChoresDate),
      catchError( (e) => this._handleError(e) )
    )
  }

  public getChore(id: number): Observable<Chore>{
    return this._httpClient.get(this.baseUrl + id.toString()).pipe(
      map( (c) => c as Chore ),
      map(ChoreService.convertChoreDate)
    );
  }

  private _updateChore(chore: Chore): Observable<Chore>{
    return this._httpClient.put(this.baseUrl + chore.id, chore).pipe(
      map( (c) => c as Chore),
      map(ChoreService.convertChoreDate),
      catchError( (e) => this._handleError(e) )
    );
  }

  private _createChore(chore: Chore): Observable<Chore>{
    let url = this._flatServie.getFlatUrl() + this.urlSuffix;
    chore.flat = this._flatServie.getSelectedFlatId();
    return this._httpClient.post(url, chore).pipe(
      map( (c) => c as Chore),
      map(ChoreService.convertChoreDate),
      catchError( (e) => this._handleError(e) )
    );
  }

  public saveChore(chore: Chore): Observable<Chore>{
    if(chore.id == undefined)
      return this._createChore(chore);
    return this._updateChore(chore);
  }

  public deleteChore(chore: Chore):Observable<any>{
    return this._httpClient.delete(this.baseUrl + chore.id).pipe(
      catchError(this._handleError)
    );
  }

  private _handleError(err: any): ObservableInput<any>{
    if(err.status == 404)
      throw new ChoreNotFoundError();
    if(err.status == 403)
      throw new NoChoreEditingPermissionError();
    throw new Error("Error in the Chore service");
  }
  
  static convertChoreDate(c: Chore): Chore{
      let test_string: string = "";
      if(typeof c.start_date == typeof test_string) {
        let date = c.start_date as unknown as string;
        c.start_date = new Date(date);
      }
      if(typeof c.end_date == typeof test_string) {
        let date = c.end_date as unknown as string;
        c.end_date = new Date(date);
      }
      return c;
    } 

    static convertChoresDate(c: Chores): Chores{
      return c.map(e => ChoreService.convertChoreDate(e));
    } 
  
}

export class ChoreNotFoundError extends Error{}
export class NoChoreEditingPermissionError extends Error{}