import { Injectable } from '@angular/core';

import { User } from '../../model/user';
 
import { environment } from '../../../environments/environment';



 

import { Restaurant } from '../../model/restaurant';
import { Employee } from '../../model/employee';
import { Role } from '../../model/role';


 
 

import * as jwt_decode from 'jwt-decode';
export const TOKEN_NAME = 'jwt_token';
import { BehaviorSubject, of, throwError } from 'rxjs';




import {HttpClient , HttpHeaders, HttpEvent, HttpRequest, HttpParams} from '@angular/common/http';
// import { RequestOptions } from '@angular/http';
// import { timer } from 'rxjs/observable/timer';
// import { map } from 'rxjs/operators/map'; 
// import { map } from 'rxjs/operators'; 
import { catchError, delay, map } from 'rxjs/operators';


// import { Observable } from 'rxjs/Observable'; --old
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

// import { Headers } from '@angular/http';

// import 'rxjs/add/operator/map';
import { Veg } from '../../model/product/Veg';
import { Catagory } from '../../model/product/Catagory';
import { SubCatagory } from '../../model/product/SubCatagory';
import { ServedDuring } from '../../model/product/ServedDuring';
import { Cuisine } from '../../model/product/Cuisine';
import { Dependency } from '../../model/product/Dependency';
import { Gst } from '../../model/product/Gst';
import { Product } from '../../model/product/Product';
import { Order } from '../../model/order';
import { OrderDetail } from '../../model/order-detail';
import { Needs } from '../../model/needs';
import { NeedsTableMap } from '../../model/needsTableMap';

 


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private generatedOtp: string = '';
  private otpExpiryTime: number = 0;
  employeeList_all:string = environment.employeeList_all;
  employee_endpoint:string = environment.employee_endpoint;
  role_endpoint:string = environment.role_endpoint;
  veg_endpoint:string = environment.veg_endpoint;
  category_endpoint:string = environment.category_endpoint;
  subcategory_endpoint:string = environment.subcategory_endpoint;
  subcategory_home_endpoint:string = environment.subcategory_home_endpoint;  
  servedduring_endpoint:string = environment.servedduring_endpoint;
  cuisine_endpoint:string = environment.cuisine_endpoint;
  dependency_endpoint:string = environment.dependency_endpoint;
  gst_endpoint:string = environment.gst_endpoint;
  save_upload_endpoint:string = environment.save_upload_endpoint;
  update_upload_endpoint:string = environment.update_upload_endpoint;  
  product_all_endpoint:string = environment.product_all_endpoint;
  product_endpoint:string = environment.product_endpoint;
  order_endpoint:string = environment.order_endpoint;
  search_endpoint:string = environment.search_endpoint;
  user_endpoint:string = environment.user_endpoint;
  restaurant_search_endpoint:string = environment.restaurant_search_endpoint;
  searchrepo_endpoint:string = environment.searchrepo_endpoint;
  orderdetail_endpoint:string = environment.orderdetail_endpoint;
  update_order_status:string = environment.update_order_status;
  delete_order_detail_endpoint:string = environment.delete_order_detail_endpoint;
  needsList:string = environment.needsList;
  needsTableMapList:string = environment.needsTableMapList;
  food_instructions:string = environment.food_instructions;
  food_sharings:string = environment.food_sharings
  validSubscription: string = environment.validSubscription
  otherInitated:string = environment.otherInitated
  acceptShare:string = environment.acceptShare
  update_order_amount:string = environment.update_order_amount
  by_initiated_user:string = environment.by_initiated_user
  deactivate_Needs:string = environment.deactivate_Needs
  validateOtp:string = environment.validateOtp
  multi_nstruction: string = environment.multi_nstruction

private orderSource = new BehaviorSubject<string>("");
//we can call by below code to get OrderId
//this.Service.currentOrderId.subscribe(orderId => this.orderId = orderId);
currentOrderId = this.orderSource.asObservable();

private userStatusSource = new BehaviorSubject<number>(0);
//we can call by below code to get OrderId
//this.Service.currentOrderId.subscribe(orderId => this.orderId = orderId);
userStatus = this.userStatusSource.asObservable();    
   

  constructor(private http:HttpClient) { }
  
  changeOrderIdValue(orderIdValue: string){
    this.orderSource.next(orderIdValue);
  }

  changeUserStatusValue(status: number){
    this.userStatusSource.next(status);
  }

  callBot(user:any,url:any): Observable<any> {
    return this.http.post(url , user);
  }
  getEmployeeList(): Observable<Array<Employee>>{
    return this.http.get(this.employeeList_all).pipe(
      retry(3),
      map(this.employeeDomainMapper.bind(this))
    );
  }
/*
From java to angular object mapping
*/
employeeDomainMapper(employeeDomains:any): Array<Employee>{
    console.log(JSON.stringify(employeeDomains));
    return employeeDomains.pipe(map( (employee : Employee)=>{
       
      

      let employeeVo:Employee = {
        id:employee.id,
        userId:employee.userId,
        firstName:employee.firstName,
        lastName:employee.lastName,
        password:employee.password,
       restaurantId:employee.restaurantId,
       roleEmpId:employee.roleEmpId
      } 

      return employeeVo;
    }));

  }

  deleteEmployee(employee:Employee){    
    const url = `${this.employee_endpoint}/${employee.id}`;
    return this.http.delete(url, {responseType : 'text'});
  }

//fetch Employee by id
getEmployeeById(id:any){
  console.log('in service edit');
  const url = `${this.employee_endpoint}/${id}`; 

return this.http.get(url).pipe(map((res: Employee) => {
  console.log("in services >>>>"+res);
  return res;
  })); 
}

updateEmployeeUser(employee:Employee){
  const url = `${this.employee_endpoint}/${employee.id}`;
    return this.http.put(url, employee);
  
}

// Fetch Role Master Table
getRoleList(): Observable<Array<Role>>{
  return this.http.get(this.role_endpoint).pipe(
    retry(3),
    map(this.roleDomainMapper.bind(this))
  );
}
/*
From java to angular object mapping
*/
roleDomainMapper(roleDomains:any): Array<Role>{
  console.log(JSON.stringify(roleDomains));
  return roleDomains.pipe(map( (role:Role) =>{
  
 
    let roleVo:Role = {
      roleId:role.roleId,
      roleName:role.roleName,
      isChecked:false
    } 

    return roleVo;
  }));

}

/**
 * Product
 */



 // Fetch Role Master Table
/*getVegList(): Observable<Array<Veg>>{
  return this.http.get(this.veg_endpoint).pipe(
    retry(3),
    map(this.roleDomainMapper.bind(this))
  );
}*/ 
// Observable<Array<Veg>>
/*getVegList(){
  this.http.get(this.veg_endpoint).subscribe((res : Veg[])=>{
  console.log(res);
  return res;
  });
}*/

/*getUsers(){
 
 
  return this.http.get(this.veg_endpoint)
      .map((res: Response) => {
        
        return res.json();
      });
}*/
//Fetch Veg List
getVegList() : Observable<Array<Veg>>{
  return this.http.get<Array<Veg>>(this.veg_endpoint).pipe(map((res: Array<Veg>) => {
    console.log("in services Veg>>>>"+res);
    return res;
    })); 
}


//Fetch catagory List
getCategoryList() : Observable<Array<Catagory>>{
  return this.http.get<Array<Catagory>>(this.category_endpoint).pipe(map((res: Array<Catagory>) => {
   
    return res;
    })); 
}

//Fetch SubCatagory List
getSubCatagoryList() : Observable<Array<SubCatagory>>{
  return this.http.get<Array<SubCatagory>>(this.subcategory_endpoint).pipe(map((res: Array<SubCatagory>) => {
    console.log("in services SubCatagory>>>>"+res);
    return res;
    })); 
}

//Fetch SubCatagory by category List
getSubCategoryByCategoryId(id:any) : Observable<Array<SubCatagory>>{
  
  const url = `${this.subcategory_home_endpoint}/${id}`;
  return this.http.get<Array<SubCatagory>>(url).pipe(map((res: Array<SubCatagory>) => {
    console.log("in services getSubCategoryByCategoryId>>>>"+res);
    return res;
    })); 
}

//Fetch servedduring List
getServedDuringList() : Observable<Array<ServedDuring>>{
  return this.http.get<Array<ServedDuring>>(this.servedduring_endpoint).pipe(map((res: Array<ServedDuring>) => {
    console.log("in services catagory>>>>"+res);
    return res;
    })); 
}

//Fetch Cuisine List
getCuisineList() : Observable<Array<Cuisine>>{
  return this.http.get<Array<Cuisine>>(this.cuisine_endpoint).pipe(map((res: Array<Cuisine>) => {
    console.log("in services Cuisine>>>>"+res);
    return res;
    })); 
}

//Fetch Dependency List
getDependencyList() : Observable<Array<Dependency>>{
  return this.http.get<Array<Dependency>>(this.dependency_endpoint).pipe(map((res: Array<Dependency>) => {
    console.log("in services Dependency>>>>"+res);
    return res;
    })); 
}


//Fetch Gst List
getGstList() : Observable<Array<Gst>>{
  return this.http.get<Array<Gst>>(this.gst_endpoint).pipe(map((res: Array<Gst>) => {
    console.log("in services Gst>>>>"+res);
    return res;
    })); 
}

onUpload(uploadData:FormData) {
   
  this.http.post(this.save_upload_endpoint, uploadData, {
    reportProgress: true,
    observe: 'events'
  })
    .subscribe(event => {
      console.log(event); // handle event here
    });
}
 
saveProduct(file: File,product: Product): Observable<HttpEvent<{}>> {
  let formdata: FormData = new FormData();

  
formdata.append('info', new Blob([JSON.stringify(product)],
        {
            type: "application/json"
        }));

  formdata.append('file', file);

  const req = new HttpRequest('POST', this.save_upload_endpoint , formdata, {
    reportProgress: true,
    responseType: 'text'
  });

  return this.http.request(req);
}

updateWithImageProduct(file: File,product: Product): Observable<HttpEvent<{}>> {
  let formdata: FormData = new FormData();

  
formdata.append('info', new Blob([JSON.stringify(product)],
        {
            type: "application/json"
        }));

  formdata.append('file', file);

  const req = new HttpRequest('POST', this.update_upload_endpoint , formdata, {
    reportProgress: true,
    responseType: 'text'
  });

  return this.http.request(req);
}

/*getImage(id): Observable<any>{
  console.log('in service edit');  
return this.http.get("http://localhost:8080/image/getimage1").map((res) => {
  console.log("in services >>>>"+res);
  return res;
  }); 
}*/

getProductListByRestaurantId(restaurantId:any): Observable<Array<Product>>{ 
  const url = `${this.product_all_endpoint}/${restaurantId}`;
  return this.http.get<Array<Product>>(url).pipe(map((res: Array<Product>) => {
    console.log("in product_all_endpoint>>>>"+res);
    return res;
    })); 
}

deleteProduct(product:Product){    
  const url = `${this.product_endpoint}/${product.productId}`;
  return this.http.delete(url, {responseType : 'text'});
}

updateProduct(product:Product){    
  const url = `${this.product_endpoint}/${product.productId}`;
  return this.http.put(url, product);
} 

//fetch Product by id
getProductByProductId(id:any){
  console.log('in service edit');
  const url = `${this.product_endpoint}/${id}`; 

/*return this.http.get(url).map((res: Product) => {
    console.log("in services getProductByProductId>>>>"+res);
    return res;
    }); */

    return this.http.get<Product>(url);
}

//fetch Product by id
/*getOrderByUserId(id){
  console.log('in service edit');
  const url = `${this.product_endpoint}/${id}`; 
 
    return this.http.get<Product>(url);
}*/

//save Order
saveOrder(order: Order): Observable<any> {
  return this.http.post<Order>(this.order_endpoint, order, { responseType: 'json' })
    .pipe(
      catchError(error => {
        console.error('Error occurred during order save:', error);  // Log error
        return throwError(() => new Error('Order save failed!'));  // Return error to subscriber
      })
    );
}

createRazorpayOrder(totalAmount: string) {
  return this.http.post<any>('/api/create-order', { totalAmount });
}

//update Order
updateOrder(order:Order){
  return this.http.post<Order>(this.update_order_status, order, {responseType:'json'});
}
 

saveTotalAmount(orderId: number, totalAmount: number): Observable<any> {
  const url = `${this.update_order_amount}/${orderId}/${totalAmount}`;
  return this.http.post(url, null, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  });
}

//save OrderDetail
saveOrderDetail(orderDetail:OrderDetail):Observable<OrderDetail>{
  return this.http.post<OrderDetail>(this.orderdetail_endpoint, orderDetail, {responseType:'json'});
}
deleteOrderDetail(orderDetail:OrderDetail):Observable<string>{    
  
  //const url = `${this.orderdetail_endpoint}/delete/${orderDetail.orderDetailId}`;
   //return this.http.get(url);
   const url = `${this.orderdetail_endpoint}/${orderDetail.orderDetailId}`;
  return this.http.delete(url,  {responseType : 'text'});
  //let order = new Order();
  //return this.http.post<Order>(this.update_order_status, order, {responseType:'json'});
  //return this.http.post<OrderDetail>(this.delete_order_detail_endpoint, orderDetail, {responseType:'json'});
  
  
}
//update Order
updateOrder1(){
  let order = new Order();
  return this.http.post<Order>(this.update_order_status, order, {responseType:'json'});
}

searchOrderByStatus(status:any,userId:any,restaurantId:any){
  const url = `${this.search_endpoint}/${status}/${userId}/${restaurantId}`;    
      return this.http.get<Order>(url);
}

searchOrderStatusByTableId(tableId:any,restaurantId:any){
  const url = `${this.search_endpoint}/${status}/${tableId}/${restaurantId}`;    
      return this.http.get<Order>(url);
}
searchRepoOrderByStatus(status:any ,userId: any,restaurantId : any){
  const url = `${this.searchrepo_endpoint}/${status}/${userId}/${restaurantId}`;    
      return this.http.get<Order>(url);
}

//fetch User by id
getUserByUserId(userId : any){
  
  const url = `${this.user_endpoint}/${userId}`;  
    return this.http.get<User>(url);
}
findRestaurantById(restaurantId : any){
  const url = `${this.restaurant_search_endpoint}/${restaurantId}`;
  return this.http.get<Restaurant>(url);
}

//fetch User by id
getOrderByOrderId(orderId:any):Observable<Order>{
  const url = `${this.order_endpoint}/${orderId}`;  
    return this.http.get<Order>(url);
}

getOrderDetails(tableId: number, userId: number, restaurantId:string): Observable<any> {
  const url = `${this.order_endpoint}/${tableId}/${userId}/${restaurantId}`;
  return this.http.get<any>(url);
}

//save Needs
saveNeeds(needs:Needs){
  return this.http.post<Needs>(this.needsList, needs,{responseType:'json'})
}
updateNeeds(needs:Needs){ 
  const url = `${this.needsList}/${needs.needsId}`;
  return this.http.put(url, needs);
}
deleteNeeds(needs:Needs){
  let url = `${this.needsList}/${needs.needsId}`
  return this.http.delete(url, {responseType:'text'});
}
// getNeedsList() : Observable<Array<Needs>>{
//   let url = `${this.needsList}/all`;
//   return this.http.get<Array<Needs>>(url).pipe(map((data:Array<Needs>) =>{
//     return data;
//   })); 
// }

getNeedsList(restaurantId: number): Observable<Array<Needs>> {
  const url = `${this.needsList}/by-restaurant-id/${restaurantId}`; // Construct the URL dynamically
  return this.http.get<Array<Needs>>(url).pipe(
    map((data: Array<Needs>) => {
      return data;
    })
  );
}

//save NeedsTableMap
saveNeedsTableMap(needsTableMap:NeedsTableMap): Observable<Needs>{
  return this.http.post(this.needsTableMapList, needsTableMap,{responseType:'json'})
}
updateNeedsTableMap(needsTableMap:NeedsTableMap){ 
  const url = `${this.needsTableMapList}/${needsTableMap.id}`;
  return this.http.put(url, needsTableMap);
}
deleteNeedsTableMap(needsTableMap:NeedsTableMap){
  let url = `${this.needsTableMapList}/${needsTableMap.id}`
  return this.http.delete(url, {responseType:'text'});
}
getNeedsListTableMap() : Observable<Array<NeedsTableMap>>{
  let url = `${this.needsTableMapList}/all`;
  return this.http.get<Array<NeedsTableMap>>(url).pipe(map((data:Array<NeedsTableMap>) =>{
    return data;
  })); 
}

getNeedsListByTableId(tableid:any) : Observable<Array<NeedsTableMap>>{
  let url = `${this.needsTableMapList}/tableid/${tableid}`;
  return this.http.get<Array<NeedsTableMap>>(url).pipe(map((data:Array<NeedsTableMap>) =>{
    return data;
  })); 
}

saveInstruction(data: any): Observable<any> {
  console.log('data',data);
  return this.http.post(`${this.food_instructions}`, data);
}

getMultiInstruction(data: any): Observable<any> {
  console.log('data',data);
  return this.http.post(`${this.multi_nstruction}`, data);
}

getInstructionById(id: any): Observable<any> {
  console.log('getInstructionById',id);
  return this.http.get(`${this.food_instructions}/${id}`);
}

updateInstruction(id: any, data: any): Observable<any> {
  console.log('updateInstruction',id);
  console.log('updateInstruction',data);
  return this.http.put(`${this.food_instructions}/${id}`, data);
}

deleteInstruction(id: any): Observable<any> {
  console.log('deleteInstruction',id);
  return this.http.delete(`${this.food_instructions}/${id}`);
}

getSharedProduct(productId: number): Observable<any> {
  return this.http.get(`${this.food_sharings}/${productId}`);
}

saveSharedProduct(product: any): Observable<any> {
  return this.http.post(this.food_sharings, product);
}

updateSharedProduct(product: any): Observable<any> {
  return this.http.put(this.food_sharings, product);
}

getSubscribedTables(restaurantId: string): Observable<any> {
  const url = `${this.validSubscription}/${restaurantId}`;
  return this.http.get(url);
}

getSharesByRestaurant(restaurantId: number): Observable<any> {
  const url = `${this.otherInitated}/${restaurantId}`;
  return this.http.get<any>(url);
}

getShareById(shareId: number, payload: any){
  const url = `${this.acceptShare}/${shareId}`;
  return this.http.put(url,payload);
}

deleteShareByUser(userId: number): Observable<any> {
  const url = `${this.by_initiated_user}/${userId}`;
  return this.http.delete<any>(url);
}

deactivateNeeds(tableId: number, restaurantId: number): Observable<any> {
  const params = new HttpParams()
    .set('tableId', tableId.toString())
    .set('restaurantId', restaurantId.toString());

  const url = `${this.deactivate_Needs}/deactivate`;

  return this.http.put(url, {}, { params });
}



verifyOtp(phoneNumber: string, otp: string): Observable<any> {
  return this.http.get<any>(`${this.validateOtp}/${phoneNumber}/${otp}`);
}
sendOtpToPhone(phoneNumber: string): Observable<any> {
  return this.http.get<any>(`${this.validateOtp}/${phoneNumber}`);
}

validatedOtp(userId: string, otp: string): Observable<any> {
  const url = `${this.validateOtp}/${userId}/${otp}`;
  return this.http.get<any>(url); 
}

getOtpExpiryTime(): number {
  return this.otpExpiryTime;
}

decreaseOtpExpiryTime() {
  if (this.otpExpiryTime > 0) {
    this.otpExpiryTime--;
  }
}

}
