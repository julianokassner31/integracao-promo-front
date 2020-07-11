import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForceSyncComponent } from './force-sync/force-sync.component';
import { LoginComponent } from './login/login.component';
import { SelecaoProdutosComponent } from './selecao-produtos/selecao-produtos.component';
const routes: Routes = [
  {
    path: 'selecao',
    component: SelecaoProdutosComponent,
  },
  {
    path: 'sync',
    component: ForceSyncComponent,
  },
  {
    path: 'auth',
    component: LoginComponent,
  },

  { path: '', redirectTo: 'selecao', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
