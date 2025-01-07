import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TakeorderPage } from './takeorder.page';

const routes: Routes = [
  {
    path: '',
    component: TakeorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TakeorderPageRoutingModule {}
