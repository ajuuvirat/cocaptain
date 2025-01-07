// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
 /** Authentication***/   
  registerUserEndpoint:"http://142.93.221.82:8082/user/register",
  loginUserEndpoint:"http://142.93.221.82:8082/user/login",
  qrRegisterLogin:"http://142.93.221.82:8082/user/qr_register_login",

  registerRestaurantEndpoint:"http://142.93.221.82:8082/restaurant/register",
  loginRestaurantEndpoint:"http://142.93.221.82:8082/restaurant/login",
  
  loginEmployeeEndpoint:"http://142.93.221.82:8082/employee1/login",

  /** Server */
  registerEmployeeEndpoint:"http://142.93.221.82:8080/employee/register",
  employeeList_all:"http://142.93.221.82:8080/employee/all",
  employee_endpoint:"http://142.93.221.82:8080/employee",
  role_endpoint:"http://142.93.221.82:8080/employee/role/all",
  veg_endpoint:"http://142.93.221.82:8080/api/product/veg/all",
  category_endpoint:"http://142.93.221.82:8080/api/product/category/all",
  subcategory_endpoint:"http://142.93.221.82:8080/api/product/subcategory/all",
  subcategory_home_endpoint:"http://142.93.221.82:8080/api/product/subcategory",
 
  servedduring_endpoint:"http://142.93.221.82:8080/api/product/servedduring/all",
  cuisine_endpoint:"http://142.93.221.82:8080/api/product/cuisine/all",
  dependency_endpoint:"http://142.93.221.82:8080/api/product/dependency/all",
  gst_endpoint:"http://142.93.221.82:8080/api/product/gst/all",
  save_upload_endpoint:"http://142.93.221.82:8080/api/product/saveProduct", 
  update_upload_endpoint:"http://142.93.221.82:8080/api/product/updateProduct",
  product_all_endpoint:"http://142.93.221.82:8080/api/product/all",
  product_endpoint:"http://142.93.221.82:8080/api/product",
  order_endpoint:"http://142.93.221.82:8080/api/order",
  search_endpoint:"http://142.93.221.82:8080/api/order/search",
  user_endpoint:"http://142.93.221.82:8080/api/user",
  restaurant_search_endpoint:"http://142.93.221.82:8080/restaurant/search",
  searchrepo_endpoint:"http://142.93.221.82:8080/api/order/searchrepo/",
  orderdetail_endpoint:"http://142.93.221.82:8080/api/orderdetail",
  update_order_status:"http://142.93.221.82:8080/api/order/update-order-status",
  delete_order_detail_endpoint:"http://142.93.221.82:8080/api/orderdetail/delete-orderdetail",
  needsList:"http://142.93.221.82:8080/api/needs",
  needsTableMapList:"http://142.93.221.82:8080/api/needs-table-map",
  socket_val:"http://142.93.221.82:8083/socket",
  // imageUrl:"http://142.93.221.82:8080/upload-dir/",
  imageUrl:"http://142.93.221.82:8081/",
  food_instructions: 'http://142.93.221.82:8080/api/instructions',
  food_sharings: 'http://142.93.221.82:8080/api/shares',
  validSubscription : 'http://142.93.221.82:8080/api/subscribed-tables/restaurant',
  otherInitated:'http://142.93.221.82:8080/api/shares/by-restaurant',
  acceptShare:'http://142.93.221.82:8080/api/shares',
  update_order_amount:'http://142.93.221.82:8080/api/order',
  by_initiated_user: 'http://142.93.221.82:8080/api/shares/by-initiated-user',
  deactivate_Needs: 'http://142.93.221.82:8080/api/needs-table-map',
  validateOtp: 'http://142.93.221.82:8082/user/validate-otp',
  multi_nstruction: 'http://142.93.221.82:8080/api/order/multi-instruction'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
