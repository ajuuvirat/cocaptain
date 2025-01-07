import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListBulkPageRoutingModule } from './list-bulk-routing.module';

import { ListBulkPage } from './list-bulk.page';
import { BulkTabPageModule } from './bulk-tab/bulk-tab.module';
import { DetailProductPage } from '../detail-product/detail-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListBulkPageRoutingModule,
  ],
  declarations: [ListBulkPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListBulkPageModule {}
