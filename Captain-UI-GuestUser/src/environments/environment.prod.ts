export const environment = {
  production: true,

  // Base URL for APIs
  baseUrl: 'http://dev.guestuser.cocaptain.co.in/',

  /** Authentication */
  registerUserEndpoint: '/user/register',
  loginUserEndpoint: '/user/login',
  qrRegisterLogin: '/user/qr_register_login',

  registerRestaurantEndpoint: '/restaurant/register',
  loginRestaurantEndpoint: '/restaurant/login',

  loginEmployeeEndpoint: '/employee1/login',

  /** Server */
  registerEmployeeEndpoint: '/employee/register',
  employeeList_all: '/employee/all',
  employee_endpoint: '/employee',
  role_endpoint: '/employee/role/all',
  veg_endpoint: '/api/product/veg/all',
  category_endpoint: '/api/product/category/all',
  subcategory_endpoint: '/api/product/subcategory/all',
  subcategory_home_endpoint: '/api/product/subcategory',
  servedduring_endpoint: '/api/product/servedduring/all',
  cuisine_endpoint: '/api/product/cuisine/all',
  dependency_endpoint: '/api/product/dependency/all',
  gst_endpoint: '/api/product/gst/all',
  save_upload_endpoint: '/api/product/saveProduct',
  update_upload_endpoint: '/api/product/updateProduct',
  product_all_endpoint: '/api/product/all',
  product_endpoint: '/api/product',
  order_endpoint: '/api/order',
  search_endpoint: '/api/order/search/',
  user_endpoint: '/api/user',
  restaurant_search_endpoint: '/restaurant/search',
  searchrepo_endpoint: '/api/order/searchrepo/',
  orderdetail_endpoint: '/api/orderdetail',
  update_order_status: '/api/order/update-order-status',
  delete_order_detail_endpoint: '/api/orderdetail/delete-orderdetail',
  needsList: '/api/needs',
  needsTableMapList: '/api/needs-table-map',
  socket_val: '/socket',
  imageUrl: '/images/',
  food_instructions: '/api/instructions',
  food_sharings: '/api/shares',
  validSubscription: '/api/subscribed-tables/restaurant',
  otherInitated: '/api/shares/by-restaurant',
  acceptShare: '/api/shares',
  update_order_amount: '/api/order',
  by_initiated_user: '/api/shares/by-initiated-user',
  deactivate_Needs: '/api/needs-table-map'
};
