import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';

import { ChoreFrequencyEnum } from '../enums';

import { User } from '../../user/user';
import { ChoreService, NoChoreEditingPermissionError } from '../chore.service';
import { Chore, Chores } from '../chore';
import { FlatService } from 'src/app/flat/flat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WeekDays } from 'src/app/common/enums';
import { ToastService } from 'src/app/common/toast.service';

@Component({
  selector: 'app-chore-detail',
  templateUrl: './chore-detail.component.html',
  styleUrls: ['./chore-detail.component.scss'],
  standalone: false
})
export class ChoreDetailComponent  implements OnInit {

  constructor() { }

  private _choreService: ChoreService = inject(ChoreService);
  private _flatService: FlatService = inject(FlatService);
  private _toastService: ToastService = inject(ToastService);
  private _alertControler: AlertController = inject(AlertController);
  private _activatedRouter: ActivatedRoute = inject(ActivatedRoute);
  private _location: Location = inject(Location);
  private _router: Router = inject(Router);

  public chore: Chore = new Chore();

  public readonly: boolean = false;

  public flatMembers: Array<User> = [];
  public assignedTaskMap = new Map<User, boolean>();

  public isLoading = true;
  public showElements = {
    "startDate": false,
    "endDate": false,
    "dueDate": false,
    "calendar": false,
    "weekdays": false,
    "repGap": false,
    "indefinite": false
  };

  public frequencyEnums = ChoreFrequencyEnum;
  public frequencySelected: ChoreFrequencyEnum = ChoreFrequencyEnum.once;

  public hightlightesDates: Array<any> = [];

  public searchElements: Chores = [];
  public searchElements$: Chores = [];
  public selectedWeekdays: any = undefined;


  public cannotFindChoreAlert: boolean = false;
  public cannotFindChoreAlertButtons = [
    {
      text: "close",
      role: 'confirm',
      handler: () => {
        this._location.back();
      }
    }
  ];

  ngOnInit() {
    this.loadSearchElements();
    this._activatedRouter.params.subscribe({
      next: (p) => {
        if(p["id"] != undefined){
          this.loadFromId(p["id"] as number);
        }else{
          this.loadFromEmpty();
        }
      }
    });
  }

  loadFromEmpty(){
    this.loadFrequencySelection();
    this.loadFlatMembers();
    // set the start date as today
    this.chore.start_date = new Date( (new Date().toISOString()).split("T")[0] );
  }

  loadFromId(id: number|undefined, template: boolean = false){
    if (!id){
      return;
    }
    this._choreService.getChore(id).subscribe({
      next: (c) => {
        if (template){
          c.id = undefined;
        }
        this.chore = c;
        this.loadFlatMembers();
        this.loadFrequencySelection();
        this.generateHightlightedDates();
        this.selectedWeekdays = c.weekdays.map( (e: WeekDays) => e.toString() );
      },
      error: (err) => {
        this.cannotFindChoreAlert = true;
      }
    });
  }

  loadSearchElements(){
    this._choreService.getFlatChores().subscribe({
      next: (c) => {
        this.searchElements = c;
      }
    });
  }

  loadFlatMembers(){
    this._flatService.getFlatMembers().subscribe({
      next: (members) => {
        this.flatMembers = members as Array<User>
        // check which member is responsible for this task
        for (let member of members){
          let val = this.chore.responsible_members_verbose.find( (u) => (u as User).username == member.username ) != undefined;
          this.assignedTaskMap.set(member, val);
        }
        this.isLoading = false;
      }
    });
  }

  handleMembersCheck(event: CustomEvent, user: User){
    let isChecked = event.detail.checked || false;
    this.assignedTaskMap.set(user, isChecked);
    this.chore.responsible_members_verbose = [];
    let responsible_members: Array<number> = [];
    let responsible_members_verbose: Array<User> = [];
    this.assignedTaskMap.forEach((v, u) => {
      if(v){
        responsible_members_verbose.push(u);
        responsible_members.push(u.id as number);
      }
    });
    this.chore.responsible_members_verbose = responsible_members_verbose;
    this.chore.responsible_members = responsible_members;
  }

  loadFrequencySelection(){
    // set all the values to 0 at frist
    for (let [key, value] of Object.entries(this.showElements)){
      this.showElements[key as keyof typeof this.showElements] = false;
    }
    switch (this.chore.frequency){
      case ChoreFrequencyEnum.daily:
        this.showElements.startDate = true;
        this.showElements.calendar = true;
        this.showElements.indefinite = true;
        break;
      case ChoreFrequencyEnum.weekly:
        this.showElements.startDate = true;
        this.showElements.calendar = true;
        this.showElements.weekdays = true;
        this.showElements.indefinite = true;
        break;
      case ChoreFrequencyEnum.once:
        this.showElements.dueDate = true;
        break;
    }
    if (this.chore.end_date && this.showElements.indefinite){
      this.showElements.endDate = true;
    }
  }

  handleFrequencySelection(){
    // set all values false for showing detail
    this.loadFrequencySelection();
    this.generateHightlightedDates();
  }

  handleWeekdaySelect(event: CustomEvent){
    this.chore.weekdays = event.detail.value.map( (e: string) => parseInt(e) );
    this.selectedWeekdays = this.chore.weekdays;
    this.generateHightlightedDates();
  }

  handleStartDaySet(event: CustomEvent){
    this.chore.start_date = new Date(event.detail.value + "Z");
    this.generateHightlightedDates();
  }

  handleEndDateSet(event: CustomEvent){
    this.chore.end_date = new Date(event.detail.value + "Z");
    this.generateHightlightedDates();
  }

  handleToggleRunsForever(event: CustomEvent){
    // when checked remove the property of end_date for the chore
    if(event.detail.checked){
      this.chore.end_date = undefined;
      this.showElements.endDate = false;
    }
    // if checked then set the date to one day after the start date
    else {
      
      if (this.chore.start_date){
        this.chore.end_date = new Date(this.chore.start_date?.getTime());
        this.chore.end_date?.setDate( this.chore.end_date?.getDate() + 1 );
      }
      this.showElements.endDate = true;
    }
  }

  private _getHightlight(date: Date){
    return {
        backgroundColor: 'var(--ion-color-primary)',
        textColor: 'var(--ion-color-dark)',
        date: date.toISOString().split("T")[0]
      };
  }

  generateHightlightedDatesDaily(){
    const MAX_EVENTS = 250;
    let countAppointment = 0;
    let repCounter = 0;
    let now = new Date(Date.now());
    console.log(this.chore);
    while(countAppointment < MAX_EVENTS){
      if(this.chore.frequency_gap < 1)
        return;
      // test if the end date is set and if now is past the end date
      if(this.chore.end_date && now > this.chore.end_date){
        return;
      }
      if(repCounter % this.chore.frequency_gap != 0){
        now.setDate(now.getDate() + 1);
        repCounter++;
        continue;
      }
      this.hightlightesDates.push(this._getHightlight(now));
      // count up a day
      now.setDate(now.getDate() + 1);
      repCounter++;
      countAppointment++;
    }
  }

  generateHightlightedDatesWeekly(){
    let MAX_EVENTS = 250;
    let countAppointment = 0;
    let now = new Date();
    let weekCount = 0;
    // check if no weekday is selected
    if(this.chore.weekdays.length == 0){
      return;
    }
    while(countAppointment < MAX_EVENTS){
      // test if the end date is set and if now is past the end date
      if(this.chore.end_date && now > this.chore.end_date){
        return;
      }
      if(this.chore.weekdays.includes(now.getDay()) && weekCount % this.chore.frequency_gap == 0 && this.chore.frequency_gap != 0){
        
        this.hightlightesDates.push(this._getHightlight(now));
        countAppointment++;
      }
      if(now.getDay() == 0){
        weekCount++;
      }
      now.setDate(now.getDate() + 1);
    }
  }

  generateHightlightedDates(){
    let countAppointment = 0;
    this.hightlightesDates = [];
    if(this.chore.frequency == ChoreFrequencyEnum.once && this.chore.start_date){
      this.hightlightesDates.push(this._getHightlight(this.chore.start_date));
    }
    if(this.chore.frequency == ChoreFrequencyEnum.daily){
      this.generateHightlightedDatesDaily();
    }
    if(this.chore.frequency == ChoreFrequencyEnum.weekly){
      this.generateHightlightedDatesWeekly();
    }
  }

  handleSeachbarEvent(event: CustomEvent){
    let findSubstring = function (sub: Chore){
      let inTitle = sub.name.toLowerCase().includes(searchString.toLowerCase());
      let inDescription = sub.description.toLowerCase().includes(searchString.toLowerCase());
      return inTitle || inDescription;
    }
    let searchString = event.detail.value;
    if(searchString == ""){
      this.searchElements$ = [];
      return;
    }
    this.searchElements$ = this.searchElements.filter(findSubstring);
    if(this.searchElements$.length > 5)
      this.searchElements$ = this.searchElements.slice(0, 5)
  }

  save(){
    try{
      this.validate()
    }catch(err: any){
      this._toastService.displayErrorToast((err as Error).message);
      return;
    }
    this._choreService.saveChore(this.chore).subscribe({
      next: (c) => {
        this.chore = c;
        this._toastService.displaySuccessToast("Your chore was successfully saved!");
        this.openRegenerateScheudleAlert();
      },
      error: (e) => {
        if(e instanceof NoChoreEditingPermissionError){
          this._toastService.displayErrorToast("You are not allowed to edit the chore");
        }else{
          this._toastService.displayErrorToast("Chore could not be edited");
        }
      }
    });
  }

  validate(){
    this.validateName();
    this.validateWeekday();
    this.validateSelectedMembers();
  }

  validateWeekday(){
    if(this.chore.frequency == this.frequencyEnums.weekly && this.chore.weekdays.length == 0){
      throw new Error("Please select at least one Weekday");
    }
  }

  validateSelectedMembers(){
    if(this.chore.responsible_members.length == 0){
      throw new Error("Please assign the chore to at least one member");
    }
  }

  validateName(){
    if(this.chore.name.length == 0){
      throw new Error("Please give the chore a name");
    }
  }

  delete(){
    this._choreService.deleteChore(this.chore).subscribe({
      next: () => {
        this._location.back();
      },
      error: (e) => {
        if(e instanceof NoChoreEditingPermissionError)
          this._toastService.displayErrorToast("You are not permitted to delete the chore");
        else
          this._toastService.displayErrorToast("Something went wrong");
      }
    });
  }

  async openRegenerateScheudleAlert(){
    let alert = await this._alertControler.create({
      message: "Shedules are not generated automaticially. You can either generate a new one now or create it later.",
      header: "Chore edited",
      subHeader: "Do you want to regenerate a new scheduele?",
      buttons: [
        {
          text: "remind me later"
        },
        {
          text: "generate now",
          handler: () => {this._router.navigate(["/chore/calendar"]);}
        }
      ]
    })

    await alert.present();
  }

}
