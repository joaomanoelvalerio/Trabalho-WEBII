import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNewRequest } from './client-new-request';

describe('ClientNewRequest', () => {
  let component: ClientNewRequest;
  let fixture: ComponentFixture<ClientNewRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientNewRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientNewRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
