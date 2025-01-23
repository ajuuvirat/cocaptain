import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailProductPage } from './detail-product.page';

// import { MaterialModule } from './../../material.module';

const routes: Routes = [
  {
    path: '',
    component: DetailProductPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailProductPage]
})
export class DetailProductPageModule {}
