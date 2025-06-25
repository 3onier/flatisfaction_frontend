import { Component, inject, OnInit } from '@angular/core';

import { FlatService } from '../flat.service';
import { Flat } from '../flat';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flat-selection',
  templateUrl: './flat-selection.component.html',
  styleUrls: ['./flat-selection.component.scss'],
  standalone: false
})
export class FlatSelectionComponent  implements OnInit {

  public flats: Array<Flat> = [];
  public selectedFlat: number|undefined = undefined;

  public show:boolean = false;

  private _flatService: FlatService = inject(FlatService);
  private _router: Router = inject(Router);

  private _sub: Subscription;

  constructor() {
    this._sub = FlatService.flatChangeEvent$.subscribe(() => {
      this.loadFlats();
    });
  }

  ngOnInit() {
    this.loadFlats();
  }

  public loadFlats(){
    this._flatService.getFlats().subscribe({
      next: (f) => {
        this.flats = f;
        this.show = f.length > 1;
        this.loadSelectedFlat();
      }
    })
  }

  public handleSelect(event: any){
    let flatId = event.target.value || undefined;
    this.selectedFlat = flatId;
    this.selectFlat(flatId);
  }

  public loadSelectedFlat(){
    try{
      this.selectedFlat = this._flatService.getSelectedFlatId();
    }catch{
      // do nothing
    }
  }

  public selectFlat(id: number|undefined){
    this._flatService.setSelectedFlatId(id as number);
    let url = this._router.url;
    this._router.navigate(["/"]).then(() => {
      this._router.navigate([url]);
    });
  }

}
