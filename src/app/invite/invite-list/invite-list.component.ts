import { Component, inject, Input, OnInit } from '@angular/core';
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

  private _inviteService: InviteService = inject(InviteService);

  constructor() { }

  ngOnInit() {
    this.loadInvites();
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

}
