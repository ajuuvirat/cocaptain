import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BulkOrderPageRoutingModule } from './bulk-order-routing.module';

import { BulkOrderPage } from './bulk-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BulkOrderPageRoutingModule
  ],
  declarations: [BulkOrderPage]
})
export class BulkOrderPageModule {}
