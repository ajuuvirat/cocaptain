import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  @ViewChild('instructionsTemplate', { static: true }) instructionsTemplate: TemplateRef<any>;
  showInstructions = false;
  isActive = false;
  selectedCategory: string = 'All';
  isScrolled = false;
  userId: string = '';
  isVegMode: boolean = false;
  productPairs: Product[][] = [];
  scrolled = false;
  dynamicMessage = 'Would you like to share food?';
  dynamicContent = 'You can share your food with others if you wish.';
  buttonLabel = 'Sharing';
  imageUrl:string = environment.imageUrl;
  productList: Product[] = new Array();
  filteredProducts : Product[] = new Array();
  searchTerm: string = '';
  product: Product;
  user:User;
  isRestaurantAdmin = false;
  breakpoint:number;
  orderId:string;
  tableId:string;
  order:Order;
  isPopupOpen = false;
  uniqueCategoryNames: string[] = [];
  socket_val:string = environment.socket_val;
  extraOptions = [
    { name: 'Extra Ghee', selected: false },
    { name: 'Extra Spices', selected: false },
    { name: 'Extra Mayonnaise', selected: false },
    { name: 'Extra Ketchup', selected: false },
    { name: 'Extra Pepper and Salt', selected: false },
  ];
  //Websocket2
  private stompClient: Client;
  // showButton: boolean = false;
  transcript = '';
   speechSynthesis:any;
  selectedProduct: any;
  initiatedUserId: any;
  productNames: string[] = [];
  restaurantLogoImageName: string | null;
  restaurantId: string | undefined;
  constructor(private service: EmployeeService,
    private authService : AuthenticationService,
    private router:Router,
    private route:ActivatedRoute,
    public alertController: AlertController,
    private toastController: ToastController,
  private loadingController: LoadingController) { 
    this.orderId = this.route.snapshot.params['orderId'];
    this.tableId = this.route.snapshot.params['tableId'];
    this.service.changeOrderIdValue(this.orderId);
      this.service.getOrderByOrderId(this.orderId).subscribe(data=>{
        this.order = data;
      });
      //Websocket3
      this.connect();
      // speechSynthesis = window.speechSynthesis; //it is a entry point into using web speech api

      if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
        this.recognition = new (window as any).webkitSpeechRecognition();
        this.recognition.lang = 'en-US';
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

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const header = document.querySelector('.header');
      if (header) {
        // Check if the scroll position is greater than 0
        if (window.pageYOffset > 0) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    }
    
    openInstructions() {
      this.showInstructions = true;
    }

    closeInstructions() {
      this.showInstructions = false;  // Close the modal
    }
    
    activate(product:any) {
      console.log('Before activation, product accepted:', product.accepted);
      if (!product.accepted) {
        // Save if it's not yet shared
        const payload = {
          productId: product.productId,
          initiatedUserId: this.initiatedUserId, // Replace with dynamic user ID
          accepted: false,
          restaurantId: this.restaurantId
        };
  
        this.service.saveSharedProduct(payload).subscribe(
          (response) => {
            console.log('Share saved successfully', response);
            product.accepted = false;
            console.log('After saving share, product accepted:', product.accepted);
            this.closeInstructions();
          },
          (error) => console.error('Error saving share:', error)
        );
      } else {
        // Update if it's already shared
        const payload = {
          productId: product.productId,
          acceptedUserId: 222, // Replace with dynamic user ID
          accepted: true,
          updatetimestamp: new Date().toISOString(),
        };
  
        this.service.updateSharedProduct(payload).subscribe(
          (response) => {
            console.log('Share updated successfully', response);
            product.accepted = true;
            console.log('After updating share, product accepted:', product.accepted);
            this.closeInstructions();
          },
          (error) => console.error('Error updating share:', error)
        );
      }
      console.log('productActive',product);
      this.isActive = true;  
      product.buttonLabel = 'Deactivate';  
      this.closeInstructions(); 
    }

    cancel() {
      console.log('Cancelled');
      this.closeInstructions();
    }

    toggleInstructions(product:any) {
        this.showInstructions = true;
        product.buttonLabel = 'Sharing';  
        console.log('productToogle',product);
      this.selectedProduct = product
    }

    onToggleChange() {
      this.filterProducts();
    }

    // openPopup() {
    //   this.isPopupOpen = true;
    // }
  
    // closePopup() {
    //   this.isPopupOpen = false;
    // }

    onOptionChange(option: any) {
      console.log(`${option.name} selected: ${option.selected}`);
    }

    onContentScroll(event: any) {
      const scrollTop = event.detail.scrollTop;
      this.isScrolled = scrollTop > 0; // Change color when scrolled down
    }

    selectItem(item: string): void {
      if (this.selectedCategory === item) {
        this.selectedCategory = 'All'; // Toggle to 'All' if clicked again
      } else {
        this.selectedCategory = item; // Set the selected category
      }
    
      // Call the filterProducts function to update the product list
      this.filterProducts();
    }
  
    clearSelection(event: MouseEvent): void {
      event.stopPropagation(); // Prevent the click from bubbling up to the button
      this.selectedCategory = 'All'; // Reset to 'All'
      this.filterProducts();
    }

  getStatusCounts(product:Product): any {
    const statusCounts = { status0: 0, status1: 0, status2: 0, status3: 0 };
    if (product.orderDetailList) {
      product.orderDetailList.forEach(order => {
        if (order.status == '0') {
          statusCounts.status0++;
        }else if (order.status == '1') {
          statusCounts.status1++;
        } else if (order.status == '2') {
          statusCounts.status2++;
        } else if (order.status == '3') {
          statusCounts.status3++;
        }
      });
    }
   
    return statusCounts;
  }
    toggleListening(): void {
     
      if (this.listening) {
        this.recognition.stop(); // Stop recognition if currently listening
        this.userInput = this.transcript; 
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
    }

    adjustTextareaHeight(): void {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    }

  ngOnInit() {
    this.restaurantLogoImageName = localStorage.getItem('restaurantLogoImageName');
    console.log('this.restaurantLogoImageName',this.restaurantLogoImageName);
    this.fetchAllProductWithUser();
    this.selectedCategory = 'All';
    this.filterProducts(); 
  }
  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop(); // Stop recognition when component is destroyed
    }
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
      that.stompClient.subscribe("/chatToUserFromKOT/" + that.user.restaurantId + "/" + that.user.tableId, (message: any) => {
        if (message.body) {
          console.log(message.body);
          that.fetchAllProductWithUser();
        }
      });

      that.stompClient.subscribe("/chatToUserFromServerAfterServedFood/" + that.user.restaurantId + "/" + that.user.tableId, (message: any) => {
        if (message.body) {
          console.log(message.body);
          that.fetchAllProductWithUser();
        }
      });
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
      heartbeatIncoming: 0 // No incoming heartbeats
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
 
fetchAllProductWithUser(){
  const data:any = localStorage.getItem('userDetails');
  const userDetails = JSON.parse(data)
  console.log('userDetails++++',userDetails);
  this.initiatedUserId = userDetails.id
  // this.authService.userObj.subscribe((user:any) => {
    this.user = userDetails;
    if(this.user.role == 'RestaurantAdmin'){
      this.isRestaurantAdmin = true;
    }
    this.userId = userDetails.userId;
    this.tableId = userDetails.tableId;
    this.fetchProductList();
  // });
  
  
}
// filterProducts() {
//   const searchTermLower = this.searchTerm.toLowerCase().trim();
//   this.filteredProducts = this.productList.filter(product =>
//     product?.productName?.toLowerCase().includes(searchTermLower)
//   );
//   console.log('Product Names++: ', this.filteredProducts.map(product => product.productName));
// }


filterProducts(): void {
  const searchTermLower = this.searchTerm.toLowerCase().trim();
  
  this.filteredProducts = this.productList.filter(product => {
    const matchesCategory = this.selectedCategory === 'All' || product.categoryId?.categoryName === this.selectedCategory;
    const matchesSearchTerm = product?.productName?.toLowerCase().includes(searchTermLower);
    return matchesCategory && matchesSearchTerm;
  });

  console.log('Filtered Products:', this.filteredProducts.map(product => product.productName));
}

// filterProducts(): void {
//   const searchTermLower = this.searchTerm.toLowerCase().trim();

//   this.filteredProducts = this.productList.filter(product => {
//     const matchesCategory = this.selectedCategory === 'All' || product.categoryId?.categoryName === this.selectedCategory;
//     const matchesSearchTerm = product?.productName?.toLowerCase().includes(searchTermLower);
//     const matchesVegMode = this.isVegMode ? product.vegId?.vegName : !product.vegId?.vegName; // Filter by Veg/Non-Veg mode

//     return matchesCategory && matchesSearchTerm && matchesVegMode;
//   });

//   console.log('Filtered Products:', this.filteredProducts.map(product => product.productName));
// }


fetchProductList(){
   
  /*this.service.getProductList().subscribe( (productList) => { 
    console.log("productList");
    console.log(JSON.stringify(productList));
    this.productList = new Array<Product>()
    this.productList.push(...productList);  
  });*/

  this.service.getProductListByRestaurantId(this.user.restaurantId).subscribe( (productList) => { 
    console.log("productList",productList);
    // const categoryNames = productList.map((product) => product.categoryId?.categoryName);
    // console.log('Category Names:', categoryNames);
productList.forEach(item =>{
  console.log('item+++',item.restaurantId?.id)
  this.restaurantId = item.restaurantId?.id
})
    const categoryNames = productList.map((product) => product.categoryId?.categoryName).filter((name): name is string => !!name);
    this.uniqueCategoryNames = Array.from(new Set(categoryNames));
    if (!this.uniqueCategoryNames.includes('All')) {
      this.uniqueCategoryNames.unshift('All'); // Ensure "All" is the first option
    }
    console.log('Unique Category Names:', this.uniqueCategoryNames);

  this.productNames = productList
      .map((product) => product.productName)
      .filter((name): name is string => !!name);

    if (!this.productNames.includes('All')) {
      this.productNames.unshift('All');
    }
    console.log("Product Names:", this.productNames);
    // this.productNames.unshift('All');
    console.log('JSON.stringify(productList)',JSON.stringify(productList));
    this.productList = new Array<Product>()
    this.productList.push(...productList);  
    localStorage.setItem('subscriptionType',String(this.productList[0]?.restaurantId?.subscriptionType))
    console.log("productList+++",this.productList);
    this.filteredProducts = this.productList;
    this.filteredProducts.forEach(element =>{
      element.buttonLabel = 'Sharing';
    })
    const filteredProductList = this.productList.filter(product => product.recommendation);

    // Iterate through filteredProducts in steps of 2
    for (let i = 0; i < filteredProductList.length; i += 2) {
        // Get the current pair of products
        const pair = filteredProductList.slice(i, i + 2);
        console.log('pair',pair);
        
        // Add the pair to productPairs
        this.productPairs.push(pair);
    }


    this.service.getOrderByOrderId(this.orderId).subscribe(data=>{
      this.order = data;
      
      for(let orderDetailId of this.order.orderDetailId){
        
        for(let product of this.productList){
          if(product.orderDetailList == undefined){
            product.orderDetailList = new Array();
          }
          if(orderDetailId && orderDetailId.productId && product.productId == orderDetailId.productId.productId){ 
            product.quantity = orderDetailId.quantity; 
            product.orderDetailList.push(orderDetailId);
            // Update status counts based on updated orderDetailList
            product.status_0 = product.orderDetailList.filter(od => od.status === '0').length;
            product.status_1 = product.orderDetailList.filter(od => od.status === '1').length;
            product.status_2 = product.orderDetailList.filter(od => od.status === '2').length;
            product.status_3 = product.orderDetailList.filter(od => od.status === '3').length;
            
          }
        }
      }
    }); 
  });
}

productDetail(product:Product){ 
  this.product = product;
  console.log("this.product : " + this.product); 
  this.router.navigate(['/home/tabs/details/',this.order.orderId, this.product.productId]);   
}

doRefresh(event:any) {
  console.log('Begin async operation');
  this.fetchProductList();
  setTimeout(() => {
  console.log('Async operation has ended');
  event.target.complete();
  }, 1000);
}

onChangeAvailability(product:Product,event:any){
   this.service.updateProduct(product).subscribe( 
    (data) => {
      console.log(data);
      this.presentToast('successfully updated product - ' + product.productName); 
      },
      (error)=> {
        console.log("Error in updating product" , error); 
          this.presentToast('Error in updating product'); 
   
    }
  );
}

addProduct(product:Product, isOneByTwo:any){
  //product.quantity = product.quantity+1;
  /*if(product && product.quantity){
    product.quantity++;
  }*/
  
  
  this.addOrderDetail(product,'Totally order for ', isOneByTwo);
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
      if (product.status_0 === 0) {
        product.showButton = false; // Hide button for the specific product
      }
    }
    this.presentToast('Totally order for '+product?.orderDetailList?.length+' ' + product.productName); 
    this.sendMessageForOrder();
  }
}

deleteOrder(orderDetail:OrderDetail, product:Product){
  
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
  this.sendMessageForOrder();
}
navigateToOrderList(){
  this.router.navigate(['/home/tabs/order-list',this.order.orderId,this.tableId]);
}
addOrderDetail(product:Product,msg : any, isOneByTwo: boolean){ 
  console.log('product+++',product);
    let orderDetail = new OrderDetail();
    let product_id = product.productId
    let _count: number =0;
    orderDetail.quantity = product.orderDetailList && product.orderDetailList.length ? product.orderDetailList.length : 0 ;
    // orderDetail.quantity = 1;
    orderDetail.productId = product;
    orderDetail.orderId = this.order;
    orderDetail.status = "0";
    orderDetail.oneByTwo = false;
    if(isOneByTwo){
      orderDetail.oneByTwo = true;
    }
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
        product.showButton = true;
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
        // product.sharing = _count > 0; 
        this.presentToast(msg+_count+' ' + product.productName); 

      });
      //Websocket6
      this.sendMessageForOrder();
      console.log(data);
    }); 
}

onShare(product: Product) {
  console.log('Sharing clicked for', product.productName);
  // Add any logic for sharing functionality
}


handleInputChange(event: CustomEvent) {
  const inputValue = (event.target as HTMLInputElement).value;
  console.log('Input changed:', inputValue);
  this.getBotdata();
  
  // Add your custom logic here
}

userInput: string = '';
chats: any[] = [];
botOutput: string='';
loading: boolean = false; // Loading indicator
recognition: any;
listening = false;

send(){
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
              this.addProduct(selected_product,false);
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

  speak(text: string) {
    if(text){
    console.log("called speak")
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
  }

  openPopup(orderDetailModel:any) {
    this.isPopupOpen = true;
    this.selectedProduct = orderDetailModel
  }

  closePopup() {
    this.isPopupOpen = false;
  }

}