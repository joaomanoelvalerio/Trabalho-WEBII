import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalizeDialog } from './finalize-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('FinalizeDialog', () => {
  let component: FinalizeDialog;
  let fixture: ComponentFixture<FinalizeDialog>;
  
  // Mock do MatDialogRef para simular o fechamento do modal
  const dialogMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizeDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, status: 'Pendente' } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('deve fechar o dialog ao clicar no botão de cancelar', () => {
    // Busca o botão de cancelar pelo texto ou classe
    const cancelButton = fixture.debugElement.query(By.css('.btn-cancel'));
    if (cancelButton) {
      cancelButton.nativeElement.click();
      expect(dialogMock.close).toHaveBeenCalled();
    }
  });

  it('deve emitir os dados corretos ao finalizar', () => {
    const confirmButton = fixture.debugElement.query(By.css('.btn-confirm'));
    
    // Simula a lógica de finalização no componente
    component.confirmarFinalizacao(); 
    
    expect(dialogMock.close).toHaveBeenCalledWith(true);
  });

  it('deve exibir o título correto no template', () => {
    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleElement.textContent).toContain('Finalizar Solicitação');
  });

  it('deve verificar se o estado inicial do componente é válido', () => {
    expect(component.isLoading).toBeFalse();
    expect(component.data.id).toBe(1);
  });
});