import { Component, OnInit, inject } from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service'
import { UserProfile } from '../user-profile';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: false,
  providers: [UserService]
})
export class UserProfileComponent  implements OnInit {

  public user: User = new User();
  public userProfile: UserProfile = new UserProfile();

  private _userService = inject(UserService);
  private _authService = inject(AuthService)

  public showChangeSucessToast: boolean = false;
  public showPasswordsAreNotSameToast: boolean = false;
  public showPasswordCannotBeEmptyToast: boolean = false;
  public showWrongCredentialToastOpen: boolean = false;

  public oldPassword: string = '';
  public newPassword: string = '';
  public newPasswordConfirm: string = '';

  constructor() {
    this._userService.getUser().subscribe(
      {
        next: (data) => {
          this.user = data
        }
      }
    )

    this._userService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data;
      }
    })
  }

  ngOnInit() {}

  public updateUser(){
    this._userService.updateUser(this.user).subscribe({
      next: (data) => {
        this.user = data;
        this.showChangeSucessToast = true;
      }
    });
  }

  public changePassword(){
    // test if passwords are the same
    if(this.newPassword === "" || this.newPassword === "" || this.newPasswordConfirm === ""){
      this.showPasswordCannotBeEmptyToast = true;
      return;
    }

    // test if the password is the same
    if(this.newPassword !== this.newPasswordConfirm){
      this.showPasswordsAreNotSameToast = true;
      return;
    }

    this._userService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: (data) => {
        this.showChangeSucessToast = true;
        this.newPassword = "";
        this.newPasswordConfirm = "";
        this.oldPassword = "";
      },
      error: (error) => {
        // if wrong password is entered show the wrong credential toast
        if(error.status == 401){
          this.showWrongCredentialToastOpen = true;
        }
      }
    })

  }

}
