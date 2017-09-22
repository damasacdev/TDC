import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MysqlCommandComponent } from './mysql-command.component';

describe('MysqlCommandComponent', () => {
  let component: MysqlCommandComponent;
  let fixture: ComponentFixture<MysqlCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysqlCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MysqlCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
