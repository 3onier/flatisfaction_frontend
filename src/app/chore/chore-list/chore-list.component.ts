import { Component, inject, OnInit } from '@angular/core';
import { ChoreService } from '../chore.service';
import { Chores } from '../chore';
import { FlatService } from 'src/app/flat/flat.service';

@Component({
  selector: 'app-chore-list',
  templateUrl: './chore-list.component.html',
  styleUrls: ['./chore-list.component.scss'],
  standalone: false
})
export class ChoreListComponent  implements OnInit {

  private _choreService: ChoreService = inject(ChoreService);
  private _flatService = inject(FlatService);
  
  public chores: Chores = [];
  public isLoading: boolean = true;

  constructor() { }

  ngOnInit() {
    this.load();
    FlatService.flatChangeEvent$.subscribe(() => this.load());
  }

  load(){
    this._choreService.getFlatChores().subscribe({
      next: (c) => {
        this.isLoading = false;
        this.chores = c;
      }
    });
  }

}
