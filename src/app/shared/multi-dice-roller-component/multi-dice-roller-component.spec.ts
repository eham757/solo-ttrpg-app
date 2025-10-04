import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDiceRollerComponent } from './multi-dice-roller-component';

describe('MultiDiceRollerComponent', () => {
  let component: MultiDiceRollerComponent;
  let fixture: ComponentFixture<MultiDiceRollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiDiceRollerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDiceRollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
