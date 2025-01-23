import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedsListPage } from './needs-list.page';

describe('NeedsListPage', () => {
  let component: NeedsListPage;
  let fixture: ComponentFixture<NeedsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedsListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
