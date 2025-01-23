import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../model/employee';
import { Subscription } from '../../../../node_modules/rxjs';
import { Observable } from '../../../../node_modules/rxjs/';
import { EmployeeService } from '../service/employee.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { User } from '../../model/user'; 
import { Order } from '../../model/order'; 
import { ToastController } from '@ionic/angular';
import { interval } from 'rxjs';
import { Restaurant } from '../../model/restaurant';
import { environment } from '../../../environments/environment';
//Websocket
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-approval',
  templateUrl: './approval.page.html',
  styleUrls: ['./approval.page.scss'],
})
export class ApprovalPage implements OnInit {

  user:User;
  userServer:User;
  order:Order;
  isYetToApproved:boolean = true;
  restaurantId:string;
  tableId:string;
  restaurantIdObj:Restaurant;
  observableRef : any;
  socket_val:string = environment.socket_val;

  restarant:string;
  //Websocket
  title = 'Spring Boot WebSocket Chat App';
  private stompClient: Stomp.Client;
  restarnttableId: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: EmployeeService,
    private authService : AuthenticationService,
    private toastController: ToastController) {
      this.restarant = this.route.snapshot.params['restaurantId'];
      this.tableId = this.route.snapshot.params['tableId'];
      this.connect();
    }

connect() {
  var socket = new SockJS(this.socket_val);
  this.stompClient = Stomp.over(socket);
  let that = this;

  this.stompClient.connect({"user" : "user"}, function () {
    that.stompClient.subscribe("/chatToUser/"+that.user.restaurantId +"/"+ that.tableId, (message : any) => {    
      if (message.body) {
       console.log(message.body);
       that.callOrder(); 
      }
    });
  }); 
   
}

sendMessage() { 

  this.stompClient.send("/app/send/messageFromUser", {},
   JSON.stringify({
      'name': "user",
      'toUser' : this.restarant
  }));
}


    ngOnDestroy(){
      console.log("Destroy timer");
      this.observableRef.unsubscribe();
  
    }

  ngOnInit() {
    let tabId = this.route.snapshot.params['tableId'];
    let restau = this.route.snapshot.params['restaurantId'];

    /*this.route.params.subscribe(params => {
      this.tableId = params['tableId'];
      this.restaurantId = params['restaurantId'];
    });*/
 
    
    //create new orderfor this user
    this.fetchAllProductWithUser(restau);

    
      /*interval(10000).subscribe(x => {
        //if(this.order.status == '0'){
          this.callOrder();
        //}
       
      });*/


       //This is the Observable time interval
      /*this.observableRef = Observable.interval(10000)
    .takeWhile(() => true)
    .flatMap(() =>   this.service.searchOrderByStatus('1',this.userServer.id,this.restaurantIdObj.id))
    .subscribe(
      data => {
        console.log(data);
        if(data.status == '1'){
          this.observableRef.unsubscribe();
          this.router.navigate(['/home/tabs/list',this.order.orderId]);
        }
        
    },
      (error) =>  {
      console.log("error");
      }
  );*/

     

  
    

    /*this.authService.userObj.subscribe(user => { 

      this.user = user; 
      this.service.getUserByUserId(this.user.userId).subscribe(data => {
        console.log("data: " + Object.values(data));
        this.userServer = data; 
        console.log("this.product : " + this.userServer);
      });
       
    });*/

  
    
  }
  async presentToast(msg :any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'custom-toast',
      position: 'top'
    });
    toast.present();
  }
  callOrder(){

    /*this.service.getUserByUserId(this.user.userId).subscribe(data => {
      console.log("data: " + Object.values(data));
      this.userServer = data; 
      console.log("this.product : " + this.userServer);
    });*/
    
        this.service.searchOrderByStatus('1',this.userServer.id,this.restaurantIdObj.id).subscribe(
        (data) =>  {
          this.order = data;
          if(this.order.status == '0'){
            this.service.changeUserStatusValue(0);
            this.isYetToApproved = true;  
          }else if(this.order.status == '1' || this.order.status == '2'){
            this.isYetToApproved = false;
            this.service.changeUserStatusValue(1);
            this.router.navigate(['/home/tabs/list',this.order.orderId]);
          }else if(this.order.status == '3'){
            this.router.navigate(['/error-massage',"Dear User, Your order is closed, Bill will reach you ASAP"]);
          }
          
          },
           (error) =>  {
            console.log("error");
           }
        );
  } 
   
fetchAllProductWithUser(restaurantId:any){ 
  const data:any = localStorage.getItem('userDetails');
  const userDetails = JSON.parse(data)
  // this.authService.userObj.subscribe(user => { 
    console.log('userDetails',userDetails);
    this.user = userDetails;
    this.service.getUserByUserId(this.user.userId).subscribe(data => {
      console.log("data: " + Object.values(data));
      this.restarnttableId = data.userId
      this.userServer = data; 
      this.service.findRestaurantById(restaurantId).subscribe(
        data=> { 
          this.restaurantIdObj = data; 
          console.log(' this.restaurantIdObj', this.restaurantIdObj);
          console.log(' this.restaurantIdObj++++', this.restaurantIdObj.restaurantLogoImageName);
          if (this.restaurantIdObj && this.restaurantIdObj.restaurantLogoImageName) {
            localStorage.setItem('restaurantLogoImageName', this.restaurantIdObj.restaurantLogoImageName);
            console.log('Restaurant logo saved to localStorage:', this.restaurantIdObj.restaurantLogoImageName);
          } else {
            console.error('restaurantLogoImageName not found in restaurantIdObj');
          }
          let order = new Order(); 
          order.userId =this.user; 
          order.tableId = this.tableId;
          if(this.restaurantIdObj.skipApproval){
            order.status = '1';
            
            order.restaurantId = this.restaurantIdObj
            this.service.saveOrder(order).subscribe(
              (data) => {                 
                this.order = data;
                if(this.restaurantIdObj.skipApproval){
                  this.service.changeUserStatusValue(1);
                   this.router.navigate(['/home/tabs/list',this.order.orderId]);
                }else{
                  this.sendMessage(); 
                }
               
              },
              (error)=> {
                //if order is exsit for this user then check status is '0' or '1'
                if(error.status == '302'){
                  
                  this.order = error.error;
                  if(this.order.status == '0'){
                    this.isYetToApproved = true;  
                    this.service.changeUserStatusValue(0);
                    this.sendMessage(); 
                  }else if(this.order.status == '1' || this.order.status == '2'){
                    this.isYetToApproved = false;
                    this.service.changeUserStatusValue(1);
                    this.router.navigate(['/home/tabs/list',this.order.orderId, this.tableId]);
                  }else if(this.order.status == '3'){
                    this.router.navigate(['/error-massage',"Dear User, Your order is closed, Bill will reach you ASAP"]);
                  }
                  
                  console.log("Error while login" , error);
                }
                console.log("Error while login" , error);
                this.presentToast('Error while login');
              }
            )
          }else{
            order.status = '0';
          }
      
// sat5178 start
     /* if( order.status === '0'){
        this.service.searchOrderStatusByTableId(this.tableId,this.restarant).subscribe(
          (data) =>  {
            let orderList: Order[] = Array.isArray(data) ? data : [data];
//check any user accupied this table
            for (let order of orderList) {
            if(order.status == '1' || order.status == '2' ){
              if(order.userId?.userId != this.user.userId){
                this.router.navigate(['/error-massage',"Dear " + this.user.firstName + ", Already Some user is sitting in this table"]);
              } 
              return;
            } 
          }
// check this user is applied for bill
          for (let order of orderList) { 
              if(order.userId?.userId != this.user.userId){
                if(order.status == '3'){
                  this.router.navigate(['/error-massage',"Dear User, Your order is closed, Bill will reach you ASAP"]);
                  return;
                } 
              }  
          }

          
            },
             (error) =>  {
              console.log("error");
             }
          );
      }*/



 


// snippet 1
if (order.status === '0') {
  this.service.searchOrderStatusByTableId(this.tableId, this.restarant).pipe(
    switchMap((data) => {
      let orderList: Order[] = Array.isArray(data) ? data : [data];

      // Check any user occupied this table
      for (let order of orderList) {
        if (order.status == '1' || order.status == '2') {
          if (order.userId?.userId != this.user.userId) {
            this.router.navigate(['/error-massage', "Dear " + this.user.firstName + ", Already Some user is sitting in this table"]);
            return []; // Empty observable to stop further processing
          }
        }
      }

      // Check if this user has applied for a bill
      for (let order of orderList) {
        if (order.userId?.userId != this.user.userId) {
          if (order.status == '3') {
            this.router.navigate(['/error-massage', "Dear User, Your order is closed, Bill will reach you ASAP"]);
            return []; // Empty observable to stop further processing
          }
        }
      }

      // If no conditions matched, proceed to saveOrder
      order.restaurantId = this.restaurantIdObj
      return this.service.saveOrder(order);
    })
  ).subscribe(
    (data) => {
      this.order = data;
      if (this.restaurantIdObj.skipApproval) {
        this.service.changeUserStatusValue(1);
        this.router.navigate(['/home/tabs/list', this.order.orderId]);
      } else {
        this.sendMessage();
      }
    },
    (error) => {
     //if order is exsit for this user then check status is '0' or '1'
     if(error.status == '302'){
            
      this.order = error.error;
      if(this.order.status == '0'){
        this.isYetToApproved = true;  
        this.service.changeUserStatusValue(0);
        this.sendMessage(); 
      }else if(this.order.status == '1' || this.order.status == '2'){
        this.isYetToApproved = false;
        this.service.changeUserStatusValue(1);
        this.router.navigate(['/home/tabs/list',this.order.orderId, this.tableId]);
      }else if(this.order.status == '3'){
        this.router.navigate(['/error-massage',"Dear User, Your order is closed, Bill will reach you ASAP"]);
      }
      
      console.log("Error while login" , error);
    }
    console.log("Error while login" , error);
    // this.presentToast('Error while login');
    }
  );
}

// sat5178 end

/*

  */
  
        },
        (error)=>{
  
        }
      );




    });
    

    
    
    
     
  // });
 
 

}

}

