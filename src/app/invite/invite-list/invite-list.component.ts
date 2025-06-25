import { Component, inject, Input, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';

import { Invite } from '../invite';
import { FlatService } from 'src/app/flat/flat.service';
import { InviteService } from '../invite.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite-list',
  templateUrl: './invite-list.component.html',
  styleUrls: ['./invite-list.component.scss'],
  standalone: false,
  providers: [FlatService]
})
export class InviteListComponent  implements OnInit {

  public invites: Array<Invite> = [];
  
  public canShare: boolean = false;

  private _inviteService: InviteService = inject(InviteService);

  constructor() { }

  ngOnInit() {
    this.loadInvites();
    Share.canShare().then(
      (r) => {
        this.canShare = r.value;
      }
    );
  }

  public loadInvites(){
    this._inviteService.getInvites().subscribe({
      next: (i) => {
        this.invites = i;
      }
    });
  }

  public getBadgeColor(invite: Invite){
    if(invite.is_expired){
      return 'danger';
    }
    return 'success';
  }

  public createInvite(){
    let invite = new Invite();
    invite.max_uses = 10;
    this._inviteService.createInvite(invite).subscribe({
      next: (i) => {
        this.invites.push(i);
      }
    })
  }

  public deleteInvite(invite: Invite){
    this._inviteService.deleteInvite(invite.code).subscribe({
      next: () => {
        let index = this.invites.findIndex( (i) => i == invite );
        this.invites.splice(index, 1);
      }
    });
  }

  public getInviteLink(code: string): string{
    return environment.appUrl + "invite/open/" + code;
  }

  public async shareInvite(invite: Invite){
    await Share.share({
      title: 'Welcome to our Flat',
      text: 'Please join the flat on the App to manage our flat together :D',
      url: this.getInviteLink(invite.code),
      dialogTitle: 'Invite your flatmane',
    });
  }

}
