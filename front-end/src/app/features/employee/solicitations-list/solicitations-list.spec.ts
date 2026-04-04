import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitationsList } from './solicitations-list';

describe('SolicitationsList', () => {
  let component: SolicitationsList;
  let fixture: ComponentFixture<SolicitationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitationsList],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitationsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
