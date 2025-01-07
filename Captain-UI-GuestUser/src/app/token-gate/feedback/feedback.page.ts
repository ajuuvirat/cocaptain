import { Component, OnDestroy, OnInit } from '@angular/core';

//Websocket1
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AlertController , ToastController} from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Router ,Event , NavigationExtras, NavigationEnd} from '@angular/router';
import { ActivatedRoute }  from '@angular/router';
import { User } from '../../model/user'; 
import { AuthenticationService } from '../../authentication/authentication.service';
import { RatingPage } from '../rating/rating.page';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit, OnDestroy {
  showBanner = true;
  selectedTab = 'app';
  ratingClicked: number = 0;
  ratingOver: number;
  ratingClicked_restaurant: number = 0;
  ratingOver_restaurant: number;
  itemIdRatingClicked: string;
    text_app:any;
  text_restaurant:any;
  isRatingApp:boolean =false;
  isRatingRestaurant:boolean = false;
  private routerSubscription: Subscription;
  user:User;
  //Websocket2
  private stompClient: Stomp.Client;;
  tableId:string;
  socket_val:string = environment.socket_val;
  constructor(private toastController: ToastController,
    private router:Router,
    private route:ActivatedRoute,
    public alertController: AlertController,
    private authService : AuthenticationService,
    ) { 
    //this.tableId = this.route.snapshot.params['tableId'];
    //Websocket6
    this.connect();
  }

  //Websocket4
connect() {
  let ws = new SockJS(this.socket_val);
  this.stompClient = Stomp.over(ws);
  let that = this;
 this.stompClient.connect({}, function () {
    that.stompClient.subscribe("/chatToUserForBill/"+that.user.restaurantId +"/"+ that.user.tableId , (message : any) => {
      if (message.body) {
       console.log("in feedback msg " + message.body);
       that.presentToast('Admin will get your Bill  As Soon As possible '); 
      }
    });
  }); 

}
 
  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url === '/home/tabs/needs-list') {
        this.showBanner = true;
      }
    });
    this.authService.userObj.subscribe((user:any) => {
      this.user = user;    
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  
  }

  hideBanner() {
    this.showBanner = false;
  }


   
  async presentToast(msg : any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'custom-toast',
      position: 'top'
    });
    toast.present();
  }
  
  navigateToErrorPage(){ 
 
  
    this.router.navigate(['/error-massage',"Dear User, Your order is closed, Bill will reach you ASAP"]);
  }

  ratingComponentClick(clickObj: any, id:any): void { 
    if(id == 1){
      this.ratingClicked = clickObj.rating; 
      if(this.ratingClicked > 0){
        this.isRatingApp = true;
      }
    }else if(id == 2){
      this.ratingClicked_restaurant = clickObj.rating; 
      if(this.ratingClicked_restaurant > 0){
        this.isRatingRestaurant = true;
      }
      
    }  
    
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  ratingComponentOver(clickObj: any, id : any): void { 
    if(id == 1){
      this.ratingOver = clickObj.rating; 
      
    }else if(id == 2){
      this.ratingOver_restaurant = clickObj.rating; 
    }
  }

}


 
