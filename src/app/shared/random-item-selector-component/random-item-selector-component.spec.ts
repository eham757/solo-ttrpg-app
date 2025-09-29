import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomItemSelectorComponent } from './random-item-selector-component';

describe('RandomItemSelectorComponent', () => {
  let component: RandomItemSelectorComponent;
  let fixture: ComponentFixture<RandomItemSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomItemSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
