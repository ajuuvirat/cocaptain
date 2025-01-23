import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BulkTabPageRoutingModule } from './bulk-tab-routing.module';

import { BulkTabPage } from './bulk-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BulkTabPageRoutingModule
  ],
  declarations: [BulkTabPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class BulkTabPageModule {}
