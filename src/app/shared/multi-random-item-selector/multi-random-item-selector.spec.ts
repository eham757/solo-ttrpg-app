import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRandomItemSelector } from './multi-random-item-selector';

describe('MultiRandomItemSelector', () => {
  let component: MultiRandomItemSelector;
  let fixture: ComponentFixture<MultiRandomItemSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiRandomItemSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiRandomItemSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
