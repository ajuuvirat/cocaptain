import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpVerficationPage } from './otp-verfication.page';

const routes: Routes = [
  {
    path: '',
    component: OtpVerficationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpVerficationPageRoutingModule {}
