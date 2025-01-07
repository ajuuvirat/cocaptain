import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NeedsListPage } from './needs-list.page';

const routes: Routes = [
  {
    path: '',
    component: NeedsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [NeedsListPage]
})
export class NeedsListPageModule {}
