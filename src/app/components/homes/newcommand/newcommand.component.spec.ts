import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcommandComponent } from './newcommand.component';

describe('NewcommandComponent', () => {
  let component: NewcommandComponent;
  let fixture: ComponentFixture<NewcommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
