import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bulk-tab',
  templateUrl: './bulk-tab.page.html',
  styleUrls: ['./bulk-tab.page.scss'],
})
export class BulkTabPage implements OnInit {
  activeTab: string = 'list-bulk';
  @Output() tabChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab); 
  }
}
