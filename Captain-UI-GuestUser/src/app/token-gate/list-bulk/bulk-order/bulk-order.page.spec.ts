import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkOrderPage } from './bulk-order.page';

describe('BulkOrderPage', () => {
  let component: BulkOrderPage;
  let fixture: ComponentFixture<BulkOrderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BulkOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
