import { Component, inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

import { Invite } from '../invite';
import { FlatService } from 'src/app/flat/flat.service';
import { InviteService } from '../invite.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invite-list',
  templateUrl: './invite-list.component.html',
  styleUrls: ['./invite-list.component.scss'],
  standalone: false,
  providers: [FlatService]
})
export class InviteListComponent  implements OnInit, OnDestroy {

  public invites: Array<Invite> = [];
  
  public canShare: boolean = false;

  private _inviteService: InviteService = inject(InviteService);
  private _changeFlatSubscription: Subscription;

  constructor() {
    this._changeFlatSubscription = FlatService.flatChangeEvent$.subscribe(this.refresh);
  }

  ngOnInit() {
    this.refresh();
    Share.canShare().then(
      (r) => {
        this.canShare = r.value;
      }
    );
  }

  public refresh(){
    this.loadInvites();
  }

  ngOnDestroy(): void {
    this._changeFlatSubscription.unsubscribe();
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

  public async copyToClipboard(invite: Invite){
    try{
      await Clipboard.write({
        url: this.getInviteLink(invite.code)
      });
    }catch{
      console.log("Clipboard not availiable");
    }
    
  }

}
