import { TestBed } from '@angular/core/testing';

import { MudaPagina } from './muda-pagina';

describe('MudaPagina', () => {
  let service: MudaPagina;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MudaPagina);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
