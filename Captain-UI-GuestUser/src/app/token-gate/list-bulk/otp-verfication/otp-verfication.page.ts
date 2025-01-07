import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router }from '@angular/router';
import { User } from 'src/app/model/user';
import { Restaurant } from 'src/app/model/restaurant';
import { Order } from 'src/app/model/order';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-otp-verfication',
  templateUrl: './otp-verfication.page.html',
  styleUrls: ['./otp-verfication.page.scss'],
})
export class OtpVerficationPage implements OnInit {
  otp: string[] = new Array(6).fill('');
  otpBoxes = new Array(6);
  resultMessage: string | null = null;
  errorMessage: string | null = null;
  userId: any;
  restaurantId: any;
  tableId: any;
  countdown: number = 30;
  userServer:User;
  dashOffset: number = 0;
  restaurantIdObj:Restaurant;
  order:Order;
  isYetToApproved:boolean = true;
  socket_val:string = environment.socket_val;
  private stompClient: Stomp.Client;
  user:User;
  restarnttableId: any;
  restarant:string;

  constructor(private service: EmployeeService,private router: Router,private route: ActivatedRoute,private toastController: ToastController) { }

  ngOnInit() {
    const data:any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data)
    console.log('userDetails56',userDetails);
    this.userId = userDetails.userId
    this.restaurantId = userDetails.restaurantId
    // this.restaurantId = userDetails.restaurantId
    this.tableId = userDetails.tableId
    console.log('this.tableId',this.tableId);
    let restau = this.route.snapshot.params['restaurantId'];
    // this.route.params.subscribe(params => {
    //   this.tableId = params['tableId'];
    //   this.restaurantId = params['restaurantId'];
    //   console.log('this.tableId',this.tableId);
    //   console.log('this.restaurantId',this.restaurantId);
    // });
    this.startCountdown();
  }

  callOrder(){
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

  startCountdown() {
    const totalDashLength = 2 * Math.PI * 45;const interval = setInterval(() => {       
      this.countdown--;       
      this.dashOffset = totalDashLength - (totalDashLength / 30) * this.countdown;       
      if (this.countdown === 0) {         
        clearInterval(interval);      
       }}, 1000);
  }

  onInputChange(index: number) {
    if (this.otp[index] && index < this.otp.length - 1) {
      const nextInput: HTMLElement = document.querySelectorAll('.otp-box')[index + 1] as HTMLElement;
      nextInput.focus();
    }
  }
    onFocus(index: number) {
    // You can handle extra logic here if needed when a box is clicked.
    console.log('Focused on box:', index);
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otp[index]) {
      const previousInput: HTMLElement = document.querySelectorAll('.otp-box')[index - 1] as HTMLElement;
      if (previousInput) {
        previousInput.focus();
      }
    }
  }

  sendMessage() { 
    this.stompClient.send("/app/send/messageFromUser", {},
     JSON.stringify({
        'name': "user",
        'toUser' : this.restarant
    }));
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

  fetchAllProductWithUser(restaurantId:any){ 
    const data:any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data)
      console.log('userDetails',userDetails);
      this.user = userDetails;
      this.service.getUserByUserId(this.user.userId).subscribe(data => {
        console.log("data: " + Object.values(data));
        this.restarnttableId = data.userId
        this.userServer = data; 
        this.service.findRestaurantById(this.restaurantId).subscribe(
          data=> { 
            this.restaurantIdObj = data; 
            console.log('this.restaurantIdObj', this.restaurantIdObj);
            console.log('this.restaurantIdObj++++', this.restaurantIdObj.restaurantLogoImageName);
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
  if (order.status === '0') {
    this.service.searchOrderStatusByTableId(this.tableId, this.restaurantId).pipe(
      switchMap((data) => {
        let orderList: Order[] = Array.isArray(data) ? data : [data];
        for (let order of orderList) {
          if (order.status == '1' || order.status == '2') {
            if (order.userId?.userId != this.user.userId) {
              this.router.navigate(['/error-massage', "Dear " + this.user.firstName + ", Already Some user is sitting in this table"]);
              return [];
            }
          }
        }
        for (let order of orderList) {
          if (order.userId?.userId != this.user.userId) {
            if (order.status == '3') {
              this.router.navigate(['/error-massage', "Dear User, Your order is closed, Bill will reach you ASAP"]);
              return [];
            }
          }
        }
          order.restaurantId = this.restaurantIdObj
        return this.service.saveOrder(order);
      })
    ).subscribe(
      (data) => {
        console.log('datadata',data);
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
      }
    );
  }
    
          },
          (error)=>{
    
          }
        );
      });
  }

  // sendAndValidateOtp() {
  //   if (this.otp.trim() === '') {
  //     this.errorMessage = 'Please enter a valid OTP';
  //     this.resultMessage = null;
  //     return;
  //   }
  
  //   const otpPattern = /^[0-9]{6}$/;
  //   if (!otpPattern.test(this.otp)) {
  //     this.errorMessage = 'OTP must be a 6-digit number';
  //     this.resultMessage = null;
  //     return;
  //   }
  
  //   this.service.validatedOtp(this.userId, this.otp).subscribe(
  //     (response) => {
  //       console.log('responseresponse',response);
  //      this.restaurantId = response.restaurantId.id
  //      console.log('Restaurant ID:', this.restaurantId);
  //       if (response.status.allow === 'true') {
  //         this.resultMessage = response.message;
  //         this.errorMessage = null; 
  //         this.router.navigate(['/approval', this.restaurantId, this.tableId]).then(() => {
  //           console.log('Navigation successful to /approval');
  //         }).catch(err => {
  //           console.error('Navigation error:', err);
  //         });
  //       } else {
  //         this.errorMessage = response.otp;
  //         this.resultMessage = null;
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to validate OTP. Please try again.';
  //       this.resultMessage = null;
  //     }
  //   );
  // }
  sendAndValidateOtp() {
    const otpString = this.otp.join('');
    if (otpString.trim() === '') {
      this.errorMessage = 'Please enter a valid OTP';
      this.resultMessage = null;
      return;
    }
  
    const otpPattern = /^[0-9]{6}$/;
    if (!otpPattern.test(otpString)) {
      this.errorMessage = 'OTP must be a 6-digit number';
      this.resultMessage = null;
      return;
    }
  
    this.service.validatedOtp(this.userId, otpString).subscribe(
      (response) => {
        console.log('Response:', response);
        if (response.status.allow === 'true') {
          this.resultMessage = response.message;
          this.errorMessage = null;
          this.router.navigate(['/approval', this.restaurantId, this.tableId]).then(() => {
            console.log('Navigation successful to /approval');
          }).catch(err => {
            console.error('Navigation error:', err);
          });
          this.fetchAllProductWithUser(this.restaurantId)
        } else {
          this.errorMessage = response.otp;
          this.resultMessage = null;
        }
        
      },
      (error) => {
        this.errorMessage = 'Failed to validate OTP. Please try again.';
        this.resultMessage = null;
      }
    );
  }
  


}
