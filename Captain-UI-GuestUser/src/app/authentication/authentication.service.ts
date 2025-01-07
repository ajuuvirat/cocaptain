import { Injectable } from '@angular/core';
 
import {HttpClient} from '@angular/common/http';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import * as jwt_decode from 'jwt-decode';
export const TOKEN_NAME = 'jwt_token';

import { BehaviorSubject } from 'rxjs';


import { Employee } from '../model/employee';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

private userSource = new BehaviorSubject<User>(new User());
userObj = this.userSource.asObservable();
 
 
loginUrl:string = environment.loginUserEndpoint;
registerUrl:string = environment.registerUserEndpoint;
qrRegisterLogin:string = environment.qrRegisterLogin;


private mockData = {
  "role": "temp-user",
  "name": "mani null",
  "subscription-details": {
      "adminUserId": 30,
      "kotUserId": 120,
      "serverUserId": 99,
      "sunscripedType": 2,
      "expireOn": [
          2024,
          11,
          24,
          22,
          0
      ],
      "tableActive": true,
      "restaurantActive": 1,
      "restaurantVerify": true
  },
  "active": true,
  "id": "283",
  "message": "user Successfully Login",
  "type": "user",
  "restaurantId": {
      "id": 1,
      "restaurantId": "vjs",
      "restaurantName": "vjs",
      "password": "vjs",
      "zipcode": "123456",
      "address1": "123 new",
      "address2": "new ",
      "city": "kanchipuran",
      "landmark": "sdgfdsg",
      "state": "Tamilnadu",
      "ownerName": "muruhan",
      "phoneNumer": null,
      "emailId": "vjs@vjs.com",
      "totalTable": "10",
      "shopLicense": "123",
      "fssaiNo": null,
      "gstNumber": "123",
      "panNumber": "123",
      "hotelType": 0,
      "subscriptionType": 0,
      "active": true,
      "skipApproval": false,
      "restaurantLogoImageName": "vjs_logo.png",
      "shopLicenseImageName": null,
      "fssaiNoImageName": null,
      "gstPanImageName": null
  },
  "userId": "111",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTEiLCJuYW1lIjoibWFuaSBudWxsIiwicm9sZSI6InRlbXAtdXNlciIsImlhdCI6MTczMzE3MDAyNX0.ES5mN1XLQDisPk5EmgnYTmN2UOuUXzsW7KSKgm6hIRY"
};


user:User;
  constructor(private http:HttpClient) { }
 
  loginUser(user:User){
    return this.http.post(this.loginUrl , user);
  }

  qrLoginUser(user:User){
    return this.http.post(this.qrRegisterLogin , user);
    // return of(this.mockData,user);
  }

  // qrLoginUser(): Observable<any> {
  //   return of(this.mockData); // Return the dummy data as an observable
  // }

  registerUser(user:User){
    return this.http.post(this.registerUrl, user, {responseType:'json'});
  }

  changeUserValue(newUserObj:User){
    this.userSource.next(newUserObj);
  }
   
  setUser(user:User){
    this.user = user;
  }
  getUser(){
    return this.user;
  }
   

  setToken(token:string){
    return localStorage.setItem(TOKEN_NAME, token ); 
  }

   getToken(){
    return localStorage.getItem(TOKEN_NAME);
  }


  deleteToken(){
    return localStorage.removeItem(TOKEN_NAME);
  }

  getTokenExpirationDate(token:string):any{
    const decode = jwt_decode(token);
    if(decode.exp === undefined)
    {
      return null;
    }
    const date = new Date();
    date.setUTCSeconds(decode.exp);
    return date;
  }

  isTokenExpired(token?:any):boolean { 

    if(!token){
      token = this.getToken();
    }
    if(!token){
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    if(date  === undefined || date === null) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

}
