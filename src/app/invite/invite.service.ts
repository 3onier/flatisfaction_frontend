import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlatService } from '../flat/flat.service';
import { Observable, catchError, map } from 'rxjs';
import { Invite } from './invite';
import { environment } from 'src/environments/environment';
import { Flat } from '../flat/flat';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  public urlInviteSuffix: string = "invites/";
  public urlInvite: string = environment.apiUrl + "invite/";
  public urlOpenSuffix: string = "open";

  private _flatService: FlatService = inject(FlatService);

  constructor(private _httpClient: HttpClient) { }

  public getUrl(){
    return this._flatService.getFlatUrl() + this.urlInviteSuffix;
  }

  public getInvites(): Observable<Array<Invite>>{
    return this._httpClient.get(this.getUrl()).pipe(
      map( (d) => d as Array<Invite> )
    );
  }

  public getInvite(code: string): Observable<Invite>{
    return this._httpClient.get(this.urlInvite + code + "/").pipe(
      map( (i) => i as Invite ),
      catchError((err) => {
        if(err.status == 404){
          throw new InviteNotFoundErr();
        }
        if(err.status == 410){
          throw new InviteExpiredErr();
        }
        if(err.status == 403){
          throw new MemberOfFlatAlreadyErr();
        }
        throw Error();
      })
    );
  }

  public deleteInvite(code: string): Observable<any>{
    return this._httpClient.delete(this.getUrl() + code);
  }

  public createInvite(invite: Invite): Observable<Invite>{
    return this._httpClient.post(this.getUrl(), invite).pipe(
      map( (d) => d as Invite )
    );
  }

  public openInvite(code: string): Observable<Flat>{
    return this._httpClient.get(this.urlInvite + code + "/" + this.urlOpenSuffix).pipe(
      map( (d) => d as Flat )
    );
  }

}

export class InviteNotFoundErr extends Error{}
export class InviteExpiredErr extends Error{}
export class MemberOfFlatAlreadyErr extends Error{}
