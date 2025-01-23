import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMassagePage } from './error-massage.page';

describe('ErrorMassagePage', () => {
  let component: ErrorMassagePage;
  let fixture: ComponentFixture<ErrorMassagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorMassagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMassagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
