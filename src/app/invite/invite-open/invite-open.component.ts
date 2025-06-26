import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InviteService , InviteExpiredErr, InviteNotFoundErr, MemberOfFlatAlreadyErr } from '../invite.service';
import { Invite } from '../invite';
import { Flat } from 'src/app/flat/flat';
import { FlatService } from 'src/app/flat/flat.service';

@Component({
  selector: 'app-invite-open',
  templateUrl: './invite-open.component.html',
  styleUrls: ['./invite-open.component.scss'],
  standalone: false
})
export class InviteOpenComponent  implements OnInit {

  public inviteCode: string = '';
  public invite: Invite = new Invite();
  public flat: Flat = new Flat();

  public loaded: boolean = false;
  public showError: boolean = false;
  public errorMessage: string = '';

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _inviteService: InviteService = inject(InviteService);
  private _flatService: FlatService = inject(FlatService);
  private _router: Router = inject(Router);

  constructor() {
    this._activatedRoute.params.subscribe( (p) => {
      this.inviteCode = p['invite_code'];
      this.loadInvite();
    });
  }

  ngOnInit() {}

  public loadInvite(){
    this._inviteService.getInvite(this.inviteCode).subscribe({
      next: (d) => {
        this.invite = d;
        this.flat = d.flat as Flat;
        this.loaded = true;
      },
      error: (e) => {
        this.displayError(e);
      }
    })
  }

  public displayError(e: Error){
    this.errorMessage = "An Error occured"
    if (e instanceof InviteExpiredErr){
      this.errorMessage = "The Invite link expired. It is either too old or has been used too many times already.";
    }
    if( e instanceof InviteNotFoundErr ) {
      this.errorMessage = "We could not find this invite link.";
    }
    if (e instanceof MemberOfFlatAlreadyErr){
      this.errorMessage = "You are already a member of the flat";
    }
    this.showError = true;
  }

  public close(){
    this._router.navigate(["/"]);
    this.loaded = false;
    this.showError = false;
  }

  public join(){
    this._inviteService.openInvite(this.inviteCode).subscribe({
      next: (flat) => {
        this._flatService.setSelectedFlatId(flat.id as number);
        this.close();
      }
    });
  }

}
