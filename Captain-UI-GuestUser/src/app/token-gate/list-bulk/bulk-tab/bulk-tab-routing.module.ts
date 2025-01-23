import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkTabPage } from './bulk-tab.page';

const routes: Routes = [
  {
    path: '',
    component: BulkTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkTabPageRoutingModule {}
