import { Injectable, Injector , Inject, forwardRef} from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { EmployeeService } from './service/employee.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  

    /*constructor(@Inject(forwardRef(() => AuthenticationService)) private service: AuthenticationService){

    }*/

    constructor( private injector:Injector ){

    }
    intercept(request:HttpRequest<any> , next: HttpHandler): Observable<HttpEvent<any>>{

        let service = this.injector.get(AuthenticationService);
        console.log("Request Before : ",request);
        console.log("Token: "+ service.getToken());
        request = request.clone({
            setHeaders:{
                Authorization : `Bearer ${service.getToken()}`
            }
        });
        console.log("Request After : ",request);
        return next.handle(request);
    }
}
