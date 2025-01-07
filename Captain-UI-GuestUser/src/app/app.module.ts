import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import {  IonicRouteStrategy } from '@ionic/angular';

import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import  { AuthguardGuard } from './authentication/authguard.guard';
import { AuthenticationService } from './authentication/authentication.service';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";



/** Adding introceptor */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { InterceptorService } from './token-gate/interceptor.service';

// import { MaterialModule } from './material.module';

import {EmployeeService} from './token-gate/service/employee.service';

import {ApprovalPageModule} from './token-gate/approval/approval.module'
 
import 'hammerjs';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [AppComponent],
 
  
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    // MaterialModule
    
  ],
  providers: [
    AuthguardGuard, 
    AuthenticationService,
    EmployeeService,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
