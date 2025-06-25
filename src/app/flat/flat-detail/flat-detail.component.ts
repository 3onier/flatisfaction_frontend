import { Component, inject, OnInit } from '@angular/core';
import { FlatService } from '../flat.service';
import { Flat } from '../flat';
import { User } from 'src/app/user/user';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-flat-detail',
  templateUrl: './flat-detail.component.html',
  styleUrls: ['./flat-detail.component.scss'],
  standalone: false,
  providers: [FlatService]
})
export class FlatDetailComponent {

  private _flatService: FlatService = inject(FlatService);
  private _userService: UserService = inject(UserService);
  private _router: Router = inject(Router);

  public flat: Flat = new Flat()
  public flatMembers: Array<User> = [];
  public flatMembersShown: Array<User> = [];
  public flatAdmins: Array<User> = [];

  public showFlatMembers = false;

  public isAdmin: boolean = false;

  public isleaveAlertOpen: boolean = false;

  public showSuccessToast: boolean = false;

  public leaveAlertButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.leaveFlat();
      },
    },
  ];

  constructor() {
    
  }

  ionViewDidEnter(){
    this.loadFlat();
    this.loadFlatMembers();
    this.loadFlatAdmins();
  }

  public loadFlat(){
    this._flatService.getFlat().subscribe({
      next: (data) => {
        this.flat = data;
      }
    });
  }

  public updateFlat(){
    this._flatService.updateFlat(this.flat).subscribe({
      next: (d) => {
        this.flat = d;
        this.showSuccessToast = true;
      }
    });
  }

  public loadFlatMembers(){
    this._flatService.getFlatMembers().subscribe({
      next: (data) => {
        this.flatMembers = data;
        this.flatMembersShown = data;
        this.checkIsAdmin();
        this.removeAdminsFromMembers();
      }
    });
  }

  public loadFlatAdmins(){
    this._flatService.getFlatAdmins().subscribe({
      next: (data) => {
        this.flatAdmins = data;
        this.checkIsAdmin();
        this.removeAdminsFromMembers();
      }
    });
  }

  public setleaveAlertOpen(open: boolean){
    this.isleaveAlertOpen = open;
  }

  public leaveFlat(){
    this._flatService.leaveFlat().subscribe({
      next: (data) => this._router.navigate(["/"])
    });
  }

  public removeAdminsFromMembers(){
    let flatAdmins = this.flatAdmins;
    // remove all members who are admins
    this.flatMembersShown = this.flatMembers.filter( (el) => !flatAdmins.find( (el2) => el2.id == el.id ) )
  }

  public checkIsAdmin(){
    // check if username and admin is not empty
    if(this.flatAdmins.length == 0 || this.flatMembers.length == 0){
      return;
    }
    this._userService.getUser().subscribe({
      next: (user) => {
        // if user appears in list then the user is admin
        let admins= this.flatAdmins.find( (u) => u.username == user.username );
        this.isAdmin =  admins != undefined;
      }
    });
  }

  public makeAdmin(user_id: number|undefined){
    this._flatService.makeAdmin(user_id as number).subscribe({
      next: (d) => {
        this.loadFlatAdmins();
        this.showSuccessToast = true;
      }
    });
  }

  public revokeAdmin(user_id: number|undefined){
    this._flatService.revokeAdmin(user_id as number).subscribe({
      next: (d) => {
        this.loadFlatAdmins();
        this.showSuccessToast = true;
      }
    });
  }

  public removeMember(user_id: number|undefined){
    this._flatService.removeFlatMember(user_id as number).subscribe({
      next: (d) => {
        this.loadFlatMembers();
        this.loadFlatAdmins();
        this.showSuccessToast = true;
      }
    })
  }

}
