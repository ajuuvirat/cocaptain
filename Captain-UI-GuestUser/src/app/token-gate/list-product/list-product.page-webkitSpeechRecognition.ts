import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Injectable } from '@angular/core';
import { User } from '../../model/user';
import { environment } from '../../../environments/environment';
import { Restaurant } from '../../model/restaurant';

import { Role } from '../../model/role';
import { EmployeeService } from '../service/employee.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Router, Event, NavigationExtras } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Product } from '../../model/product/Product';
import { OrderDetail } from '../../model/order-detail';
import { Order } from '../../model/order';
import { Swiper } from 'swiper';
import { LoadingController } from '@ionic/angular';
//Websocket1
// import * as Stomp from 'stompjs';
// import * as SockJS from 'sockjs-client';

// import { Stomp, Client, Frame } from '@stomp/stompjs';
import { Stomp, Client, Frame, StompConfig } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.page.html',
  styleUrls: ['./list-product.page.scss'],
})
export class ListProductPage implements OnInit {
  messages = {
    start: {
      msg: 'Click on the microphone icon and begin speaking.',
      class: 'alert-success',
    },
    speak_now: {
      msg: 'Speak now.',
      class: 'alert-success',
    },
    no_speech: {
      msg: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
      class: 'alert-danger',
    },
    no_microphone: {
      msg: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
      class: 'alert-danger',
    },
    allow: {
      msg: 'Click the "Allow" button above to enable your microphone.',
      class: 'alert-warning',
    },
    denied: {
      msg: 'Permission to use microphone was denied.',
      class: 'alert-danger',
    },
    blocked: {
      msg: 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone',
      class: 'alert-danger',
    },
    upgrade: {
      msg: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
      class: 'alert-danger',
    },
    stop: {
      msg: 'Stop listening, click on the microphone icon to restart',
      class: 'alert-success',
    },
    copy: {
      msg: 'Content copy to clipboard successfully.',
      class: 'alert-success',
    },
  };

  final_transcript = '';
  recognizing = false;
  ignore_onend: any;
  start_timestamp: any;
  recognition: any;
  isMicClick:boolean = false;

 
  @ViewChild('finalSpan') finalSpan: any;
  @ViewChild('interimSpan') interimSpan: any;
  @ViewChild('startImg') startImg: any;
  @ViewChild('info') info: any;
  @ViewChild('selectLanguage') selectLanguage: any;
  @ViewChild('startButton') startButton!: ElementRef;

 
  imageUrl: string = environment.imageUrl;
  productList: Product[] = new Array();
  product: Product;
  user: User;
  isRestaurantAdmin = false;
  breakpoint: number;
  orderId: string;
  tableId: string;
  order: Order;
  socket_val: string = environment.socket_val;
  alertMessage:string;
  alertClass:string;
  // recognition: any;
  listening = false;

  userInput: string = '';
  chats: any[] = [];
  botOutput: string = '';
  loading: boolean = false; // Loading indicator

  //Websocket2
  private stompClient: Client;

  constructor(
    private service: EmployeeService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private renderer: Renderer2
  ) {
    this.orderId = this.route.snapshot.params['orderId'];
    this.tableId = this.route.snapshot.params['tableId'];
    this.service.changeOrderIdValue(this.orderId);
    this.service.getOrderByOrderId(this.orderId).subscribe((data) => {
      this.order = data;
    });
    //Websocket3
    this.connect();
    this.webSpeech();
    /*
      if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
        this.recognition = new (window as any).webkitSpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = true;
        this.recognition.interimdatas = true; // Enable interim datas
  
        this.recognition.ondata = (event: any) => {
          let transcript = '';
          for (let i = event.dataIndex; i < event.datas.length; i++) {
            if (event.datas[i].isFinal) {
              transcript += event.datas[i][0].transcript;
            } else {
              transcript += event.datas[i][0].transcript + ' ';
            }
          }
          this.userInput = transcript.trim();  
        };
  
        // this.recognition.start(); // Start recognition
      }
*/
  }

  clearSearch(): void {
    // Clear search logic here
  }
  first_char: RegExp = /^./;
  capitalize(s: string): string {
    return s.replace(this.first_char, (m) => m.toUpperCase());
  }
  twoLine: RegExp = /\n\n/g;
  oneLine: RegExp = /\n/g;

  linebreak(s: string): string {
    return s.replace(this.twoLine, '<p></p>').replace(this.oneLine, '<br>');
  }
  webSpeech() {
    if (!('webkitSpeechRecognition' in window)) {
      this.showInfo('upgrade');
    } else {
      this.showInfo('start');
      // this.startButton.nativeElement.style.display = 'inline-block';
      // this.renderer.setStyle(this.startButton.nativeElement, 'display', 'inline-block');
      // this.recognition = new webkitSpeechRecognition();
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.recognizing = true;
        this.showInfo('speak_now');
        
    
        this.isMicClick = true;
      };

      this.recognition.onerror = (event: any) => {
        if (event.error == 'no-speech') {
        
          this.isMicClick = false;
          this.showInfo('no_speech');
          this.ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          
          this.isMicClick = false;
          this.showInfo('no_microphone');
          this.ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - this.start_timestamp < 100) {
            this.showInfo('blocked');
          } else {
            this.showInfo('denied');
          }
          this.ignore_onend = true;
        }
      };

      this.recognition.onend = () => {
        this.isMicClick = false;
        this.recognizing = false;
        if (this.ignore_onend) {
          return;
        }
         
        
        if (!this.final_transcript) {
          this.showInfo('start');
          return;
        }
        this.showInfo('stop');
        let s = document.getElementById('final_span');
        console.log(s?.outerText);
        // this.final_transcript = s?.outerText;
      };

      this.recognition.onresult = (event: any) => {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        this.final_transcript = this.capitalize(this.final_transcript);
        this.finalSpan.nativeElement.innerHTML = this.linebreak(
          this.final_transcript
        );
        this.interimSpan.nativeElement.innerHTML =
          this.linebreak(interim_transcript);
      };
    }
  }

  startRecognition(): void {
    if (this.recognizing) {
      this.recognition.stop();
      return;
    }
    this.final_transcript = '';
    this.recognition.lang = 'en-US';
    this.recognition.start();
    this.ignore_onend = false;
    this.finalSpan.nativeElement.innerHTML = '';
    this.interimSpan.nativeElement.innerHTML = '';
    
    this.showInfo('allow');
  }

  showInfo(s: string): void {
    if (s) {
      const message = this.messages[s as keyof typeof this.messages];
     this.alertMessage = message.msg;
     this.alertClass = message.class;
    }
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop(); // Stop recognition when component is destroyed
    }
  }
  ngOnInit() {
  
    this.fetchAllProductWithUser();
  }

  connect() {
    const ws = new SockJS(this.socket_val);
    this.stompClient = new Client();

    // Set heartbeat configuration
    // this.stompClient.heartbeat.outgoing = 20000; // 20 seconds
    // this.stompClient.heartbeat.incoming = 0; // No incoming heartbeats

    const that = this;

    // Connection and reconnect logic
    const connectCallback = (frame: Frame) => {
      console.log('Connected to the server:', frame);
      that.stompClient.subscribe(
        '/chatToUserFromKOT/' +
          that.user.restaurantId +
          '/' +
          that.user.tableId,
        (message: any) => {
          if (message.body) {
            console.log(message.body);
            that.fetchAllProductWithUser();
          }
        }
      );

      that.stompClient.subscribe(
        '/chatToUserFromServerAfterServedFood/' +
          that.user.restaurantId +
          '/' +
          that.user.tableId,
        (message: any) => {
          if (message.body) {
            console.log(message.body);
            that.fetchAllProductWithUser();
          }
        }
      );
    };

    const errorCallback = (error: Frame) => {
      console.error('STOMP error:', error);

      // Handle disconnect, e.g., log a message
      console.log('Disconnected. Attempting to reconnect...');

      // Reconnect after a delay
      setTimeout(() => {
        that.connect(); // Re-establish the connection
      }, 5000); // Retry after 5 seconds (adjust as needed)
    };

    // Connect to the server
    this.stompClient.configure({
      webSocketFactory: () => new SockJS(this.socket_val),
      heartbeatOutgoing: 20000, // 20 seconds
      heartbeatIncoming: 0, // No incoming heartbeats
    });

    this.stompClient.activate();

    // Explicitly connect after activation
    this.stompClient.onConnect = connectCallback;
    this.stompClient.onStompError = errorCallback;
    this.stompClient.activate();
  }

  /*
  //Websocket4
connect() {
  let ws = new SockJS(this.socket_val);
  this.stompClient = Stomp.over(ws);
  let that = this;

  // Set heartbeat configuration
  this.stompClient.heartbeat.outgoing = 20000; // 20 seconds
  this.stompClient.heartbeat.incoming = 0; // No incoming heartbeats

  const errorCallback = (error: Frame) => {
    console.error('STOMP error:', error);

    // Handle disconnect, e.g., log a message
    console.log('Disconnected. Attempting to reconnect...');

    // Reconnect after a delay
    setTimeout(() => {
      that.connect(); // Re-establish the connection
    }, 5000); // Retry after 5 seconds (adjust as needed)
  };

 this.stompClient.connect({}, function () {
    that.stompClient.subscribe("/chatToUserFromKOT/"+that.user.restaurantId +"/"+ that.user.tableId , (message:any) => {
      if (message.body) {
       console.log(message.body);
       that.fetchAllProductWithUser(); 
      }
    });
    that.stompClient.subscribe("/chatToUserFromServerAfterServedFood/"+that.user.restaurantId +"/"+ that.user.tableId  , (message:any) => {
      if (message.body) {
       console.log(message.body);
       that.fetchAllProductWithUser(); 
      }
    });
  }); 

 


}*/
  //Websocket5
  sendMessageForOrder() {
    /*this.stompClient.send("/app/send/messageFromUser-order", {}, 
  JSON.stringify({
    'name': "user",
    'toUser' : this.user.restaurantId
}));*/
    const destination = '/app/send/messageFromUser-order';
    this.stompClient.publish({
      destination,
      body: JSON.stringify({
        name: 'user',
        toUser: this.user.restaurantId,
        tableId: this.user.tableId,
      }),
    });
  }

  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'custom-toast',
      position: 'top'
    });
    toast.present();
  }

  fetchAllProductWithUser() {
    this.authService.userObj.subscribe((user: any) => {
      this.user = user;
      if (this.user.role == 'RestaurantAdmin') {
        this.isRestaurantAdmin = true;
      }
      this.fetchProductList();
    });
  }

  fetchProductList() {
    /*this.service.getProductList().subscribe( (productList) => { 
    console.log("productList");
    console.log(JSON.stringify(productList));
    this.productList = new Array<Product>()
    this.productList.push(...productList);  
  });*/

    this.service
      .getProductListByRestaurantId(this.user.restaurantId)
      .subscribe((productList) => {
        console.log('productList');
        console.log(JSON.stringify(productList));
        this.productList = new Array<Product>();
        this.productList.push(...productList);
        this.service.getOrderByOrderId(this.orderId).subscribe((data) => {
          this.order = data;

          for (let orderDetailId of this.order.orderDetailId) {
            for (let product of this.productList) {
              if (product.orderDetailList == undefined) {
                product.orderDetailList = new Array();
              }
              if (
                orderDetailId &&
                orderDetailId.productId &&
                product.productId == orderDetailId.productId.productId
              ) {
                product.quantity = orderDetailId.quantity;
                product.orderDetailList.push(orderDetailId);
              }
            }
          }
        });
      });
  }

  productDetail(product: Product) {
    this.product = product;
    console.log('this.product : ' + this.product);
    this.router.navigate([
      '/home/tabs/details/',
      this.order.orderId,
      this.product.productId,
    ]);
  }

  doRefresh(event: any) {
    console.log('Begin async operation');
    this.fetchProductList();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

  onChangeAvailability(product: Product, event: any) {
    this.service.updateProduct(product).subscribe(
      (data) => {
        console.log(data);
        this.presentToast(
          'successfully updated product - ' + product.productName
        );
      },
      (error) => {
        console.log('Error in updating product', error);
        this.presentToast('Error in updating product');
      }
    );
  }

  addProduct(product: Product) {
    //product.quantity = product.quantity+1;
    if (product && product.quantity) {
      product.quantity++;
    }

    this.addOrderDetail(product, 'order for ');
  }

  deleteOrder(orderDetail: OrderDetail, product: Product) {
    console.log(orderDetail);
    this.service.deleteOrderDetail(orderDetail).subscribe((data) => {
      console.log(data);
    });
    for (var i = 0; i < product.orderDetailList.length; i++) {
      if (product.orderDetailList[i] == orderDetail) {
        product.orderDetailList.splice(i, 1);
        break;
      }
    }
    this.sendMessageForOrder();
  }
  navigateToOrderList() {
    this.router.navigate([
      '/home/tabs/order-list',
      this.order.orderId,
      this.tableId,
    ]);
  }
  addOrderDetail(product: Product, msg: any) {
    let orderDetail = new OrderDetail();
    //orderDetail.quantity = product.quantity;
    orderDetail.quantity = 1;
    orderDetail.productId = product;
    orderDetail.orderId = this.order;
    orderDetail.status = '0';
    this.service.saveOrderDetail(orderDetail).subscribe((data) => {
      let orderDetailTemp = new OrderDetail();
      orderDetailTemp = data;
      if (product.orderDetailList == undefined) {
        product.orderDetailList = new Array();
      }
      product.orderDetailList.push(orderDetailTemp);
      if (product.quantity == 0) {
        this.presentToast('Order cancelled for  ' + product.productName);
      } else {
        this.presentToast(msg + product.quantity + ' ' + product.productName);
      }
      this.service.getOrderByOrderId(this.orderId).subscribe((data) => {
        this.order = data;
      });
      //Websocket6
      this.sendMessageForOrder();
      console.log(data);
    });
  }

  handleInputChange(event: CustomEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    console.log('Input changed:', inputValue);
    this.getBotdata();

    // Add your custom logic here
  }

  send() {
    this.getBotdata();
  }

  getBotdata() {
    if (!this.userInput.trim()) {
      return; // Do nothing if userInput is empty
    }
    this.loading = true; // Enable loader
    // Access this.tableNo here to use the value entered in the ion-input
    console.log(this.userInput);
    let user = {
      userId: 'userId',
      chats: '',
      message: this.userInput,
    };

    let url = 'http://localhost:8001/';
    this.service.callBot(user, url).subscribe(
      (data: any) => {
        console.log('bot data : ' + JSON.stringify(data));
        let result = data.output.content.result;
        console.log('data :' + result);

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
      },
      (error: any) => {
        console.error('Error calling bot:', error);
        this.loading = false; // Disable loader in case of error
      }
    );
  }

  toggleListening(): void {
    if (this.listening) {
      this.recognition.stop(); // Stop recognition if currently listening
    } else {
      this.recognition.start(); // Start recognition if not listening
    }
    this.listening = !this.listening;
  }
  placeOrderById(productId: any) {
    console.log('i am in placeOrderById , productId : ' + productId);
    return this.productList.find((product) => product.productId === productId);
  }
}
