import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-takeorder',
  templateUrl: './takeorder.page.html',
  styleUrls: ['./takeorder.page.scss'],
})
export class TakeorderPage implements OnInit {
  orderId: string | null;

  constructor(private service: EmployeeService,private router: Router) { }

  ngOnInit() {
  this.orderId = localStorage.getItem('paymentOrderID')
  console.log('this.orderId',this.orderId);
  }

  continueShopping() {
    this.router.navigate(['/list-bulk']);
  }

}
