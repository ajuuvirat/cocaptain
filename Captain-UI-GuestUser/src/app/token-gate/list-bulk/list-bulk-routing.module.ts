import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListBulkPage } from './list-bulk.page';

const routes: Routes = [
  {
    path: '',
    component: ListBulkPage
  },
  {
    path: 'bulk-tab',
    loadChildren: () => import('./bulk-tab/bulk-tab.module').then( m => m.BulkTabPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBulkPageRoutingModule {}
