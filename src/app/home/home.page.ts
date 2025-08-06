import { Component, inject, OnInit } from '@angular/core';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {


  public user?: User;
  private _userService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this._userService.getUser().subscribe({
      next: (u) => {
        this.user = u;
      }
    });
  }

}
