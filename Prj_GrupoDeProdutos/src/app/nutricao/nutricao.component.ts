import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
  PoTableColumn,
  PoTableModule,
} from '@po-ui/ng-components';

export interface NutricaoItem {
  id: number;
  alimento: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibras: number;
  categoria: string;
}

@Component({
  selector: 'app-nutricao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoPageModule,
    PoTableModule,
    PoButtonModule,
    PoModalModule,
    PoFieldModule,
  ],
  templateUrl: './nutricao.component.html',
  styleUrls: ['./nutricao.component.css'],
  providers: [PoNotificationService],
})
export class NutricaoComponent implements OnInit {
  @ViewChild('modalNutricao') modalNutricao!: PoModalComponent;

  pageTitle = 'Nutrição';
  isEditing = false;
  editingId: number | null = null;

  readonly categorias: Array<PoSelectOption> = [
    { label: 'Cereal', value: 'cereal' },
    { label: 'Fruta', value: 'fruta' },
    { label: 'Verdura', value: 'verdura' },
    { label: 'Legume', value: 'legume' },
    { label: 'Proteína', value: 'proteina' },
    { label: 'Laticínio', value: 'laticinio' },
    { label: 'Bebida', value: 'bebida' },
    { label: 'Outro', value: 'outro' },
  ];

  readonly columns: Array<PoTableColumn> = [
    { property: 'alimento', label: 'Alimento', sortable: true },
    { property: 'categoria', label: 'Categoria', sortable: true },
    { property: 'calorias', label: 'Calorias (kcal)', type: 'number', sortable: true },
    { property: 'proteinas', label: 'Proteínas (g)', type: 'number', sortable: true },
    { property: 'carboidratos', label: 'Carboidratos (g)', type: 'number', sortable: true },
    { property: 'gorduras', label: 'Gorduras (g)', type: 'number', sortable: true },
    { property: 'fibras', label: 'Fibras (g)', type: 'number', sortable: true },
  ];

  pageActions: Array<PoPageAction> = [];

  confirmAction!: PoModalAction;
  cancelAction!: PoModalAction;

  form!: FormGroup;

  itens: Array<NutricaoItem> = [
    { id: 1, alimento: 'Arroz Branco Cozido', calorias: 128, proteinas: 2.6, carboidratos: 28, gorduras: 0.2, fibras: 0.4, categoria: 'cereal' },
    { id: 2, alimento: 'Feijão Cozido', calorias: 76, proteinas: 4.8, carboidratos: 13.6, gorduras: 0.5, fibras: 3.4, categoria: 'legume' },
    { id: 3, alimento: 'Frango Grelhado', calorias: 159, proteinas: 32, carboidratos: 0, gorduras: 3.6, fibras: 0, categoria: 'proteina' },
    { id: 4, alimento: 'Banana', calorias: 89, proteinas: 1.1, carboidratos: 22.8, gorduras: 0.3, fibras: 2.6, categoria: 'fruta' },
    { id: 5, alimento: 'Brócolis Cozido', calorias: 35, proteinas: 3.7, carboidratos: 5.1, gorduras: 0.5, fibras: 3.3, categoria: 'verdura' },
  ];

  private nextId = 6;

  constructor(
    private fb: FormBuilder,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildActions();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      alimento: ['', [Validators.required, Validators.maxLength(100)]],
      categoria: ['', Validators.required],
      calorias: [null, [Validators.required, Validators.min(0)]],
      proteinas: [null, [Validators.required, Validators.min(0)]],
      carboidratos: [null, [Validators.required, Validators.min(0)]],
      gorduras: [null, [Validators.required, Validators.min(0)]],
      fibras: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private buildActions(): void {
    this.pageActions = [
      {
        label: 'Novo Alimento',
        action: this.openNovoAlimento.bind(this),
        icon: 'po-icon-plus',
      },
    ];

    this.confirmAction = {
      label: 'Salvar',
      action: this.salvar.bind(this),
    };

    this.cancelAction = {
      label: 'Cancelar',
      action: () => this.modalNutricao.close(),
    };
  }

  openNovoAlimento(): void {
    this.isEditing = false;
    this.editingId = null;
    this.form.reset();
    this.modalNutricao.open();
  }

  editarAlimento(item: NutricaoItem): void {
    this.isEditing = true;
    this.editingId = item.id;
    this.form.patchValue({
      alimento: item.alimento,
      categoria: item.categoria,
      calorias: item.calorias,
      proteinas: item.proteinas,
      carboidratos: item.carboidratos,
      gorduras: item.gorduras,
      fibras: item.fibras,
    });
    this.modalNutricao.open();
  }

  excluirAlimento(item: NutricaoItem): void {
    this.itens = this.itens.filter(i => i.id !== item.id);
    this.poNotification.success(`Alimento "${item.alimento}" excluído com sucesso.`);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.poNotification.warning('Preencha todos os campos obrigatórios.');
      return;
    }

    const valores = this.form.value as Omit<NutricaoItem, 'id'>;

    if (this.isEditing && this.editingId !== null) {
      this.itens = this.itens.map(item =>
        item.id === this.editingId ? { ...item, ...valores } : item
      );
      this.poNotification.success(`Alimento "${valores.alimento}" atualizado com sucesso.`);
    } else {
      const novoItem: NutricaoItem = { id: this.nextId++, ...valores };
      this.itens = [...this.itens, novoItem];
      this.poNotification.success(`Alimento "${valores.alimento}" cadastrado com sucesso.`);
    }

    this.modalNutricao.close();
  }

  getModalTitle(): string {
    return this.isEditing ? 'Editar Alimento' : 'Novo Alimento';
  }
}
