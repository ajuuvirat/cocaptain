import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
  @Output() tabChange: EventEmitter<string> = new EventEmitter<string>();
  activeTab: string = 'order-history';
  tabChanged: any;
  orderDetails: any[] = [];
  expandedOrderIds: { [key: string]: boolean } = {};
  errorMessage: string = '';
  tableId: number;
  userId: number;
  activeOrderId: string | null = null;
  restaurantId: string;
  imageUrl:string = environment.imageUrl;
  isScrolled: boolean = false;
  constructor(private service: EmployeeService) { }

  ngOnInit() {
    const data:any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data)
    console.log('userDetails++++',userDetails);
    this.tableId = userDetails.tableId;
    this.userId = userDetails.userId;
    this.restaurantId = userDetails.restaurantId
    this.getOrderDetails(this.tableId, this.userId, this.restaurantId); 
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab); 
  }
  

  onContentScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.isScrolled = scrollTop > 0;
  }

  doRefresh(event:any) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
    console.log('Async operation has ended');
    event.target.complete();
    }, 1000);
  }

  
  toggleAccordion(orderId: number): void {
    this.expandedOrderIds[orderId] = !this.expandedOrderIds[orderId];
  }


  getOrderDetails(tableId: number, userId: number, restaurantId: string): void {    
    this.service.getOrderDetails(tableId, userId, restaurantId).subscribe(
      (data) => {
        this.orderDetails = data;

        console.log('this.orderDetails',this.orderDetails);
      },
      (error) => {
        this.errorMessage = 'Error fetching order details';
        console.error(error);
      }
    );
  }

}
