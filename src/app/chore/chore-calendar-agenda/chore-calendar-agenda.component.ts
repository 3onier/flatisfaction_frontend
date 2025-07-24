import { Component, EventEmitter, inject, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { ChoreAppointment, ChoreAppointments } from '../chore-appointment';
import { ScheduleService } from '../schedule.service';
import { Subscription, timer } from 'rxjs';
import { User } from 'src/app/user/user';
import { FlatService } from 'src/app/flat/flat.service';
import { UserService } from 'src/app/user/user.service';
import { AlertController, AlertInput } from '@ionic/angular';
import { ToastService } from 'src/app/common/toast.service';

@Component({
  selector: 'app-chore-calendar-agenda',
  templateUrl: './chore-calendar-agenda.component.html',
  styleUrls: ['./chore-calendar-agenda.component.scss'],
  standalone: false
})
export class ChoreCalendarAgendaComponent  implements OnInit {

  @Input({transform: groupChoreAppointmentByDate}) public choreAppointments: Map<string,ChoreAppointments> = new Map<string,ChoreAppointments>();
  @Input({transform: transformDateStringOrDateToDate}) public startDate: Date;
  @Input({transform: transformDateStringOrDateToDate}) public endDate: Date;
  @Input() public user: number|User|null = null; 

  @Input() public showDate = true;

  public executorInputsMember: Array<Object> = [];
  public executorChoreAppointmentSelected? :ChoreAppointment;
  public executroChoreAppointmentDateSelected?: string;
  public executorAlertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'confirm',
      role: 'confirm',
      handler: (user?: User) => { this.executorAlertConfirm(user) }
    }
  ];

  private _scheduleService = inject(ScheduleService);
  private _flatService = inject(FlatService);
  private _userService = inject(UserService);
  private _toastService = inject(ToastService);
  private _loadChoreAppointmentsSubscription = new Subscription();

  private _alertControler = inject(AlertController);

  @Output() public onLoadingChange = new EventEmitter<boolean>();
  public isLoading = true;

  constructor() {
    this.startDate = new Date()
    let endDate = new Date(this.startDate);
    endDate.setDate(this.startDate.getDate() + 7);
    this.endDate = endDate;
    FlatService.flatChangeEvent$.subscribe(() => this.load())
  }

  ngOnInit() {
    this.load();
  }

  public load(){
    this.loadChoreAppointments();
    this.generateAlertInput()
  }

  public loadChoreAppointments(){
    this.onLoadingChange.emit(true);
    this.isLoading = true;
    this._loadChoreAppointmentsSubscription = this._scheduleService.getFlatSchedule(this.startDate, this.endDate, this.user).subscribe({
      next: (ca) => {
        this.choreAppointments = groupChoreAppointmentByDate(ca);
        this.onLoadingChange.emit(false);
        this.isLoading = false;
      }
    });
  }

  public loadChoreAppointmentsDebouce(ms: number){
    this.onLoadingChange.emit(true);
    this.isLoading = true;
    this._loadChoreAppointmentsSubscription.unsubscribe();
    this._loadChoreAppointmentsSubscription = timer(ms).subscribe( () => this.loadChoreAppointments() );
  }

  public formatDate(date_string: any): string{
    let date = new Date(date_string);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formattedDate: string = date.toLocaleDateString(undefined, options);
    return formattedDate;
  }

  public changeWeek(num: number){
    this.startDate.setDate(this.startDate.getDate() + 7*num)
    this.endDate.setDate(this.endDate.getDate() + 7*num)
    this.loadChoreAppointmentsDebouce(500);
  }

  public changeStartDate(event: CustomEvent){
    this.startDate = new Date(event.detail.value);
    // make sure to move end date after start date
    if (this.startDate > this.endDate){
      this.endDate = this.startDate;
      this.endDate.setDate(this.endDate.getDate() + 1)
    }
    this.loadChoreAppointments();
  }

  public changeEndDate(event: CustomEvent){
    this.endDate = new Date(event.detail.value);
    this.loadChoreAppointments();
  }

  public generateAlertInput(){
    this._flatService.getFlatMembers().subscribe({
      next: (m) => {this._generateAltertInputs(m);}
    });
  }

  private _generateAltertInputs(members: Array<User>){
    for(let member of members){
      let inp = {
        label: member.username,
        value: member,
        type: 'radio'
      }
      this.executorInputsMember.push(inp);
    }
  }

  async executorAlertPresent(appointment: ChoreAppointment, date: string){
    this.executorChoreAppointmentSelected = appointment;
    this.executroChoreAppointmentDateSelected = date;
    const alert = await this._alertControler.create({
      message: "Who finished the chore?",
      inputs: this.executorInputsMember,
      buttons: this.executorAlertButtons
    });
    await alert.present();
  }

  async executorAlertConfirm(user?: User){
    if(!user){
      let alert = await this._alertControler.create({
        header: "No flat member has been selected. ",
        message: "Please select a Flat member",
        buttons: ['ok']
      });
      await alert.present();
      return;
    }
    if(this.executorChoreAppointmentSelected){
      this.updateChoreAppointmentExecutor(this.executorChoreAppointmentSelected, user);
    }
  }

  handleClickDone(appointment: ChoreAppointment){
    this.updateChoreAppointmentExecutor(appointment, appointment.assigned_member_verbose);
  }

  handleClickReset(appointment: ChoreAppointment){
    this.updateChoreAppointmentExecutor(appointment);
  }

  handleClickDelete(appointment: ChoreAppointment){
  this._scheduleService.deleteChoreAppointment(appointment).subscribe({
    next: () => {
      if(appointment.date){
        let index = appointment.date?.toDateString();
        let arr = this.choreAppointments.get(index);
        if (arr?.length == 1){
          this.choreAppointments.delete(index);
        }else if (arr){
          arr.splice(arr.findIndex( (e) => e.id == appointment.id ));
          this.choreAppointments.set(index, arr);
        }
      }
    }
  });
  }

  async handleReassignClick(app: ChoreAppointment){

    // generate inputs by members of the flat
    let inputs = new Array<AlertInput>()
    let members = app.flat_verbose?.members || [];
    for(let member of members){
      let input: AlertInput = {
        type: 'radio',
        label: (member as User).username || "",
        checked: app.assigned_member_verbose?.id == (member as User).id,
        value: member as User
      }
      inputs.push(input);
    }

    let alert = await this._alertControler.create({
      header: "Reassign Taks",
      subHeader: "Who do you want to assign the task to?",
      inputs: inputs,
      buttons: [
        {
          text: 'Reassign',
          handler: (user: User) => this.reassign(app, user)
        },
        {
          text: 'Cancle'
        }
      ]
    });

    await alert.present();
  }

  reassign(app: ChoreAppointment, user: User){
    app.assigned_member = user.id || null;
    app.assigned_member_verbose = user;
    this.updateChoreAppointmentExecutor(app);
  }

  updateChoreAppointmentExecutor(appointment: ChoreAppointment, user: User|null = null){
    appointment.executor = (user?.id || null);
    this._scheduleService.updateChoreAppointment(appointment).subscribe({
      next: (ca) => {
        let dateSelected = ca.date?.toDateString();
        if(dateSelected){
          let arr = this.choreAppointments.get(dateSelected);
          let index = arr?.findIndex( (e: ChoreAppointment) => e.id == ca.id );
          if(index != undefined && arr!=undefined){
            arr[index] = ca;
            this.choreAppointments.set(dateSelected, arr);
          }
        }
        this._toastService.displaySuccessToast("Change was saved");
      },
      error: (err: Error) => {
        this._toastService.displayErrorToast(err.message);
      }
    });
  }
}

function groupChoreAppointmentByDate(apps: ChoreAppointments): Map<string,ChoreAppointments>{
  let out = new Map<string, ChoreAppointments>();
  for (let app of apps){
    if(app.date == null)
      continue;
    let date = (app.date as Date).toDateString();
    let arr = out.get(date) || new Array<ChoreAppointment>;
    arr.push(app)
    out.set(date, arr)
  }
  return out;

}

function transformDateStringOrDateToDate(date: Date|string): Date{
  if (date instanceof Date){
    return date
  }
  return new Date(date);
}