import { Component, OnDestroy, OnInit } from '@angular/core';


import { Injectable } from '@angular/core'; 
import { User } from '../../model/user'; 
import { environment } from '../../../environments/environment'; 
import { Restaurant } from '../../model/restaurant';
import { Employee } from '../../model/employee';
import { Role } from '../../model/role';
import { EmployeeService } from '../service/employee.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ActivatedRoute, NavigationEnd }  from '@angular/router';
import { Router ,Event , NavigationExtras} from '@angular/router';
import { AlertController , ToastController, LoadingController} from '@ionic/angular';
import {FormGroup, FormControl, Validators, FormBuilder,FormArray} from '@angular/forms';
import { Needs } from '../../model/needs';


import { Product } from '../../model/product/Product';
import { OrderDetail } from '../../model/order-detail';
import { OrderDetailModel } from '../../model/order-detail.model';
import { Order } from '../../model/order';

//Websocket1
// import * as Stomp from 'stompjs';
import { Stomp, Client, Frame, StompConfig } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { NeedsTableMap } from '../../model/needsTableMap';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-needs-list',
  templateUrl: './needs-list.page.html',
  styleUrls: ['./needs-list.page.scss'],
})
export class NeedsListPage implements OnInit, OnDestroy  {
  showBanner = true;
  private userForm : FormGroup;
  needsList:Needs[];
  needsListTemp:Needs[];
  needsInput:string;
  showErrorMsg=false;
  socket_server__endpoint:string = environment.socket_val;

  order:Order;
  orderId:string;
  orderDetailList:OrderDetail[] = new Array();
  productList:Product[]= new Array();
  user:User;
  needsTableMapList:NeedsTableMap[] = new Array();
  //Websocket2
  // private stompClient :Stomp.Client;
  private stompClient: Client;
  private routerSubscription: Subscription;
  restaurantTableNo: any;
  isPopupOpen = false;
  selectedProduct: any = { voiceText: '' };
  selectedLanguage: string = 'en-US';
  recognition: any;
  listening:boolean = false;
  userInput: string = '';
  transcript = '';
  loading: boolean = false;
  botOutput: string='';
  userId: any;
  chats: any[] = [];
  instructionOpen = false;
  messageStatus: string = '';

  constructor(private authService : AuthenticationService,
    private router : Router,
    private route:ActivatedRoute,
    private toastController: ToastController,
    public loadingController: LoadingController,
    private service: EmployeeService,
    private fb: FormBuilder,
     ) {
    
     
     }

  ngOnInit() {
    const data:any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data)
    console.log('Needs++++',userDetails);
    this.restaurantTableNo = userDetails.tableId
    this.userId = userDetails.userId
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url === '/home/tabs/needs-list') {
        this.showBanner = true;
      }
    });
    this.service.getNeedsList(this.restaurantTableNo).subscribe(data => {
      console.log('Needsdata',data);
      this.needsList = data;
    });

    if(this.orderId == undefined){
      this.service.currentOrderId.subscribe(
        orderId =>
      this.orderId = orderId);
    }

    this.authService.userObj.subscribe((user:any) => {
      this.user = user; 
      console.log('this.user',this.user);
      
    });
      
    this.fetchOrderDetails();
    
     
    //Websocket3
    this.connect();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  
  }

  hideBanner() {
    this.showBanner = false;
  }

  
  getNeedsTableMap(tableId:any){
    // this.service.getNeedsListTableMap().subscribe(data=>{
      this.service.getNeedsListByTableId(tableId).subscribe(data=>{
        this.needsTableMapList = data;


        for(let needsTableMap of this.needsTableMapList){
          for(let productObj of this.productList){
            let index = 0;
            if( productObj &&  productObj.dependencyId){
              for( let dep of productObj.dependencyId){
                if(dep.dependencyName == needsTableMap.needsName){
                  productObj.dependencyId.splice(index,1);
                  break;
                }
                index++;
              }
            }
         
          }
        }

        for(let needsTableMap of this.needsTableMapList){
          let index = 0;
          for(let needs of this.needsList){
            if(needs.needsName == needsTableMap.needsName){
              this.needsList.splice(index,1);
              break;
            }
            index++;          
          }
        }
      });
  }
  //Websocket4
  //old code
  /*
connect() {
  let ws = new SockJS(this.socket_server__endpoint);
  this.stompClient = Stomp.over(ws);
  let that = this;
 this.stompClient.connect({}, function () {
    that.stompClient.subscribe("/closed-userCall-from-server-to-user/"+that.user.restaurantId +"/"+ that.user.tableId , (message:any) => {
      if (message.body) {
       console.log(message.body);
       that.service.getNeedsList().subscribe(data => {
        console.log(data);
        that.needsList = data;
        that.fetchOrderDetails();
        //that.getNeedsTableMap();
       
      });
      
       that.presentToast('Here again fetch order to show KOT (order detail) status '); 
      }
    });

  }); 

}

*/

//new code connect

connect() {
  const ws = new SockJS(this.socket_server__endpoint);
    this.stompClient = new Client();

  // Set heartbeat configuration
  const heartbeatConfig = {
    outgoing: 20000, // 20 secondsn
    incoming: 0 // No incoming heartbeats
  };

  const that = this;
  let restaurantIdVal = this.user.restaurantId;
  let tableIdVal = this.user.tableId;
  let theUserId = "admin"

    // Connection and reconnect logic
    const connectCallback = (frame: Frame) => {
      console.log('Connected to the server:', frame);

    // Notify other parts of your application about the StompClient
     
      that.stompClient.subscribe("/closed-userCall-from-server-to-user/" + that.user.restaurantId + "/" + that.user.tableId, (message: any) => {
      if (message.body) {
        console.log(message.body);
       that.service.getNeedsList(this.restaurantTableNo).subscribe(data => {
        console.log(data);
        that.needsList = data;
        that.fetchOrderDetails();
       
       
      });
      
       that.presentToast('Here again fetch order to show KOT (order detail) status '); 

        // Use setTimeout for asynchronous operations
        setTimeout(() => {
          console.log('Async operation doRefresh getOrdersByStatus End');
        }, 1000);      
      
      }
    });
    that.stompClient.subscribe("/chatToUserFromServerAfterServedFood/"+ that.user.restaurantId + "/" + that.user.tableId, (message: any) => {
      if (message.body) {
        console.log(message.body);
       that.service.getNeedsList(this.restaurantTableNo).subscribe(data => {
        console.log(data);
        that.needsList = data;
        that.fetchOrderDetails();
       
       
      });
          // Use setTimeout for asynchronous operations
          setTimeout(() => {
              console.log('Async operation doRefresh getOrdersByStatus End');
          }, 1000);
    
          
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
//Calling server by user
//old code
/*sendMessageToServer() { 
  this.stompClient.send("/app/send/messageFromUser-To-Server-userCall", {}, 
  JSON.stringify({
    'name': "user",
    'toUser' : this.user.restaurantId
}));
}*/


//new code
sendMessageToServer(tableId:string) { 

  const destination = "/app/send/messageFromUser-To-Server-userCall";
   
   
  this.stompClient.publish({
    destination,
    body: JSON.stringify({
      'name': "user",
      'toUser' : this.user.tableId,
      'restaurantId' : this.user.restaurantId,
      'tableId': tableId
    })
  });
  
  }

fetchOrderDetails(){
  
  if(this.productList == undefined){
    this.productList = new Array();
  }
  this.service.getOrderByOrderId(this.orderId).subscribe(data=>{
    console.log('this.order',this.order.restaurantId.id);

    this.order = data;
    this.productList = new Array();
    this.orderDetailList = this.order.orderDetailId;
    for(let orderDetail of this.order.orderDetailId){
      if(this.productList != undefined && this.productList.length > 0){
        let isavailable = false;
        for(let productObj of this.productList){
          if(orderDetail.productId?.productId == productObj.productId){
            
            isavailable = true;
            break;
          }
        }
        if(!isavailable){
          if(orderDetail && orderDetail.productId){
            this.productList.push(orderDetail.productId);
          }
         
        }
      }else{
        if (orderDetail && orderDetail.productId) {
          this.productList.push(orderDetail.productId);
        }
        
      }
      

      
    }
    this.getNeedsTableMap(this.order.tableId);
    console.log(this.orderDetailList);
    
  });
}

  // addNeeds(value:any){
  //   console.log('this',this.order);
    
  //   console.log(value);
  //   let needsTableMap :any = {};
  //   let restaurantObj = new Restaurant();
  //   needsTableMap.tableId = this.restaurantTableNo;
  //   // restaurantObj.restaurantId = this.user.restaurantId;
  //   needsTableMap.restaurantId = this.order.restaurantId.id;
  //   needsTableMap.needsName = value;
  //   this.service.saveNeedsTableMap(needsTableMap).subscribe(data=>{
  //     console.log('data+++',data);
  //     this.getNeedsTableMap(this.user.tableId); 
  //     if (this.user.tableId) {
  //       this.sendMessageToServer(this.user.tableId);
  //   } else {
  //       console.error('tableId is undefined');
  //   }
  //   });

  //   /*
  //   this.showErrorMsg = false;
  //   let isSameValueExsit = false;
  //   for(let needs of this.needsList){
  //     if(needs.needsName == value){
  //       isSameValueExsit = true;
  //       this.showErrorMsg = true;
  //       break;
  //     }
  //   }
  //   //if false
  //   if(!isSameValueExsit){
  //     let needs = new Needs();
  //     needs.needsName = value;
  //     this.service.saveNeeds(needs).subscribe(data=>{
  //       console.log(data);
  //       this.needsList.push(data); 
  //     });
  //     this.needsInput="";
  //   } 
  //   this.needsListTemp = this.needsList;
  //   */
  // }

  addNeeds(value:any){
    console.log(value);
    let needsTableMap = new NeedsTableMap();
    needsTableMap.tableId = this.user.tableId;
    console.log('this.user.restaurantId', this.restaurantTableNo);
    // let restaurantObj = new Restaurant();
    needsTableMap.restaurantId = this.restaurantTableNo;
    console.log('this.user.restaurantId',this.restaurantTableNo);
    needsTableMap.needsName = value;
    this.service.saveNeedsTableMap(needsTableMap).subscribe(data=>{
      console.log('data+++',data);
      this.getNeedsTableMap(this.user.tableId); 
      if (this.user.tableId) {
        this.sendMessageToServer(this.user.tableId);
    } else {
        console.error('tableId is undefined');
    }
    });

    /*
    this.showErrorMsg = false;
    let isSameValueExsit = false;
    for(let needs of this.needsList){
      if(needs.needsName == value){
        isSameValueExsit = true;
        this.showErrorMsg = true;
        break;
      }
    }
    //if false
    if(!isSameValueExsit){
      let needs = new Needs();
      needs.needsName = value;
      this.service.saveNeeds(needs).subscribe(data=>{
        console.log(data);
        this.needsList.push(data); 
      });
      this.needsInput="";
    } 
    this.needsListTemp = this.needsList;
    */
  }

  deleteNeeds(needs:Needs){
    this.service.deleteNeeds(needs).subscribe(data=>{
      console.log(data);
      let index=0;
      for(let needsObj of this.needsList){
        if(needsObj.needsName == needs.needsName){
          this.needsList.splice(index,1);
        }
        index++;
      }
    });
    this.needsListTemp = this.needsList;
  }
  updateNeeds(needs:Needs){
    let name = needs.needsName;
    this.service.updateNeeds(needs).subscribe(data=>{ 
      console.log(data);
      let needsObj = new Needs();
      needsObj = data;
      this.presentToast(name + " is upated to " +needsObj.needsName + " succesfully") 
    }); 
    this.needsListTemp = this.needsList;
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

  setFilteredItems(searchTerm:any) {
    this.needsListTemp = this.filterItems(searchTerm);
  }

  filterItems(searchTerm:any) {
    return this.needsList.filter(item => {
      return (item.needsName ?? "").toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  doRefresh(event:any) {
    console.log('Begin async operation');
    this.service.getNeedsList(this.restaurantTableNo).subscribe(data => {
      console.log(data);
      this.needsList = data;
    });
    this.fetchOrderDetails();
    setTimeout(() => {
    console.log('Async operation has ended');
    event.target.complete();
    }, 1000);
  }
  
  changeLanguage() {
    this.recognition.lang = this.selectedLanguage; // Update the recognition language
    console.log(`Language changed to: ${this.selectedLanguage}`);
  }

  toggleListening(selectedProduct:any): void {
    if (this.listening) {
      // Stop recognition if currently listening
      this.recognition.stop();
      this.userInput = this.transcript;

      if (this.userInput.trim()) {
        selectedProduct.voiceText = this.userInput;
      }

      document.querySelector('textarea')?.setAttribute('placeholder', 'Press start button');
    } else {
      this.userInput = '';
      document.querySelector('textarea')?.setAttribute('placeholder', 'Listening...');
      this.recognition.start(); // Start recognition if not listening
    }
    this.listening = !this.listening;
  }

  sendVoiceMessage(): void {
    if (this.selectedProduct.voiceText.trim()) {
      this.messageStatus = 'Sending message...'; // Show sending status
      const instruction = { instruction: this.selectedProduct.voiceText };
      // Send the instruction to the API
      this.service.saveInstruction(instruction).subscribe(
        (response) => {
          console.log('Instruction saved successfully', response);
          this.messageStatus = 'Message sent successfully!'; // Show success message
          // Optionally reset the form or display the response
        },
        (error) => {
          console.error('Error saving instruction', error);
          this.messageStatus = 'Error sending message!'; // Show error message
        }
      );
    } else {
      console.error('No text or voice input to send!');
      this.messageStatus = 'Please enter some text or voice input to send.'; // Show error message if empty
    }
    this.getBotdata();
  }

  getBotdata() {
    if (!this.userInput.trim()) {
      console.error('No input to send!');
      return;
    }
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
           const utterance = new SpeechSynthesisUtterance(this.userInput);
           let voices = window.speechSynthesis.getVoices();
           utterance.voice = voices[0]; 
           window.speechSynthesis.speak(utterance);
   
           let isOrder = data.output.content.isOrder;
           console.log('isOrder :' + isOrder);
           if (isOrder) {
             let productId = data.output.content.product_id;
             let quantity = data.output.content.product_quantity;
             let selected_product = this.productList.find(
               (product) => product.productId == productId
             );
             console.log('selected_product : ' + JSON.stringify(selected_product));
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

     InstructionProcess(){
      this.instructionOpen = true;
     }

     closeInstruction() {
      this.instructionOpen = false;
    }


}
