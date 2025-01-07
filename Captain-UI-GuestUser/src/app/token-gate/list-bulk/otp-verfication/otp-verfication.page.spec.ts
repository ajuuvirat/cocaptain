import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerficationPage } from './otp-verfication.page';

describe('OtpVerficationPage', () => {
  let component: OtpVerficationPage;
  let fixture: ComponentFixture<OtpVerficationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OtpVerficationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
