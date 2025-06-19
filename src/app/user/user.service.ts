import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { User } from './user';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public readonly urlUser = environment.apiUrl + 'user/';
  public readonly urlUserProfile = environment.apiUrl + 'profile/';
  public readonly urlChangePassword = environment.apiUrl + 'change-password/';

  constructor(private _httpClient:HttpClient) {}

  public getUser(): Observable<User>{
    return this._httpClient.get(this.urlUser).pipe(
      map( (data: any) => {return data as User; } )
    );
  }

  public updateUser(user: User){
    return this._httpClient.put(this.urlUser, user).pipe(
      map( (data: any) => {return data as User; } )
    );
  }

  public getUserProfile(): Observable<UserProfile>{
    return this._httpClient.get(this.urlUserProfile).pipe(
      map( (data: any) => {return data as UserProfile; } )
    );
  }

  public changePassword(old_password: string, new_password: string){
    return this._httpClient.put(this.urlChangePassword, {
      "new_password": new_password,
      "old_password": old_password
    })
  }

}

export class WrongPasswordException extends Error{}