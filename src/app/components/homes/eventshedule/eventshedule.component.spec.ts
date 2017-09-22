import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsheduleComponent } from './eventshedule.component';

describe('EventsheduleComponent', () => {
  let component: EventsheduleComponent;
  let fixture: ComponentFixture<EventsheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
