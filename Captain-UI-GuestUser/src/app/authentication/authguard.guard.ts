import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Router  } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {

  constructor(private route: Router, private services :AuthenticationService){

  }
  


  /*canActivate(){
    if(!this.services.isTokenExpired()){
  
      return true;
    }
    this.route.navigate(['/login']);
    return true;
  }*/



 

  canActivate(route: ActivatedRouteSnapshot): boolean {

      console.log(route);

      let authInfo = {
          authenticated: false
      };

      if(!this.services.isTokenExpired()){
  
        authInfo = {
          authenticated: true
      };
      }
      if (!authInfo.authenticated) {
          this.route.navigate(['login']);
          return false;
      }

      return true;

  }
}
