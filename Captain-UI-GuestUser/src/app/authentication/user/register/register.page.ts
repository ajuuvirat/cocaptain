import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { User } from '../../../model/user';
import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';
import {FormGroup, FormControl, Validators, FormBuilder,FormArray} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userForm : FormGroup;

  newUser :User;
  constructor(private service : AuthenticationService, private router : Router
    , private toastController: ToastController) {
      this.newUser = new User();

     }

 
  ngOnInit() { 
 
    this.userForm = new FormGroup({
      userId : new FormControl('', [Validators.required]),
      firstName : new FormControl('', [Validators.required]),
      lastName : new FormControl('', [Validators.required]),
      password : new FormControl('', [Validators.required])
      
    });
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

  registerUser(){
    console.log("new User : "+ JSON.stringify(this.newUser));
    this.newUser.role = "user";


    
    let user = new User(); 

    user.role = "user";
    user.userId = this.userForm.value.userId,
    user.firstName = this.userForm.value.firstName,
    user.lastName = this.userForm.value.lastName,
    user.password = this.userForm.value.password,

    this.service.registerUser(this.newUser).subscribe(
      (data) => {
        console.log("userData", data); 
        this.presentToast('User Created successfully');
        this.router.navigate(['/login']);
      },
      (error)=> {
        console.log("Error while login" , error);
        this.presentToast('Error while login');
      }
    )
  }
  
  resetUser(){
    this.newUser = new User();
  }

}
