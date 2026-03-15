import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PoNotificationService } from '@po-ui/ng-components';

import { NutricaoComponent, NutricaoItem } from './nutricao.component';

describe('NutricaoComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NutricaoComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        PoNotificationService,
      ],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should initialize with 5 food items', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.itens.length).toBe(5);
  });

  it('should define the correct table columns', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const properties = fixture.componentInstance.columns.map(c => c.property);
    expect(properties).toContain('alimento');
    expect(properties).toContain('calorias');
    expect(properties).toContain('proteinas');
    expect(properties).toContain('carboidratos');
    expect(properties).toContain('gorduras');
    expect(properties).toContain('fibras');
  });

  it('should have a valid form on init', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.form).toBeTruthy();
    expect(fixture.componentInstance.form.invalid).toBeTrue();
  });

  it('should return "Novo Alimento" modal title when not editing', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.isEditing = false;
    expect(comp.getModalTitle()).toBe('Novo Alimento');
  });

  it('should return "Editar Alimento" modal title when editing', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.isEditing = true;
    expect(comp.getModalTitle()).toBe('Editar Alimento');
  });

  it('should add a new item when form is valid and salvar() is called', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const initialCount = comp.itens.length;

    comp.form.setValue({
      alimento: 'Ovo Cozido',
      categoria: 'proteina',
      calorias: 78,
      proteinas: 6,
      carboidratos: 0.6,
      gorduras: 5,
      fibras: 0,
    });

    comp.salvar();

    expect(comp.itens.length).toBe(initialCount + 1);
    expect(comp.itens.find(i => i.alimento === 'Ovo Cozido')).toBeTruthy();
  });

  it('should update an existing item when editing and salvar() is called', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const item = comp.itens[0];

    comp.editarAlimento(item);
    comp.form.patchValue({ alimento: 'Arroz Integral Cozido' });
    comp.salvar();

    const updated = comp.itens.find(i => i.id === item.id);
    expect(updated?.alimento).toBe('Arroz Integral Cozido');
  });

  it('should remove an item when excluirAlimento() is called', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const item = comp.itens[0];
    const initialCount = comp.itens.length;

    comp.excluirAlimento(item);

    expect(comp.itens.length).toBe(initialCount - 1);
    expect(comp.itens.find(i => i.id === item.id)).toBeUndefined();
  });

  it('should not save when form is invalid', () => {
    const fixture = TestBed.createComponent(NutricaoComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const initialCount = comp.itens.length;

    comp.salvar();

    expect(comp.itens.length).toBe(initialCount);
  });
});
