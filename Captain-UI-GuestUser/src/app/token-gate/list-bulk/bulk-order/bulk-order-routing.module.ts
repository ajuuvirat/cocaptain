import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkOrderPage } from './bulk-order.page';

const routes: Routes = [
  {
    path: '',
    component: BulkOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkOrderPageRoutingModule {}
