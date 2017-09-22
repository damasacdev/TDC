import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayconfigComponent } from './delayconfig.component';

describe('DelayconfigComponent', () => {
  let component: DelayconfigComponent;
  let fixture: ComponentFixture<DelayconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelayconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelayconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
