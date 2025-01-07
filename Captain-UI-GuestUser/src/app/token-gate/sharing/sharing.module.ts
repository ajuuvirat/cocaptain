import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharingRoutingModule } from './sharing-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharingComponent } from './sharing/sharing.component';
import { OrderListPageModule } from '../order-list/order-list.module';
import { OrderListPage } from '../order-list/order-list.page';


@NgModule({
  declarations: [SharingComponent],
  imports: [
    CommonModule,
    SharingRoutingModule,
    IonicModule,
    FormsModule,
    OrderListPageModule,
    ReactiveFormsModule,
  ]
})
export class SharingModule { }
