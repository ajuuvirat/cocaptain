import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrLoginPage } from './qr-login.page';

describe('QrLoginPage', () => {
  let component: QrLoginPage;
  let fixture: ComponentFixture<QrLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
