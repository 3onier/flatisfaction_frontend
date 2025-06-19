import { Component, inject, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';

import { filter, map, mergeMap } from 'rxjs/operators'

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent{

  public currentTitle = environment.appTitle;

  constructor(){}

}
