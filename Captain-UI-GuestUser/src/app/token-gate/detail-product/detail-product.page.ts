import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../model/employee';
import { Subscription } from '../../../../node_modules/rxjs';
import { EmployeeService } from '../service/employee.service';
import { Product } from '../../model/product/Product';
import { environment } from '../../../environments/environment';
import { Order } from 'src/app/model/order';
import { OrderDetail } from '../../model/order-detail';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { Client } from '@stomp/stompjs';


@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.page.html',
  styleUrls: ['./detail-product.page.scss'],
})
export class DetailProductPage implements OnInit {
  quantity: number = 1;
  product: Product; 
  imageUrl:string = environment.imageUrl;
  orderId:any;
  order:Order;
  user:User;
  totalcount: number;
  isPlaying: boolean = false;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  private stompClient: Client;
  isBulk: boolean | null;
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private service: EmployeeService) {
      console.log('constructorCalled');
    }

  ngOnInit() {
    console.log('onInitCalled');
    
    console.log(this.route.snapshot.params['id']);
    this.product = new Product();
    this.product.productId = this.route.snapshot.params['id'];

     this.route.params.subscribe(params => {
      console.log('params',params);
      
      this.product.productId = params['id'];
      this.orderId = params['orderId'];
      this.isBulk = params['isBulk'];
    });

    /*this.route.queryParams.subscribe(params => {
      this.employee.firstName = params["firstname"];
      this.employee.lastName = params["lastname"];
    });*/
    

    this.service.getProductByProductId(this.route.snapshot.params['id']).subscribe(data => {
      console.log('data+++++++++',data);
      console.log("data: " + Object.values(data));
      this.product = data; 
      console.log("this.product : " + this.product);
    });
  }
  redirectTo(){
    console.log("dummy");
  }

  playVideo() {
    this.isPlaying = true;
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    videoElement.play();
  }

   increase() {
    this.totalcount++;
    localStorage.setItem('totalOrdercount',String(this.totalcount))
  }

  decrease() {
    if (this.totalcount > 1) {
      this.totalcount--;
      localStorage.setItem('totalOrdercount',String(this.totalcount))
    }
  }

  addProduct(product:Product){
    this.addOrderDetail(product,'Totally order for ');
  }
  
  addOrderDetail(product:Product,msg : any,){ 
    console.log('product+++detail',product);
      let orderDetail = new OrderDetail();
      let product_id = product.productId
      let _count: number =0;
      // orderDetail.quantity = 1;
      orderDetail.quantity = product.orderDetailList && product.orderDetailList.length ? product.orderDetailList.length : 0 ;
      orderDetail.productId = product;
      orderDetail.orderId = this.order;
      orderDetail.status = "0";
      this.service.saveOrderDetail(orderDetail).subscribe(data=>{
        console.log('dat67',data);
        let orderDetailTemp = new OrderDetail();
        orderDetailTemp = data;
        if(product.orderDetailList == undefined){
          product.orderDetailList = new Array();
        }
        product.orderDetailList.push(orderDetailTemp);
      product.status_0 = product.orderDetailList.filter(od => od.status === '0').length;      
      product.status_1 = product.orderDetailList.filter(od => od.status === '1').length;
      product.status_2 = product.orderDetailList.filter(od => od.status === '2').length;
      product.status_3 = product.orderDetailList.filter(od => od.status === '3').length;
        this.service.getOrderByOrderId(this.orderId).subscribe(data=>{
          this.order = data;
          console.log('this.order+++',this.order);
          this.order.orderDetailId.forEach(data => {
            if (data.productId?.productId === product_id) {
              _count++;
          }
          }
          );
          this.presentToast(msg+_count+' ' + product.productName); 
  
        });
        this.sendMessageForOrder();
        console.log(data);
      }); 
  }

  sendMessageForOrder() { 
  const destination = "/app/send/messageFromUser-order";
  this.stompClient.publish({
    destination,
    body:  JSON.stringify({
      'name': "user",
      'toUser' : this.user.restaurantId,
      'tableId': this.user.tableId
  })
  });
  }

  async presentToast(msg:any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'custom-toast',
      position: 'top'
    });
    toast.present();
  }

  getOrderDetailWithStatusZero(product: Product): OrderDetail | null {
    if (product && Array.isArray(product.orderDetailList)) {
      return product.orderDetailList.find(od => od.status === '0') || null;
    }
    return null;
  }

  deleteOrderByProduct(product:Product){
    let orderDetail = this.getOrderDetailWithStatusZero(product);
    if(orderDetail != null){
    
      console.log(orderDetail);
      this.service.deleteOrderDetail(orderDetail).subscribe(data=>{
        console.log(data);
      });
      for(var i=0 ; i < product.orderDetailList.length; i++) {
        if(product.orderDetailList[i] == orderDetail) {
          product.orderDetailList.splice(i,1);
          break;
       }
      }
      if (product && typeof product.status_0 === 'number') {
        product.status_0--;
      }      
      this.presentToast('Totally order for '+product?.orderDetailList?.length+' ' + product.productName); 
      this.sendMessageForOrder();
    }
  }

}
