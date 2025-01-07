import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakeorderPage } from './takeorder.page';

describe('TakeorderPage', () => {
  let component: TakeorderPage;
  let fixture: ComponentFixture<TakeorderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TakeorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
