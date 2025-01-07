import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductPage } from './detail-product.page';

describe('DetailProductPage', () => {
  let component: DetailProductPage;
  let fixture: ComponentFixture<DetailProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
