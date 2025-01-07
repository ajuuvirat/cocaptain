import { Component, Input, OnInit } from '@angular/core';
import {  SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Injectable } from '@angular/core'; 
import { User } from '../../model/user'; 
import { environment } from '../../../environments/environment'; 
import { Restaurant } from '../../model/restaurant';

import { Role } from '../../model/role';
import { EmployeeService } from '../service/employee.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ActivatedRoute }  from '@angular/router';
import { Router ,Event , NavigationExtras} from '@angular/router';
import { AlertController , ToastController} from '@ionic/angular';
import { Product } from '../../model/product/Product';
import { OrderDetail } from '../../model/order-detail';
import { OrderDetailModel } from '../../model/order-detail.model';
import { Order } from '../../model/order';
import {NativeAudio} from '@capacitor-community/native-audio';


//Websocket1
// import * as Stomp from 'stompjs';
import { Stomp, Client, Frame, StompConfig } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
  @Input() fromSharing:any;
  hasVeg: boolean = false;
  hasNonVeg: boolean = false;
  imageUrl:string = environment.imageUrl;
  order:Order;
  user:User;
  orderId:string;
  orderDetailList:OrderDetail[] = new Array();
  total:number=0;
  totalQuantity:number=0;
  billEnable:boolean = false;
  productId: Product;
  currentStatus:number = 0;
  listArrayVo : OrderDetailModel[] = new Array();
  socket_server__endpoint:string = environment.socket_val;
  //Websocket2
  // private stompClient: Stomp.Client;
  private stompClient: Client;
  listening = false;
  tableId:number;
orderDetailId: any;
isPopupOpen = false;
recognition: any;
transcript = '';
userInput: string = '';
botOutput: string='';
loading: boolean = false;
productList: Product[] = new Array();
chats: any[] = [];
selectedProduct:any;
userId: any;
voiceMessages: any[];
instructions: string[] = [];
  instructionsList: any;
  orderTableId: any;
  restaurantId: any;
  selectedLanguage: string = 'en-US';
  totalOrderId: any;
  totalAmount: any;
  shareUserId: any;
  constructor(private service: EmployeeService,
    private authService : AuthenticationService,
    private router:Router,
    private route:ActivatedRoute,
    public alertController: AlertController,
    private toastController: ToastController,private sanitizer: DomSanitizer) { 
    this.orderId = this.route.snapshot.params['orderId'];
    this.tableId = this.route.snapshot.params['tableId'];
    console.log('this.tableId',this.tableId);
    
    if(this.orderId == undefined){
      this.service.currentOrderId.subscribe(
        orderId =>
      this.orderId = orderId);
    }
    
    this.fetchOrderDetails();
    //Websocket3
    this.connect();
    this.service.changeOrderIdValue(this.orderId);
    this.service.getOrderByOrderId(this.orderId).subscribe(data=>{
      console.log('orderdata',data);
      this.order = data;
    });
    //Websocket3
    this.connect();
    // speechSynthesis = window.speechSynthesis; //it is a entry point into using web speech api

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = this.selectedLanguage;;
      this.recognition.continuous = true;
      this.recognition.interimResults = true; // Enable interim results

      this.recognition.onresult = (event: any) => {
        this.transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            this.transcript += event.results[i][0].transcript;
          } else {
            this.transcript += event.results[i][0].transcript + ' ';
          }
        }
        this.userInput = this.transcript.trim(); 
        document
        .querySelector('textarea')
        ?.setAttribute('placeholder', this.userInput); 


        this.adjustTextareaHeight(); // Adjust textarea height

        const micTextElements = document.getElementsByName('mic-text');
        if (micTextElements.length > 0) {
            micTextElements[0].setAttribute('placeholder', this.userInput);
        }
                
      };

      
    }
    }

    //old code
//Websocket4
/*
connect() {
  let ws = new SockJS(this.socket_server__endpoint);
  this.stompClient = Stomp.over(ws);
  let that = this;
 this.stompClient.connect({}, function () {
  //not using delete this  
  that.stompClient.subscribe("/chatToUserOrder", (message) => {
      if (message.body) {
       console.log(message.body);
       that.fetchOrderDetails();
       //that.presentToast('Here again fetch order to show KOT (order detail) status '); 
      }
    });
    //not using delete this  
    that.stompClient.subscribe("/chatToAdminOrder", (message) => {
      if (message.body) {
       console.log(message.body);
       that.fetchOrderDetails();
      }
    });
  }); 

}*/

//new code
//learb below new implementation for connect webscoket

toggleListening(selectedProduct:any): void {
  // selectedProduct.productId?.productId
  console.log('aaa',selectedProduct.productId?.productId);
  
     console.log('selectedProductselectedProduct',selectedProduct);
  if (this.listening) {
    this.recognition.stop(); // Stop recognition if currently listening
    this.userInput = this.transcript; 
    if (this.userInput.trim()) {
      selectedProduct.voiceText = this.userInput;
    }
    console.log('selectedProduct.voiceText',selectedProduct.voiceText);
    
    document
    .querySelector('textarea')
    ?.setAttribute('placeholder', "press start button"); 
  } else {
    this.userInput = ""; 
    document
          .querySelector('textarea')
          ?.setAttribute('placeholder', "Listening.."); 
    this.recognition.start(); // Start recognition if not listening
  }
  this.listening = !this.listening;
  if (this.listening) {
    this.recognition.start();
  } else {
    this.recognition.stop();
  }
  selectedProduct.voiceText = this.userInput;
}

changeLanguage() {
  this.recognition.lang = this.selectedLanguage; // Update the recognition language
  console.log(`Language changed to: ${this.selectedLanguage}`);
}


ngOnDestroy() {
  if (this.recognition) {
    this.recognition.stop(); // Stop recognition when component is destroyed
  }
}


adjustTextareaHeight(): void {
  const textarea = document.querySelector('textarea');
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}

getInstructionById() {
  this.service.getInstructionById(this.orderId).subscribe(
    (response) => {
      console.log('Fetched instruction:', response);
    },
    (error) => {
      console.error('Error fetching instruction:', error);
    }
  );
}

updateInstruction(updatedData: any) {
  this.service.updateInstruction(this.orderId, updatedData).subscribe(
    (response) => {
      console.log('Instruction updated successfully:', response);
    },
    (error) => {
      console.error('Error updating instruction:', error);
    }
  );
}

deleteInstruction(id:any) {
  this.service.deleteInstruction(id).subscribe(
    (response) => {
      console.log('Instruction deleted successfully:', response);
      this.fetchOrderDetails();
    },
    (error) => {
      console.error('Error deleting instruction:', error);
    }
  );
}




send(selectedProduct:any){  
  console.log('selectedProduct',selectedProduct.productId.productId);
  
  if (!this.userInput || !this.userInput.trim()) {
    alert('Please enter a valid message');
    return;
  }

  this.loading = true; // Start loader

  // Prepare payload
  const payload = {
    productId: selectedProduct.productId.productId,
    orderId: this.orderId,
    message: this.userInput.trim(),
    restaurantId: this.restaurantId,
    tableId: this.orderTableId
  };
console.log('Payload being sent:', payload);
  // Call saveInstruction API
  this.service.saveInstruction(payload).subscribe(
    (response) => {
      console.log('Instruction saved successfully:', response);
      
      // if (this.userInput.trim()) {
      //   this.voiceMessages.push({
      //     id: selectedProduct.id,
      //     msg: this.userInput.trim()
      //   });
      // }

      // Process response
      this.botOutput = response.result; // Adjust if `result` is in response
      const utterance = new SpeechSynthesisUtterance(this.botOutput);
      speechSynthesis.speak(utterance);

      // Reset input and loader
      this.userInput = '';
      this.loading = false;
    },
    (error) => {
      console.error('Error saving instruction:', error);

      // Handle error
      alert('Failed to save instruction. Please try again.');
      this.loading = false;
    }
  );
  this.getBotdata();
}

 getBotdata() {

 // Get the text from the text area
 let text =this.userInput;

 // Create a new SpeechSynthesisUtterance object
 let utterance = new SpeechSynthesisUtterance();

 // Set the text and voice of the utterance
 utterance.text = text;
 utterance.voice = window.speechSynthesis.getVoices()[0];

 // Speak the utterance
 window.speechSynthesis.speak(utterance);

    if (!this.userInput.trim()) {
      return; // Do nothing if userInput is empty
    }
    this.loading = true; // Enable loader
    // Access this.tableNo here to use the value entered in the ion-input
    console.log(this.userInput);
    let user = {
      userId: this.userId,
      chats: '',
      message: this.userInput,
    };

    let url = 'http://localhost:8001/';
    this.service.callBot(user, url).subscribe(
      (data: any) => {
        console.log('bot data : ' + JSON.stringify(data));
        let result = data.output.content.result;
        console.log('data :' + result);
        const utterance = new SpeechSynthesisUtterance(result);
        speechSynthesis.speak(utterance);

        let isOrder = data.output.content.isOrder;
        console.log('isOrder :' + isOrder);
        if (isOrder) {
          let productId = data.output.content.product_id;
          let quantity = data.output.content.product_quantity;
          let selected_product = this.productList.find(
            (product) => product.productId == productId
          );
          console.log('selected_product : ' + JSON.stringify(selected_product));
          if (selected_product) {
            console.log('calling addProduct()');
            // call this method according to the quantity
            for (let i = 0; i < quantity; i++) {
              this.addProduct(selected_product);
            }
          } else {
            console.log(`No product found with productId ${productId}`);
          }
        }

        this.botOutput = result;
        this.userInput = '';
        this.chats.push(result);
        this.loading = false; // Disable loader
        // this.speak(this.botOutput);
      

        // if (this.botOutput) {
        //     const utterance = new SpeechSynthesisUtterance(this.botOutput);// interface gets and sets the voice that will be used to speak the utterance.
        //     speechSynthesis.speak(utterance);
        // }
      },
      (error: any) => {
        console.error('Error calling bot:', error);
        this.loading = false; // Disable loader in case of error
      }
    );
  }

  addProduct(product:Product){
    this.addOrderDetail(product,'Totally order for ');
  }

  addOrderDetail(product:Product,msg : any){ 
    console.log('product+++',product);
      let orderDetail = new OrderDetail();
      let product_id = product.productId;
      let _count: number =0;
      orderDetail.quantity = product.orderDetailList && product.orderDetailList.length ? product.orderDetailList.length : 0 ;
      // orderDetail.quantity = 1;
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
   
        
        // Update status counts based on updated orderDetailList
      product.status_0 = product.orderDetailList.filter(od => od.status === '0').length;
      product.status_1 = product.orderDetailList.filter(od => od.status === '1').length;
      product.status_2 = product.orderDetailList.filter(od => od.status === '2').length;
      product.status_3 = product.orderDetailList.filter(od => od.status === '3').length;
  
        /*if(product.quantity ==0){
          this.presentToast('Order cancelled for  ' + product.productName); 
        }else{
          this.presentToast(msg+_count+' ' + product.productName); 
        }*/
        this.service.getOrderByOrderId(this.orderId).subscribe(data=>{
          this.order = data;
          console.log('this.order+++',this.order);
          
          // data.orderDetailId[0].productId.productId
          // filter this.order list by product id
          this.order.orderDetailId.forEach(data => {
            if (data.productId?.productId === product_id) {
              _count++;
          }
          }
          );
          this.presentToast(msg+_count+' ' + product.productName); 
  
        });
        //Websocket6
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

connect() {
  const ws = new SockJS(this.socket_server__endpoint);
    this.stompClient = new Client();

  // Set heartbeat configuration
  const heartbeatConfig = {
    outgoing: 20000, // 20 secondsn
    incoming: 0 // No incoming heartbeats
  };

    const that = this;

    // Connection and reconnect logic
    const connectCallback = (frame: Frame) => {
      console.log('Connected to the server:', frame);

    // Notify other parts of your application about the StompClient


    // that.service.changeStompValue(that.stompClient);

    that.stompClient.subscribe("/chatToUserOrder", (message: any) => {
      if (message.body) {
          console.log(message.body);
          
  
          // Use setTimeout for asynchronous operations
          setTimeout(() => {
              console.log('Async operation doRefresh getOrdersByStatus End');
          }, 1000);
          that.fetchOrderDetails();
          that.playSound();
      }
  });

  that.stompClient.subscribe("/chatToAdminOrder", (message: any) => {
    if (message.body) {
        console.log(message.body);
       

        // Use setTimeout for asynchronous operations
        setTimeout(() => {
            console.log('Async operation doRefresh getOrdersByStatus End');
        }, 1000);
        that.fetchOrderDetails();
        that.playSound();
    }
});

that.stompClient.subscribe("/chatToKOT-from-user-for-Order/" + that.user.restaurantId, (message: any) => {
  if (message.body) {
    console.log(message.body);

 

    // Use setTimeout for asynchronous operations
    setTimeout(() => {
      console.log('Async operation doRefresh getOrdersByStatus End');
    }, 1000);

    that.fetchOrderDetails();
    that.playSound();
  }
});

that.stompClient.subscribe("/chatToUserFromServerAfterServedFood/"+ that.user.restaurantId + "/" + that.user.tableId, (message: any) => {
  if (message.body) {
      console.log(message.body);
      that.fetchOrderDetails();

      // Use setTimeout for asynchronous operations
      setTimeout(() => {
          console.log('Async operation doRefresh getOrdersByStatus End');
      }, 1000);

      that.playSound();
  }
}); 
   

    };

    const errorCallback = (error: Frame) => {
      console.error('STOMP error:', error);

    // Handle disconnect, e.g., log a message
    console.log('Disconnected. Attempting to reconnect............................'+
    '....................................................................................................');

      // Reconnect after a delay
      setTimeout(() => {
        that.connect(); // Re-establish the connection
      }, 5000); // Retry after 5 seconds (adjust as needed)
    };

    // Connect to the server
    this.stompClient.configure({
      webSocketFactory: () => new SockJS(this.socket_server__endpoint),
      heartbeatOutgoing: 20000, // 20 seconds
      heartbeatIncoming: 0 // No incoming heartbeats
    });

    this.stompClient.activate();

    // Explicitly connect after activation
    this.stompClient.onConnect = connectCallback;
    this.stompClient.onStompError = errorCallback;
    this.stompClient.activate();
  }



//Websocket5
sendMessageForBill() { 
  /*this.stompClient.send("/app/send/messageFromUser-getBill", {}, 
    JSON.stringify({
      'name': "user",
      'toUser' : this.user.restaurantId
  }));*/

  const destination = "/app/send/messageFromUser-getBill";
  this.stompClient.publish({
    destination,
    body: JSON.stringify({
      'name': "user",
      'toUser' : this.user.restaurantId
  })
  });
  
}

async playSound(){
  
  await NativeAudio.play({
    assetId: 'mixkit-home',
    // time: 6.0 - seek time
});
 

}

  ngOnInit() {
    const data: any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data);
    this.shareUserId = userDetails.id;
    console.log('userDetails+++', this.userId);
    this.authService.userObj.subscribe((user:User) => {
      this.user = user;
    });
    console.log("this.total ngOnInit : " + this.total);
  }

  doRefresh(event:any) {
    console.log('Begin async operation');
    this.fetchOrderDetails();
    setTimeout(() => {
    console.log('Async operation has ended');
    event.target.complete();
    }, 1000);
  }

  fetchOrderDetails(){
    /*this.service.getOrderByOrderId(this.orderId).subscribe(data=>{
      this.order = data;
      this.orderDetailList = this.order.orderDetailId;
      console.log(this.orderDetailList);
    });*/
    this.listArrayVo = [] ;
    this.service.getOrderByOrderId(this.orderId).subscribe((data:any)=>{
      console.log('9856+++', data);
      console.log('data.instructions', data.totalAmount);
    this.totalOrderId = data.orderId
    this.totalAmount = data.totalAmount

      // if (Array.isArray(data.instructions)) {
      //   data.instructions.forEach((instruction:any) => {
      //     console.log(`Message instruction`, instruction.message);
      //   });
      // } 
      this.userId = data.userId?.userId
      this.order = data;
      this.orderTableId = data.tableId
      this.restaurantId = data.restaurantId?.id
      console.log('this.restaurantId',this.restaurantId);
      
      console.log('this.orderTableId',this.orderTableId);
      
      this.orderDetailList = this.order.orderDetailId;
      this.instructionsList = data.instructions
      console.log('this.instructionsList',this.instructionsList);
      console.log('listttt',this.listArrayVo);
      console.log(this.orderDetailList);
      this.orderDetailList.forEach(detail => {
        if (detail.productId?.vegId?.vegName === 'veg') {
          this.hasVeg = true;
        } else if (detail.productId?.vegId?.vegName === 'non-veg') {
          this.hasNonVeg = true;
        }
      });
      console.log('Veg status:', this.hasVeg, 'Non-Veg status:', this.hasNonVeg);

      //bill Enable check
      if(this.order != undefined  ){
        this.currentStatus = parseInt(this.order.status); 
      }
      
      /*this.total = 0;
      for(let orderDetail of this.orderDetailList){
         let quantity = orderDetail.quantity;
         let productPrice = orderDetail.productId.productPrice;
         this.total += (quantity * productPrice);
      }*/
       
     
     for(let orderDetail of this.orderDetailList){
       

          let isProdAvailable= true;
          for (let fOrederDetail of this.listArrayVo){
            if(fOrederDetail.productId?.productId  == orderDetail.productId?.productId){
              isProdAvailable = false;
              fOrederDetail.quantity ++;
              fOrederDetail.orderDetailVo.push(orderDetail);
              break;
            }
          }
          if(isProdAvailable){
            let orderDetailVo = new OrderDetailModel();
            orderDetailVo.orderDetailId = orderDetail.orderDetailId;
            orderDetailVo.orderId = orderDetail.orderId;
            orderDetailVo.productId = orderDetail.productId;
            orderDetailVo.quantity = 1;
            orderDetailVo.status = orderDetail.status;  
            orderDetailVo.orderDetailVo.push(orderDetail);
            this.listArrayVo.push(orderDetailVo);
            
          }       
          console.log('this.listArrayVo',this.listArrayVo);
          this.listArrayVo.forEach(item =>{
            item.isSharing = true
          })
          if(this.fromSharing == 'sharing'){
         this.listArrayVo = this.listArrayVo.filter(item => item.isSharing == true);
          }
         
          // this.listArrayVo.forEach((item:any) => {
          //   // Filter all messages with matching `productId`
          //   const matchingMessages = this.instructionsList
          //     .filter((instruction:any) => instruction.productId === item.productId?.productId)
          //     .map((instruction:any) => instruction.message); // Extract only messages
          //   // Push messages array into the object
          //   item.messages = matchingMessages;
          // });
          this.listArrayVo.forEach((item: any) => {
            // Filter matching instructions for each `productId`
            const matchingInstructions = this.instructionsList
              .filter((instruction: { productId: number; instructionId: number; message: string }) => 
                instruction.productId === item.productId?.productId
              )
              .map(({ instructionId, message }: { instructionId: number; message: string }) => ({
                instructionId,
                message,
              }));
          
            // Add the array of instructions to the data object
            item.instructions = matchingInstructions;
          });

          console.log('this.listArrayVo+9586',this.listArrayVo);
          
   }
   
   this.addTotal();
  
   console.log("this.total : " + this.listArrayVo);
    });
 

  }

  orderList(){
    this.router.navigate(['/home/tabs/list',this.order.orderId]);
  }
   addTotal(){
    this.total = 0;
    this.totalQuantity=0;
    this.billEnable = false;
    for(let orderDetailModel of this.listArrayVo){
      for (let orderDetailVo of orderDetailModel.orderDetailVo){
       
     let quantity = orderDetailVo.quantity;
     this.totalQuantity += Number(quantity);;
     let productPrice = orderDetailVo.productId?.productPrice;
     this.total += (quantity * (productPrice ?? 0));
     if(this.total >  0){
      this.billEnable = true;
     }else{
      this.billEnable = false;
     }
     
      } 
  }
   }
  getBill(shareUserId:number, orderTableId: number, restaurantId: number){
    const orderId = this.totalOrderId;
    const totalAmount = this.totalAmount
    console.log('shareUserId',shareUserId);
    console.log('tableId',orderTableId);
    console.log('restaurantId',restaurantId);

    this.order.status = "2";
    this.service.updateOrder(this.order).subscribe(data => 
      { 
        this.service.changeUserStatusValue(2);
        this.billEnable = false; 
       this.presentToast('successfully requested for bill '); 
        //Websocket6
       this.sendMessageForBill();
       this.router.navigate(['/feedback']);
      });
      this.service.deleteShareByUser(shareUserId).subscribe((res:any) =>{
console.log('deleeeeee',res);

      })
      this.service.deactivateNeeds(orderTableId, restaurantId).subscribe({
        next: (res: any) => {
          console.log('Needs deactivated successfully:', res);
        },
        error: (err) => {
          console.error('Error deactivating needs:', err);
        }
      });
      this.service.saveTotalAmount(orderId, totalAmount).subscribe({
            next: (response) => {
              console.log('Total amount saved successfully:', response);
            },
            error: (error) => {
              console.error('Error saving total amount:', error);
            },
          });
  }

  // getBill(): void {
  //   const orderId = this.totalOrderId;
  //   const totalAmount = this.totalAmount
  //   this.service.saveTotalAmount(orderId, totalAmount).subscribe({
  //     next: (response) => {
  //       console.log('Total amount saved successfully:', response);
  //     },
  //     error: (error) => {
  //       console.error('Error saving total amount:', error);
  //     },
  //   });
  // }

  deleteOrder(orderDetail:OrderDetail, orderDetailModel:OrderDetailModel){
  
    console.log(orderDetail);
    this.service.deleteOrderDetail(orderDetail).subscribe(data=>{
      console.log(data);
    });
    for(var i=0 ; i < orderDetailModel.orderDetailVo.length; i++) {
      if(orderDetailModel.orderDetailVo[i] == orderDetail) {
        orderDetailModel.orderDetailVo.splice(i,1);
        orderDetailModel.quantity --;
        break;
     }
    } 
    this.addTotal();
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

  getStatus(orderDetailModel : OrderDetailModel): SafeHtml {
    if (orderDetailModel.orderDetailVo && Array.isArray(orderDetailModel.orderDetailVo)) {
      console.log('orderDetailModel:', orderDetailModel); 

      const isOrderMissing =   orderDetailModel.orderDetailVo.some(item => item.status !== undefined && item.status < '3');

      const statusMessage = isOrderMissing
      ? "<span style='color: white; background-color: #d50000; padding:6px; font-size: 10px; border-radius: 8px;'>Not Delivered</span>"
      : "<span style='color: white; background-color: #00A75A; padding: 6px; font-size: 10px; border-radius: 8px;''>Delivered</span>";

      return this.sanitizer.bypassSecurityTrustHtml(statusMessage);
    }
    return "Sorry";
  }

  openPopup(orderDetailModel:any) {
    this.isPopupOpen = true;
    this.selectedProduct = orderDetailModel
  }

  closePopup() {
    this.isPopupOpen = false;
  }
  
}
