import { Component, OnInit , inject} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, WrongCredentialsError } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
  providers: [AuthService]
})
export class LoginComponent  implements OnInit {

  private authService: AuthService = inject(AuthService)
  private router = inject(Router);

  public username: string = '';
  public password: string = '';

  public isWrongCredentialToastOpen = false;

  constructor() {}

  ngOnInit() {}
  
  public login(){
    this.authService.login(this.username, this.password).subscribe({
      next: (data) => {
        // redirect to homepage
        this.router.navigate(["/"]);
      },
      error: (error) => {
        if(error instanceof WrongCredentialsError){
          this.isWrongCredentialToastOpen = true;
        }
      }
    });
  }

}
