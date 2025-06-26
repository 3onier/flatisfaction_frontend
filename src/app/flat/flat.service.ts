import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Flat } from './flat';
import { BehaviorSubject, Observable, ObservableInput, Subject, catchError, map} from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class FlatService {


  public baseUrl = environment.apiUrl + "flats/"
  public urlGetMembersSuffix = "members/";
  public urlGetAdminsSuffix = "admins/";
  public urlLeaveSuffix = "leave/";

  public static flatChangeEvent$ = new EventEmitter<void>;

  constructor(private _httpClient: HttpClient) {
  }

  public getFlatUrl(): string{
    return this.baseUrl + this.getSelectedFlatId().toString() + "/";
  }

  public setSelectedFlatId(id: number){
    window.sessionStorage.setItem("selected_flat", id.toString());
    FlatService.flatChangeEvent$.emit();
  }

  public resetSelectedFlatId(){
    window.sessionStorage.setItem("selected_flat", "");
    FlatService.flatChangeEvent$.emit();
  }

  public getSelectedFlatId(): number{
    let id: any = window.sessionStorage.getItem("selected_flat");
    if(!id){
      throw new NoFlatSelectedError();
    }
    return id as number;
  }

  private _handleError(error: any): ObservableInput<any>{
    if(error.status = 404){
      throw new FlatNotFoundError();
    }else if(error.status == 403){
      throw new NotFlatMemberError();
    }
    throw new Error();
  }

  public getFlats(): Observable<Array<Flat>>{
    return this._httpClient.get(this.baseUrl).pipe(
      map((d) => {return d as Array<Flat>}),
    );
  }

  public getFlat(): Observable<Flat>{
    return this._httpClient.get(this.getFlatUrl()).pipe(
      map( (data) => {return data as Flat} ),
      catchError( (error) => this._handleError(error))
    );
  }

  public createFlat(flat: Flat): Observable<Flat>{
    return this._httpClient.post(this.baseUrl, flat).pipe(
      map( (f) => f as Flat )
    );
  }

  public updateFlat(flat: Flat):Observable<Flat>{
    return this._httpClient.put(this.getFlatUrl(), flat).pipe(
      map( (d) => {
        FlatService.flatChangeEvent$.emit();
        return d as Flat;
      } )
    );
  }

  public getFlatMembers(): Observable<Array<User>>{
    return this._httpClient.get(this.getFlatUrl() + this.urlGetMembersSuffix).pipe(
      map( (data) => {return data as Array<User>} ),
      catchError( (error) => this._handleError(error))
    )
  }

  public removeFlatMember(user_id: number): Observable<any>{
    let url = this.getFlatUrl() + this.urlGetMembersSuffix + user_id.toString();
    return this._httpClient.delete(url).pipe(
      map( () => {FlatService.flatChangeEvent$.emit();})
    );
  }

  public getFlatAdmins(): Observable<Array<User>>{
    return this._httpClient.get(this.getFlatUrl() + this.urlGetAdminsSuffix).pipe(
      map( (data) => {return data as Array<User>} ),
      catchError( (error) => this._handleError(error))
    )
  }

  public makeAdmin(user_id: number): Observable<any>{
    let url: string = this.getFlatUrl() + this.urlGetMembersSuffix + user_id.toString() + "/make_admin";
    return this._httpClient.get(url);
  }

  public revokeAdmin(user_id: number): Observable<any>{
    let url: string = this.getFlatUrl() + this.urlGetAdminsSuffix + user_id.toString();
    return this._httpClient.delete(url);
  }

  public leaveFlat(): Observable<any>{
    return this._httpClient.get(this.getFlatUrl() + this.urlLeaveSuffix).pipe(
      catchError( (e) => this._handleError(e) ),
      map( () => {
        this.resetSelectedFlatId();
      } )
    );
  }

}

export class NoFlatSelectedError extends Error{}
export class FlatNotFoundError extends Error {}
export class NotFlatMemberError extends Error {}