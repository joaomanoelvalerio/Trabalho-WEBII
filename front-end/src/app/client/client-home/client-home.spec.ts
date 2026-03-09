import { ComponentFixture, TestBed } from '@angular/core/testing';
// 1. Importação corrigida
import { ClienteHomeComponent } from './client-home';

describe('ClienteHomeComponent', () => {
  let component: ClienteHomeComponent;
  let fixture: ComponentFixture<ClienteHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como seu componente é Standalone, ele vai em imports
      imports: [ClienteHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // É boa prática rodar o detectChanges aqui
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
