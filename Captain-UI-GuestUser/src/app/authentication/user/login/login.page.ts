import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { User } from '../../../model/user';
import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  

  newUser :User;
  constructor(private service : AuthenticationService, private router : Router
    , private toastController: ToastController) { }

  ngOnInit() {
    this.newUser = new User();
    this.newUser.userId = "";
    this.newUser.password = "";
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

  async presentToastWithOptions(msg:any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'custom-toast',
      position: 'top'
      //showCloseButton: true,
      //position: 'middle'
      //closeButtonText: 'Done'
    });
    toast.present();
  }

  loginUser(){
    this.service.loginUser(this.newUser).subscribe(
      (data:any) => {
        console.log("userData", data);

        if(data['token']){
          this.service.setToken(data['token']);          
         let  newUserVO:User = {
              id:data["id"],
              userId:data['userId'],
              firstName:data['name'],
              lastName:data['name'],
              password:'',
              role:data['role']
              };
      //this.service.setUser(newUserVO);
      this.service.changeUserValue(newUserVO);
      let role = data['role'];
      //this.router.navigate(['/home/tabs/list']);
      this.router.navigate(['/approval']);
      
        }
      },
      (error)=> {
        console.log("Error while login" , error);        

          this.presentToast('Error while login');
                  
      }
    )
  }
}
