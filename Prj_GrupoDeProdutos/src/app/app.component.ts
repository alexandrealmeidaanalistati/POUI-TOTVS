import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';

import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
    ProtheusLibCoreModule,
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  readonly menus: Array<PoMenuItem> = [
    { label: 'Cadastro do Grupo', action: this.onClick.bind(this), icon: 'po-icon-clipboard', shortLabel: 'Cadastro' },
    { label: 'Ajuda (Help)',      action: this.onClick.bind(this), icon: 'po-icon-help',      shortLabel: 'Ajuda' },
    { label: 'Sair',              action: this.onClick.bind(this), icon: 'po-icon-exit',      shortLabel: 'Sair' }
  ];

  private onClick() {
    alert("Clicked in menu item");
  }
}

