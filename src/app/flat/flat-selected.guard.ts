import { CanActivateFn, Router } from '@angular/router';

import { lastValueFrom } from 'rxjs'

import { FlatService, NoFlatSelectedError } from './flat.service';
import { inject } from '@angular/core';
import { Flat } from './flat';

export const flatSelectedGuard: CanActivateFn = async (route, state) => {
  let flatService: FlatService = inject(FlatService);
  let router: Router = inject(Router);
  
  try {
    // see if flat is selected
    let selectedFlatId = flatService.getSelectedFlatId();
    return true;
  }catch{}

  let flats: Array<Flat> = await lastValueFrom<Array<Flat>>(flatService.getFlats());
  // if there is no flat, return false and redirect to an error page
  if(flats.length == 0){
    router.navigate(["/flat/create"]);
    return false;
  }
  // take the first flat as defal
  let flat: Flat = flats[0];
  flatService.setSelectedFlatId(flat.id as number);
  return true;
};
