import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkTabPage } from './bulk-tab.page';

describe('BulkTabPage', () => {
  let component: BulkTabPage;
  let fixture: ComponentFixture<BulkTabPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BulkTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
