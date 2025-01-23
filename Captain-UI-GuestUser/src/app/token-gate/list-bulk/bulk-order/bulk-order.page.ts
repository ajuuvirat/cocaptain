import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmployeeService } from '../../service/employee.service';
import { Order } from 'src/app/model/order';
import { Restaurant } from 'src/app/model/restaurant';
import { OrderDetailModel } from 'src/app/model/order-detail.model';
import { OrderDetail } from 'src/app/model/order-detail';
import { Product } from 'src/app/model/product/Product';

@Component({
  selector: 'app-bulk-order',
  templateUrl: './bulk-order.page.html',
  styleUrls: ['./bulk-order.page.scss'],
})
export class BulkOrderPage implements OnInit {
  activeTab: string = 'bulk-order';
  orderList: any=[];
  imageUrl:string = environment.imageUrl;
  userDetails: any;
  orderListStatus: any;
  restaurantIdObj:Restaurant;
  hasNonVeg: boolean = false;
  hasVeg: boolean = false;
order:Order
  restaurantId: any;
  orderId:string;
  total:number=0;
  totalQuantity:number=0;
  billEnable:boolean = false;
  listArrayVo : OrderDetailModel[] = new Array();

  constructor(private service: EmployeeService) { }

  ngOnInit() {
    const orderList:any = localStorage.getItem('selectedBulkProduct');
    this.orderList = JSON.parse(orderList)
    console.log('orderList+++',this.orderList);
    const userDetails:any = localStorage.getItem('userDetails')
    this.userDetails = JSON.parse(userDetails)
    console.log('this.userDetails',this.userDetails);
    this.orderList.forEach((item:any) => {
      console.log('foreEach',item);
      this.orderListStatus = item.status_0
      this.restaurantId = item.restaurantId.id
    });
    this.groupAndSumQuantities(this.orderList);
  }

  groupAndSumQuantities(orderList: any[]) {
    let productMap = new Map<number, any>();

    orderList.forEach((orderDetail: any) => {
      const existingProduct = productMap.get(orderDetail.productId);

      if (existingProduct) {
        existingProduct.totalQuantity += orderDetail.quantity;
      } else {
        productMap.set(orderDetail.productId, {
          ...orderDetail,
          totalQuantity: orderDetail.quantity
        });
      }
    });
    this.orderList = Array.from(productMap.values());
    console.log('Updated orderList with total quantities:', this.orderList);
  }
  
  saveOrderBill(){
    let order:any = new Order(); 
    order.userId = {
        userId: this.userDetails.userId
      };
      order.status = this.orderListStatus;
      order.tableId = this.userDetails.tableId;
      order.restaurantId = {
        restaurantId: this.restaurantId
      };
    order.orderDetailId = [];    
    this.orderList.forEach((item:any) =>{   
        order.orderDetailId.push({
            productId: { productId: item.productId },
            quantity: item.quantity,
            status: item.orderDetailList[0].status
        });
    })    
    this.addTotal();
    order.totalAmount = this.total.toString();
    // this.service.createRazorpayOrder(order.totalAmount).subscribe((res: any) => {
    //     if (res && res.orderId) {
    //       const options = {
    //         key: 'YOUR_KEY_ID',
    //         amount: res.amount,
    //         currency: res.currency,
    //         name: 'Your Restaurant Name',
    //         description: 'Bulk Order Payment',
    //         image: this.imageUrl + 'your-logo.png',
    //         order_id: res.orderId,
    //         handler: function (response: any) {
    //           alert('Payment Successful');
    //           console.log(response);
    //         },
    //         prefill: {
    //           name: this.userDetails.name,
    //           email: this.userDetails.email,
    //           contact: this.userDetails.contact,
    //         },
    //         theme: {
    //           color: '#F37254',
    //         },
    //       };
    //       const razorpay = new Razorpay(options);
    //       razorpay.open();
    //     }
    //   });
    this.service.saveOrder(order).subscribe((res) =>{
console.log('res78',res);
    })
}

addTotal() {
    this.total = 0;
    this.totalQuantity = 0;
    this.billEnable = false;
    this.orderList.forEach((item: any) => {
      console.log('Checking item:', item);
      if (item && Array.isArray(item.orderDetailList)) {
        console.log('Found orderDetailList:', item.orderDetailList);
        item.orderDetailList.forEach((orderDetail: any) => {
          console.log('orderDetail:', orderDetail);
          let quantity = Number(item.quantity); 
          let price = Number(orderDetail.price);
          this.totalQuantity += quantity;
          this.total += (quantity * price);
          console.log('Current total:', this.total);
          console.log('Current totalQuantity:', this.totalQuantity);
        });
      } else {
        console.log('No orderDetailList found or it is not an array in item:', item);
      }
    });
    if (this.total > 0) {
      this.billEnable = true;
    } else {
      this.billEnable = false;
    }
  
    console.log('Final total:', this.total);
    console.log('Final totalQuantity:', this.totalQuantity);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }
  
}
