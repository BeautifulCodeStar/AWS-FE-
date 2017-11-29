import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsinComponent } from './asin.component';

describe('AsinComponent', () => {
  let component: AsinComponent;
  let fixture: ComponentFixture<AsinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
