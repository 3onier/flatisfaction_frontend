import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http'

import { Observable, ObservableInput, catchError, firstValueFrom, map, retry } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly url = environment.apiUrl + 'auth/';

  constructor(private _httpClient: HttpClient, private _userService: UserService) {}

  public setToken(token: string){
    window.localStorage.setItem("auth-token", token);
  }

  public getToken(): string{
    let token: string = window.localStorage.getItem("auth-token") || "";
    return token;
  }

  public clearToken(): void{
    this.setToken("");
  }

  public async isAuthenticated(): Promise<boolean>{
    let isAuth = false;
    try{
      let user = await firstValueFrom(this._userService.getUser().pipe(retry(3))) as User;
      isAuth = (user.username !== "");
    }catch{
      // do nothing
    }
    return isAuth;
  }

  private _handleError(error: any) :ObservableInput<any>{
    if(error.status == 401){
      throw new WrongCredentialsError()
    }
    throw new Error("We go a problem");
  }

  public login(username: string, password: string): Observable<Object>{
    let credentialString = btoa(username + ":" + password);
    return this._httpClient.post(
      this.url + 'login/', 
      [],
      {
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + credentialString
        })
      }
    ).pipe(
      map(
        (data: any) => {
          this.setToken(data.token);
          return data;
        }
      ),
      catchError(
        error => this._handleError(error)
      )
    );
  }

}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private _authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token = this._authService.getToken();
    // first check if the request doenst already have a authetication header
    if(req.headers.get('Authorization')){
      return next.handle(req);
    }

    // check if there even is a Token
    if(token == ""){
      return next.handle(req)
    }

    // add the token to the module
    const modifiedReq = req.clone({
      setHeaders: {
        'Authorization': "Token " + token
      }
    });
    return next.handle(modifiedReq);
  }
}

export class WrongCredentialsError extends Error{}