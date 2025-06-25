import { Component, inject, OnInit } from '@angular/core';
import { Flat } from '../flat';
import { FlatService } from '../flat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flat-create',
  templateUrl: './flat-create.component.html',
  styleUrls: ['./flat-create.component.scss'],
  standalone: false,
  providers: [FlatService]
})
export class FlatCreateComponent  implements OnInit {

  public flat: Flat = new Flat();
  
  private _flatService = inject(FlatService);
  private _router: Router = inject(Router);

  constructor() { }

  ngOnInit() {}

  public createFlat(){
    this._flatService.createFlat(this.flat).subscribe({
      next: (f) => {
        // select the created flat
        this._flatService.setSelectedFlatId(f.id as number);
        this._router.navigate(["/flat/detail"]);
      }
    });
  }

}
