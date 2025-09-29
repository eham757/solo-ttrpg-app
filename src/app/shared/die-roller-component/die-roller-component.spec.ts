import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieRollerComponent } from './die-roller-component';

describe('DieRollerComponent', () => {
  let component: DieRollerComponent;
  let fixture: ComponentFixture<DieRollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieRollerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieRollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
