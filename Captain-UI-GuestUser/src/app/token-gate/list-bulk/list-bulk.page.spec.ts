import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBulkPage } from './list-bulk.page';

describe('ListBulkPage', () => {
  let component: ListBulkPage;
  let fixture: ComponentFixture<ListBulkPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListBulkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
