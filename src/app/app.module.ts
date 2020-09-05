import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeTableModule } from 'primeng/treetable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForceSyncComponent } from './force-sync/force-sync.component';
import { LoginComponent } from './login/login.component';
import { CurrencyCustomPipe } from './pipes/currency-custom.pipe';
import { SelecaoProdutosComponent } from './selecao-produtos/selecao-produtos.component';
import {DropdownModule} from 'primeng/dropdown';
import {TooltipModule} from 'primeng/tooltip';
registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    SelecaoProdutosComponent,
    ForceSyncComponent,
    LoginComponent,
    CurrencyCustomPipe,
  ],
  imports: [
    TableModule,
    CardModule,
    BrowserModule,
    AppRoutingModule,
    AutoCompleteModule,
    TreeTableModule,
    DataViewModule,
    PanelModule,
    CheckboxModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToggleButtonModule,
    MessagesModule,
    MessageModule,
    TabViewModule,
    SplitButtonModule,
    InputTextModule,
    DropdownModule,
   TooltipModule
  ],
  providers: [
    MessageService,
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
