import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { User } from 'src/app/model/user';
import { Product } from 'src/app/model/product/Product';
import { Order } from 'src/app/model/order';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sharing',
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.scss'],
})
export class SharingComponent  implements OnInit {
// fromSharing = 'sharing';
user:User;
productList: Product[] = new Array();
filteredProducts : Product[] = new Array();
productPairs: Product[][] = [];
orderId:string;
order:Order;
initiatedUserId: any;
isRestaurantAdmin = false;
userId: string = '';
tableId:string;
imageUrl:string = environment.imageUrl;
tabs = [
  { label: 'Other' },
  { label: 'I share' },
  { label: 'I accept' },
];
shareDetails: any;
activeTab = 0;
sharesData: any;
  restaurantId: any;
  otherInitated: any[];
  myInitated: any[];
  restaurantShareId: any;
  restaurantTableId: any;
  iAccept: any;

selectTab(index: number): void {
  this.activeTab = index;
}
  constructor(private service: EmployeeService,) { }

  ngOnInit() {       
    this.fetchAllProductWithUser();
  }

  fetchAllProductWithUser(){
    const data:any = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(data)
    console.log('userDetails++++',userDetails.restaurantId);
    this.userId = userDetails.id
      this.user = userDetails;
      console.log('this.userthis.user',this.user);
      this.getSharedDetails(1)       
  }

  getSharedDetails(restaurantId: number){
  this.service.getSharesByRestaurant(restaurantId).subscribe(
    (data) => {
      console.log('Shares Data:',data);
      data.forEach((item:any) =>{
        console.log('9898',item.shareId);
        this.restaurantShareId = item.shareId
        this.restaurantTableId = item.restaurantId

      })
      this.sharesData = data;
      this.otherInitated = this.sharesData.filter((item:any) => item.initiatedUserId != this.userId && item.acceptedUserId != this.userId);
      this.myInitated = this.sharesData.filter((item:any) => item.initiatedUserId == this.userId);
      this.iAccept = this.sharesData.filter((item:any) => item.acceptedUserId == this.userId && item.accepted);
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}

// acceptProduct(): void {
//   this.service.getShareById(this.restaurantShareId).subscribe({
//     next: (response) => {
//       this.shareDetails = response;
//       console.log('Share Details:', this.shareDetails);
//     },
//     error: (error) => {
//       console.error('Error fetching share details:', error);
//     },
//   });
// }

acceptProduct(shareId: number) {
  const payload = {
    acceptedUserId: this.userId, // Assuming `userId` is defined in your component
    accepted: true
  };

  this.service.getShareById(shareId, payload).subscribe(
    (response) => {
      console.log('Share accepted successfully:', response);
      this.getSharedDetails(this.restaurantTableId); // Refresh the share details
    },
    (error) => {
      console.error('Error accepting share:', error);
    }
  );
}




}
