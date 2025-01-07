import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpVerficationPageRoutingModule } from './otp-verfication-routing.module';
import { OtpVerficationPage } from './otp-verfication.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpVerficationPageRoutingModule
  ],
  declarations: [OtpVerficationPage]
})
export class OtpVerficationPageModule {}
