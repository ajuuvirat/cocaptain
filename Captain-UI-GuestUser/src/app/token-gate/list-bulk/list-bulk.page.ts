import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/model/product/Product';
import { OrderDetail } from 'src/app/model/order-detail';
import { Client } from '@stomp/stompjs';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { Order } from 'src/app/model/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-bulk',
  templateUrl: './list-bulk.page.html',
  styleUrls: ['./list-bulk.page.scss'],
})
export class ListBulkPage implements OnInit {
  showBulkTab: boolean = false;
  @Output() tabChanged = new EventEmitter<string>(); 
  activeTab: string = 'list-bulk';
  productList: any[] =[];
  selectedItems:Product[] = [];
  imageUrl:string = environment.imageUrl;
  productPairs: Product[][] = [];
  uniqueCategoryNames: string[] = [];
  selectedCategory: string = 'All';
  filteredProducts : Product[] = new Array();
  searchTerm: string = '';
  currentIndex: number = 0;
  private stompClient: Client;
  user:User;
  userId: string = '';
  tableId:string;
  isScrolled = false;
  restaurantLogoImageName: string | null;
  restaurantName: any;
  isVegMode: boolean = false;
  product: Product;
  order: Order;
  isBulk: boolean = false;
  SubscripedType: string | null;
  vegMode: 'all' | 'veg' | 'nonVeg' = 'all';

  constructor(private service: EmployeeService,private toastController: ToastController, private router: Router,
  
  ) { }

  ngOnInit() {
    this.fetchallProducts();
    this.restaurantLogoImageName = localStorage.getItem('restaurantLogoImageName');
    this.SubscripedType = localStorage.getItem('SubscripedType')
    console.log('this.restaurantLogoImageName',this.restaurantLogoImageName);
  }

  toggleBulkTab() {
    this.showBulkTab = !this.showBulkTab;
  }

  fetchallProducts(){
    const data:any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data)
    console.log('userDetails++++',userDetails);
    this.restaurantName = userDetails.restaurantId;
    this.userId = userDetails.userId
    this.tableId = userDetails.tableId
    this.service.getProductListByRestaurantId(userDetails.restaurantId).subscribe( (productList) => { 
      console.log('productList',productList);
      this.productList = productList;
      this.filteredProducts = this.productList;
      const filteredProductList = this.productList.filter(product => product.recommendation);
      for (let i = 0; i < filteredProductList.length; i += 2) {
          const pair = filteredProductList.slice(i, i + 2);
          console.log('pair',pair);
          this.productPairs.push(pair);
      }
      const categoryNames = productList.map((product) => product.categoryId?.categoryName).filter((name): name is string => !!name);
      this.uniqueCategoryNames = Array.from(new Set(categoryNames));
      if (!this.uniqueCategoryNames.includes('All')) {
        this.uniqueCategoryNames.unshift('All');
      }
      console.log('Unique Category Names:', this.uniqueCategoryNames);
    })
  }

  selectItem(item: string): void {
    if (this.selectedCategory === item) {
      this.selectedCategory = 'All';
    } else {
      this.selectedCategory = item; 
    }
    this.filterProducts();
  }

  clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedCategory = 'All'; 
    this.filterProducts();
  }

  // filterProducts(): void {
  //   const searchTermLower = this.searchTerm.toLowerCase().trim();
    
  //   this.filteredProducts = this.productList.filter(product => {
  //     const matchesCategory = this.selectedCategory === 'All' || product.categoryId?.categoryName === this.selectedCategory;
  //     const matchesVegMode = this.isVegMode ? product.vegId?.vegName === 'veg' : product.vegId?.vegName === 'non-veg';
  //     const matchesSearchTerm = product?.productName?.toLowerCase().includes(searchTermLower);
  //     return matchesCategory && matchesSearchTerm && matchesVegMode;
      
  //   });
  //   console.log('Filtered Products:', this.filteredProducts.map(product => product.productName));
  //   console.log('isVegMode:', this.isVegMode);

  // }

  filterProducts(): void {
    const searchTermLower = this.searchTerm?.toLowerCase().trim();
    this.filteredProducts = this.productList.filter(product => {
      const matchesCategory = this.selectedCategory === 'All' || product.categoryId?.categoryName === this.selectedCategory;
      const matchesVegMode = this.vegMode === 'all' 
        || (this.vegMode === 'veg' && product.vegId?.vegName === 'veg')
        || (this.vegMode === 'nonVeg' && product.vegId?.vegName === 'non-veg');
      const matchesSearchTerm = product?.productName?.toLowerCase().includes(searchTermLower);
      return matchesCategory && matchesSearchTerm && matchesVegMode;
    });
    console.log('Filtered Products:', this.filteredProducts.map(product => product.productName));
  }

  onToggleChange() {
    this.filterProducts();
  }

  addProduct(product:any){
    if (!product.orderDetailList) {
      product.orderDetailList = [];
    }
    const orderDetail = {
      id: product.id,
      name: product.productName,
      price: product.productPrice,
      status: '0',
    };
    product.orderDetailList.push(orderDetail);
    product.status_0 = (product.status_0 ?? 0) + 1;
    // const existingProduct = this.selectedItems.find(item => item.id === product.id);
    // if (!existingProduct) {
      this.selectedItems.push(product);
    // }
    
localStorage.setItem('selectedBulkProduct',JSON.stringify(this.selectedItems))
this.presentToast(`Added to order: ${product.productName}`);
  }

  deleteOrderByProduct(product:Product){
    console.log('product',product);
    console.log('selectedItems',this.selectedItems);
    this.selectedItems = this.selectedItems.filter(item => item.productId != product.productId);
    localStorage.setItem('selectedBulkProduct',JSON.stringify(this.selectedItems))
  }

  fetchAllProductWithUser(){
    const data:any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data)
    console.log('userDetails++++',userDetails);
      this.user = userDetails;
      this.userId = userDetails.userId;
      this.tableId = userDetails.tableId;
      this.fetchallProducts();
    // });
    
    
  }
  onContentScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isScrolled = scrollTop > 0; // Change color when scrolled down
  }

  sendMessageForOrder() { 
  const destination = "/app/send/messageFromUser-order";
  this.stompClient.publish({
    destination,
    body:  JSON.stringify({
      'name': "user",
      'toUser' : this.user.restaurantId,
      'tableId': this.user.tableId
  })
  });
  }

  getOrderDetailWithStatusZero(product: Product): OrderDetail | null {    
    if (product && Array.isArray(product.orderDetailList)) {
      return product.orderDetailList.find(od => od.status === '0') || null;
    }
    return null;
  }

  async presentToast(msg:any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'custom-toast',
      position: 'top'
    });
    toast.present();
  }


  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);  // Emit the tab name as a string
  }

  productDetail(product: Product) {
    console.log('click',product);
    this.product = product;
    console.log('this.product',this.product);
    this.router.navigate([
      '/home/tabs/details/',
      this.product.productId,
    ]);
  }

  doRefresh(event:any) {
    console.log('Begin async operation');
    this.fetchallProducts();
    setTimeout(() => {
    console.log('Async operation has ended');
    event.target.complete();
    }, 1000);
  }

  // productDetail(product: Product) {
  //   console.log('click', product);
  //   this.product = product;
  //   console.log('this.product', this.product);
  
  //   const navigationParams = ['/home/tabs/details', this.product.productId];
    
  //   // Conditionally add optional params
  //   const queryParams: any = {};
  //   if (this.order?.orderId) {
  //     queryParams['orderId'] = this.order.orderId ? this.order.orderId : 257 ;
  //   }
  //   queryParams['orderId'] = 257
  //   if (this.isBulk !== undefined) {
  //     queryParams['isBulk'] = this.isBulk;
  //   }
  // console.log('navigationParams',navigationParams,queryParams);
  
  //   this.router.navigate(navigationParams, { queryParams });
  // }
  

}
