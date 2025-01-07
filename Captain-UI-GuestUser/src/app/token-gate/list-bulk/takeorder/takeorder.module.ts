import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TakeorderPageRoutingModule } from './takeorder-routing.module';

import { TakeorderPage } from './takeorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TakeorderPageRoutingModule
  ],
  declarations: [TakeorderPage]
})
export class TakeorderPageModule {}
