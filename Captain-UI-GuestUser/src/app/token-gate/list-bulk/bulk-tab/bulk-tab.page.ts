import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import {NativeAudio} from '@capacitor-community/native-audio';

@Component({
  selector: 'app-bulk-tab',
  templateUrl: './bulk-tab.page.html',
  styleUrls: ['./bulk-tab.page.scss'],
})
export class BulkTabPage implements OnInit {
  activeTab: string = 'list-bulk';
  @Output() tabChanged = new EventEmitter<string>();
  userStatus:number;
  isTabChanged:boolean = false;

  constructor(private service: EmployeeService) {
    this.service.userStatus.subscribe(
      orderId =>
    this.userStatus = orderId);
     console.log(this.userStatus);
   }

  ngOnInit() {
  }
  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab); 
  }
  setCurrentTab(event: any){
    console.log('event+++',event);
    
    this.activeTab = event.tab;
    console.log(event);
    this.playSound();
}

async playSound(){
  if(this.isTabChanged){
    await NativeAudio.play({
      assetId: 'doorbell',
      // time: 6.0 - seek time
  });
  }else{
    this.isTabChanged = true
  }
  
}

}
