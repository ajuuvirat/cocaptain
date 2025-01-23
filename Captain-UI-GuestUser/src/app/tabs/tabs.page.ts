import { Component } from '@angular/core';
import { Injectable } from '@angular/core'; 
import { User } from '../model/user'; 
import { environment } from '../../environments/environment'; 
import { Restaurant } from '../model/restaurant';

import { Role } from '../model/role';
import { EmployeeService } from '../token-gate/service/employee.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivatedRoute }  from '@angular/router';
import { Router ,Event , NavigationExtras} from '@angular/router';
import { AlertController , ToastController} from '@ionic/angular';
import { Product } from '../model/product/Product';
import { OrderDetail } from '../model/order-detail';
import { Order } from '../model/order';

import {NativeAudio} from '@capacitor-community/native-audio';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  activeTab: string = 'list';
  orderId:string;
  userStatus:number;
  isTabChanged:boolean = false;
  subscriptionType: string | null;
  constructor(private service: EmployeeService,
    private authService : AuthenticationService,
    private router:Router,
    private route:ActivatedRoute,
    public alertController: AlertController,
    private toastController: ToastController) { 
    this.orderId = this.route.snapshot.params['orderId'];
    if(this.orderId == undefined){
      this.service.currentOrderId.subscribe(
        orderId =>
      this.orderId = orderId);
    }
    
      this.service.userStatus.subscribe(
        orderId =>
      this.userStatus = orderId);
      
    
       console.log(this.userStatus);
       
      //  this.router.navigate([`home/tabs/list/${this.orderId}`]);


    }
    public onOpenItem(item: any) {
      this.router.navigate([`tabs/list/${this.orderId}`]);
    }
  setCurrentTab(event: any){
    console.log('event+++',event);
    
    this.activeTab = event.tab;
    console.log(event);
    this.playSound();
}
  ngOnInit() {
    this.subscriptionType = localStorage.getItem('subscriptionType')
    console.log('subscriptionType',this.subscriptionType);
  }

  async playSound(){
    if(this.isTabChanged){
      await NativeAudio.play({
        assetId: 'doorbell',
        // time: 6.0 - seek time
    });
    }else{
      this.isTabChanged = true
    }
    
  }

}
