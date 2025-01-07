import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { User } from '../../../model/user';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from './../../authentication.service';
import { EmployeeService } from '../../../token-gate/service/employee.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-qr-login',
  templateUrl: './qr-login.page.html',
  styleUrls: ['./qr-login.page.scss'],
})
export class QrLoginPage implements OnInit {
  user: User;
  userForm: FormGroup;
  restaurantId: string;
  tableId: string;
  restaurantLogoImageName: string | null;
  errorMessage: string = '';
  ;
  newUser: User;
  imageUrl: string = environment.imageUrl;
  constructor(private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private service: EmployeeService,
    private toastController: ToastController,
    public loadingController: LoadingController,
    // private service: EmployeeService,
  ) {
    this.newUser = new User();

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading..',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }


  ngOnInit() {
    this.restaurantLogoImageName = localStorage.getItem('restaurantLogoImageName');
    console.log('this.restaurantLogoImageName', this.restaurantLogoImageName);
    console.log(this.route.snapshot.params['id']);
    //this.product = new Product();
    //this.product.productId = this.route.snapshot.params['restaurantId'];
    let tabId = this.route.snapshot.params['tableId'];
    let restau = this.route.snapshot.params['restaurantId'];

    this.route.params.subscribe(params => {
      this.tableId = params['tableId'];
      this.restaurantId = params['restaurantId'];
    });

    this.userForm = new FormGroup({
      userId: new FormControl(null, [Validators.pattern("[0-9]{0-10}")]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])

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

  preventNonNumeric(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete'];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault(); // Prevent input if not a digit or allowed key
    }
  }

  // validSubscribedTables(id:any){
  //   this.service.getSubscribedTables(id).subscribe((data) =>{
  //     console.log('validadata',data);
  //     this.router.navigate(['/approval',this.restaurantId,this.tableId]);
  //   })
  // }

  qrRegisterUser() {
    this.newUser.userId = this.userForm.value.userId
    this.newUser.firstName = this.userForm.value.firstName
    this.newUser.role = "temp-user";
    this.newUser.restaurantId = this.restaurantId
    console.log("new User : " + JSON.stringify(this.newUser));
    this.newUser.role = "temp-user";
    let user = new User();
    user.role = "temp-user";
    user.userId = this.userForm.value.userId,
      user.firstName = this.userForm.value.firstName,
      this.newUser.tableId = this.tableId
    this.presentLoading();
    this.authService.qrLoginUser(this.newUser).subscribe(
      (data: any) => {
        console.log("userData", data);
        localStorage.setItem('SubscripedType', data['status']['SubscripedType'])
        if (data['token']) {
          this.authService.setToken(data['token']);
          let newUserVO: User = {
            id: data["id"],
            userId: data['userId'],
            firstName: data['name'],
            lastName: data['name'],
            password: '',
            role: data['role'],
            restaurantId: this.restaurantId,
            tableId: this.tableId
          };
          this.authService.changeUserValue(newUserVO);
          localStorage.setItem('userDetails', JSON.stringify(newUserVO))
        }
        if (data['status'] && data['status'].allow === "false") {
          this.errorMessage = data['status']['error_message'] || 'Login not allowed';
          this.presentToast(this.errorMessage);
          return;
        }
        if (data['allow'] === false) {
          this.errorMessage = data['message'] || 'Login not allowed';
          console.log('this.errorMessage', this.errorMessage);
          this.presentToast(this.errorMessage);
          return;
        }
        if (data['status'] && data['status'].allow === "true") {
          const subscribedType = data['status']['SubscripedType'];
          if (subscribedType === "0") {
            console.log("User subscribed type is 0, navigating to list-bulk page.");
            this.router.navigate(['/list-bulk']);
          }
          else if (subscribedType === "2") {
            console.log("User subscribed type is 2, navigating to phone number input page.");
            this.router.navigate(['/otp-verfication']);
          }
          else if (subscribedType === "3") {
            console.log("User subscribed type is 3, navigating to product list page.");
            this.router.navigate(['/list-bulk']);
          }
          else {
            console.log("User is active, navigating to approval page.");
            this.router.navigate(['/approval', this.restaurantId, this.tableId]);
          }
        }
      },

      (error) => {
        console.log("Error while login", error);
        this.errorMessage = 'Error while login';
      }
    )
    console.log("new User : " + JSON.stringify(this.newUser));
  }


  //   qrRegisterUser() {
  //     this.newUser.userId = this.userForm.value.userId;
  //     this.newUser.firstName = this.userForm.value.firstName;
  //     this.newUser.role = "temp-user";
  //     this.newUser.restaurantId = this.restaurantId;

  //     console.log("new User : " + JSON.stringify(this.newUser));

  //     this.authService.qrLoginUser().subscribe(
  //       (data: any) => {
  //         console.log("userData", data);

  //         if (data.token) {
  //           localStorage.setItem('userDetails', JSON.stringify(data));
  // if(data['subscription-details'].sunscripedType == 1){
  // this.router.navigate(['/home/tabs/list', this.restaurantId]);
  // }
  //           if (data.active) {
  //             console.log("User is active, navigating to approval page.");
  //             this.router.navigate(['/approval', this.restaurantId, this.tableId]);
  //           } else {
  //             console.error("User is not active.");
  //             alert('User is not active. Please contact support.');
  //           }
  //         }
  //       },
  //       (error) => {
  //         console.error("Error while login", error);
  //         alert('Error while login');
  //       }
  //     );
  //   }

  resetUser() {
    this.newUser = new User();
  }

}
