import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EmployeeService } from '../../service/employee.service';
import { Order } from 'src/app/model/order';
import { Restaurant } from 'src/app/model/restaurant';
import { OrderDetailModel } from 'src/app/model/order-detail.model';
import { OrderDetail } from 'src/app/model/order-detail';
import { Product } from 'src/app/model/product/Product';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
declare let Razorpay: any;
@Component({
  selector: 'app-bulk-order',
  templateUrl: './bulk-order.page.html',
  styleUrls: ['./bulk-order.page.scss'],
})
export class BulkOrderPage implements OnInit {
  activeTab: string = 'bulk-order';
  selectedOrderType: string = '';
  orderList: any=[] =[];
  productQuantities: any[] = [];
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
  totalAmount: number = 0;
  restaurantName: any;
  orderDetails: Product[] = [];
  isPopupOpen = false;
  selectedProduct:any;
  selectedLanguage: string = 'en-US';
  recognition: any;
  transcript = '';
  userInput: string = '';
  listening = false;
  loading: boolean = false;
  botOutput: string='';
  productList: Product[] = new Array();
  chats: any[] = [];
  isScrolled = false;
  userId: any;


  constructor(private service: EmployeeService,private sanitizer: DomSanitizer,private router: Router) {
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

   onContentScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isScrolled = scrollTop > 0;
  }

  doRefresh(event:any) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
    console.log('Async operation has ended');
    event.target.complete();
    }, 1000);
  }

  ngOnInit() {
    const orderList:any = localStorage.getItem('selectedBulkProduct');
    this.orderList = JSON.parse(orderList);
    this.groupAndSumQuantities(this.orderList);
    console.log('orderList+++',this.orderList);
    const userDetails:any = localStorage.getItem('userDetails')
    this.userDetails = JSON.parse(userDetails)
    console.log('this.userDetails',this.userDetails);
    this.userId = this.userDetails.userId
    this.orderList.forEach((item:any) => {
      console.log('foreEach',item);
      this.orderListStatus = item.status_0
      this.restaurantId = item.restaurantId.restaurantId
      this.restaurantName = item.restaurantId.restaurantName
      console.log('this.restaurantId',this.restaurantId);
    });
    this.total = this.orderList.reduce((accumulator:any, currentItem:any) => accumulator + currentItem.totalPrice, 0);
    this.totalQuantity = this.orderList.length
  }
  

  groupAndSumQuantities(orderList: any[]) {
    let productMap = new Map<number, any>();
  
    orderList.forEach((orderDetail: any) => {
      // Convert quantity and productPrice to numbers
      const quantity = Number(orderDetail.quantity);
      const productPrice = Number(orderDetail.productPrice);
  
      const existingProduct = productMap.get(orderDetail.productId);
      
      if (existingProduct) {
        // Update total quantity and total price for the existing product
        existingProduct.totalQuantity += quantity;
        existingProduct.totalPrice += quantity * productPrice;
      } else {
        // Add new product to the map
        productMap.set(orderDetail.productId, {
          ...orderDetail,
          totalQuantity: quantity,
          totalPrice: quantity * productPrice,
        });
      }
    });
  
    // Convert map values to an array and assign back to orderList
    this.orderList = Array.from(productMap.values());
    console.log('Updated orderList with total quantities and prices:', this.orderList);
  }
  
  
  
  saveOrderBill(data?:any){
    let order:any = new Order(); 
    order.userId = {
        userId: this.userDetails.userId
      };
      order.status = 2;
      order.tableId = this.userDetails.tableId;
      order.restaurantId = {
        restaurantId: this.restaurantId
      };
      order.takeaway = true; 
    order.orderDetailId = [];    
    this.orderList.forEach((item:any) =>{   
        order.orderDetailId.push({
            productId: { productId: item.productId },
            quantity: item.orderDetailList && item.orderDetailList.length ? item.orderDetailList.length : 0,
            status: 3
        });
    });
    this.addTotal();
    order.totalAmount = this.total.toString();
    if(data == 'payment'){
      console.log('ifffff');
    if (this.total > 0) {
      this.initiateRazorpayPayment(this.total); 
      this.service.saveOrder(order).subscribe((res) =>{
        console.log('orderIDresponse',res);
        localStorage.setItem('paymentOrderID',res.orderId)
        console.log('selectedBulkProduct removed from localStorage');
        localStorage.removeItem('selectedBulkProduct')
     })
    }
  }else{
    console.log('else');
    if (this.total > 0) {
      this.service.saveOrder(order).subscribe((res) =>{
        console.log('orderIDresponse',res);
        localStorage.setItem('paymentOrderID',res.orderId)
        this.router.navigate(['/takeorder']);
        console.log('selectedBulkProduct removed from localStorage');
        localStorage.removeItem('selectedBulkProduct');

     })
    }
  }
}

// saveOrderBill(data?: any) {
//   let order: any = new Order();
//   order.userId = { userId: this.userDetails.userId };
//   order.status = this.orderListStatus;
//   order.tableId = this.userDetails.tableId;
//   order.restaurantId = { restaurantId: this.restaurantId };
//   order.takeaway = true; 
//   order.orderDetailId = [];    

//   this.orderList.forEach((item: any) => {
//     order.orderDetailId.push({
//       productId: { productId: item.productId },
//       quantity: item.quantity,
//       status: item.orderDetailList[0].status
//     });
//   });

//   this.addTotal();
//   order.totalAmount = this.total.toString();

//   if (data == 'payment') {
//     // Initiate Razorpay Payment
//     if (this.total > 0) {
//       this.initiateRazorpayPayment(this.total);
      
//       // Call saveOrder only after payment initiation
//       this.service.saveOrder(order).subscribe((res) => {
//         console.log('orderIDresponse', res);
        
//         // Remove selectedBulkProduct from localStorage after saving the order
//         // localStorage.removeItem('selectedBulkProduct');
//       });
//     }
//   } else {
//     // For other cases, you can save the order directly without Razorpay
//     this.service.saveOrder(order).subscribe((res) => {
//       console.log('Order saved without payment', res);
//       // localStorage.removeItem('selectedBulkProduct');
//     });
//   }
// }




addTotal() {
  this.total = 0;
  this.totalQuantity = 0;
  this.billEnable = false;

  this.orderList.forEach((item: any) => {
    // Ensure we're working with numbers
    const quantity = Number(item.totalQuantity);
    const totalPrice = Number(item.totalPrice);

    // Add to total values
    this.totalQuantity += quantity;
    this.total += totalPrice;

    console.log(`Product ID: ${item.productId}, Quantity: ${quantity}, Total Price: ${totalPrice}`);
  });

  // Set total amount and enable the bill if total > 0
  this.totalAmount = this.total;
  this.billEnable = this.total > 0;

  console.log('Final total:', this.total);
  console.log('Final totalQuantity:', this.totalQuantity);
}

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  initiateRazorpayPayment(amount: number) {
    const options = {
        key: 'rzp_test_hrzZK5baYjPC1g',
        amount: amount * 100, 
        currency: 'INR',
        name: this.restaurantName,
        description: 'Payment for Order',
        image: 'https://your-website.com/your-logo.png',
        handler: function (response: any) {
            console.log('response',response);
            localStorage.setItem('paymentOrderID',response.orderId)
            alert('Payment Successful');
           
        },
        prefill: {
            name: this.userDetails.name,
            email: this.userDetails.email,
            contact: this.userDetails.contact
        },
        notes: {
            address: 'Your Restaurant Address'
        },
        theme: {
            color: '#F37254'
        }
    };
    this.router.navigate(['/takeorder']);
    const rzp1 = new Razorpay(options);
    rzp1.open(); 
}


openPopup(orderDetailModel:any) {
  this.isPopupOpen = true;
  this.selectedProduct = orderDetailModel
}

closePopup() {
  this.isPopupOpen = false;
}

changeLanguage() {
  this.recognition.lang = this.selectedLanguage; // Update the recognition language
  console.log(`Language changed to: ${this.selectedLanguage}`);
}

adjustTextareaHeight(): void {
  const textarea = document.querySelector('textarea');
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}

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

deleteInstruction(id:any) {
  this.service.deleteInstruction(id).subscribe(
    (response) => {
      console.log('Instruction deleted successfully:', response);
      // this.fetchOrderDetails();
    },
    (error) => {
      console.error('Error deleting instruction:', error);
    }
  );
}

// send(selectedProduct:any){  
//   console.log('selectedProduct',selectedProduct.productId.productId);
//   if (!this.userInput || !this.userInput.trim()) {
//     alert('Please enter a valid message');
//     return;
//   }

//   this.loading = true;
//   const payload = {
//     productId: selectedProduct.productId,
//     orderId: this.orderId,
//     message: this.userInput.trim(),
//     restaurantId: this.userDetails.restaurantId,
//     tableId: this.userDetails.tableId
//   };
// console.log('Payload being sent:', payload);
//   this.service.getMultiInstruction(payload).subscribe(
//     (response) => {
//       console.log('Instruction saved successfully:', response);
//       this.botOutput = response.result; 
//       const utterance = new SpeechSynthesisUtterance(this.botOutput);
//       speechSynthesis.speak(utterance);
//       this.userInput = '';
//       this.loading = false;
//     },
//     (error) => {
//       console.error('Error saving instruction:', error);
//       alert('Failed to save instruction. Please try again.');
//       this.loading = false;
//     }
//   );
//   this.getBotdata();
// }

send(selectedProduct: any) {
  console.log('selectedProduct', selectedProduct.productId.productId);

  if (!this.userInput || !this.userInput.trim()) {
    alert('Please enter a valid message');
    return;
  }

  this.loading = true; // Start loader

  // Construct the instruction part of the payload dynamicall

  // Construct the order part of the payload
  const orderPayload = {
    orderDetailId: [
      {
        productId: { productId: selectedProduct.productId },
        quantity: selectedProduct.orderDetailList && selectedProduct.orderDetailList.length ? selectedProduct.orderDetailList.length : 0,
        status: 3,
      },
    ],
    userId:{ userId:this.userId},
    status: 2,
    tableId: this.userDetails.tableId,
    restaurantId:{ restaurantId: this.userDetails.restaurantId },
    takeaway: false,
    totalAmount: this.total,
  };
  const instructionPayload = {
    productId: selectedProduct.productId.productId, 
    initiatedUserId: 184, 
    accepted: false, 
    message: this.userInput.trim(),
    createdtimestamp: new Date().toISOString(), 
  };

  // Complete payload with both order and instruction
  const payload = {
    order: orderPayload,
    instruction: [instructionPayload],  // Add the dynamic instruction to the payload
  };

  console.log('Payload being sent:', payload);

  this.service.getMultiInstruction(payload).subscribe(
    (response) => {
      console.log('Instruction saved successfully:', response);
      this.botOutput = response.result;
      const utterance = new SpeechSynthesisUtterance(this.botOutput);
      speechSynthesis.speak(utterance);
      this.userInput = '';
      this.loading = false;
    },
    (error) => {
      console.error('Error saving instruction:', error);
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
       userId: this.userDetails.userId,
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
            //  this.presentToast(msg+_count+' ' + product.productName); 
     
           });
           //Websocket6
          //  this.sendMessageForOrder();
           console.log(data);
         }); 
     }

  // getStatus(orderDetailModel: OrderDetailModel): SafeHtml {
  //   if (orderDetailModel.orderDetailList && Array.isArray(orderDetailModel.orderDetailList)) {
  //     const isOrderMissing = orderDetailModel.orderDetailList.some(item => item.status !== undefined && parseInt(item.status) < 3);
  //     const statusMessage = isOrderMissing
  //       ? "<span style='color: white; background-color: #d50000; padding:6px; font-size: 10px; border-radius: 8px;'>Not Delivered</span>"
  //       : "<span style='color: white; background-color: #00A75A; padding: 6px; font-size: 10px; border-radius: 8px;'>Delivered</span>";
  //     return this.sanitizer.bypassSecurityTrustHtml(statusMessage);
  //   }
  //   return this.sanitizer.bypassSecurityTrustHtml("<span style='color: white; background-color: #ff9800; padding:6px; font-size: 10px; border-radius: 8px;'>No Details Available</span>");
  // }
  
}
