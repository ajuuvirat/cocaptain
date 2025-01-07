import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharingComponent } from './sharing/sharing.component';

const routes: Routes = [
  {
    path: '',
    component:SharingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharingRoutingModule { }
