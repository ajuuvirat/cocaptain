import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RatingPage } from './rating.page';

/*const routes: Routes = [
  {
    path: '',
    component: RatingPage
  }
];*/

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //RouterModule.forChild(routes)
  ],
  exports: [RatingPage],
  declarations: [RatingPage]
})
export class RatingPageModule {}
