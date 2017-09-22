import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferdataComponent } from './transferdata.component';

describe('TransferdataComponent', () => {
  let component: TransferdataComponent;
  let fixture: ComponentFixture<TransferdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
