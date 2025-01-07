import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-massage',
  templateUrl: './error-massage.page.html',
  styleUrls: ['./error-massage.page.scss'],
})
export class ErrorMassagePage implements OnInit {

  message:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
     
     
    ) {
      this.message = this.route.snapshot.params['message'];
       
    }

  ngOnInit() {
  }

}
