import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Produto } from '../model/produto';
import { ApiService } from '../services/api.service';
import { Calendar } from '../utils/Calendar';

@Component({
  selector: 'app-selecao-produtos',
  templateUrl: './selecao-produtos.component.html',
  styleUrls: ['./selecao-produtos.component.scss'],
})
export class SelecaoProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  produtosPromocao: Produto[] = [];
  produtosPromocaoFilter: Produto[] = [];
  totalPages = 0;
  totalRecords = 0;
  rowsPerPage = 10;
  pt = Calendar.PT_BR;
  config: any = {};
  @ViewChild('inputAutoComplete') inputAutoComplete: AutoComplete;
  acoes = [
    {
      label: 'Sync',
      icon: 'pi pi-refresh',
      command: () => {
        this.syncProduto();
      },
    },
  ];

  setores: {value: string, label: string}[] = [];

  constructor(
    private api: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.api.get('/config').subscribe((resp) => {
      this.config = resp;
    });

    this.api.get('/setores').subscribe(resp => {
      this.setores = resp.map(r => {
        return {value: r, label: r}
      });
    })
  }

  salvarConfigTempoScan() {
    this.api.post('/config', this.config).subscribe(
      (resp) => {
        this.config = resp;
        this.messageService.add({
          severity: 'success',
          summary: 'Mensagem',
          detail: 'Configuração salva com sucesso!',
          life: 3000,
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensagem',
          detail: `Houve um erro ao salvar a configuração!`,
          life: 3000,
        });
      },
      () => window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  syncProduto() {}

  desativarProduto() {}

  ativarProduto() {}

  enviarProdutos() {
    let produtos = this.produtos.filter((p) => p.selecionado);

    if (!produtos.length) {
      return this.messageService.add({
        severity: 'warn',
        summary: 'Mensagem',
        detail: `Selecione ao menos um produto para ser enviado.`,
      });
    }

    this.api.post('/produtos', produtos).subscribe(
      (success) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensagem',
          detail: 'Produtos salvos com sucesso!',
          life: 3000,
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensagem',
          detail: `Houve um erro ao salvar os produtos!`,
          life: 3000,
        });
      },
      () => {
        this.resetListaProdutosBuscados();;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  resetListaProdutosBuscados() {
    this.produtos= [];
    this.produtosPromocao = [];
    this.produtosPromocaoFilter = [];
  }

  buscarProdutos(e) {
    this.api.get(`/produtos?query=${e.query}`).subscribe((resp) => {
      this.produtos = resp;
    });
  }

  buscarProdutosPromocaoOnChangeTab(event) {
    this.inputAutoComplete.inputEL.nativeElement.value = '';
    if (event.index === 1) {
      this.buscarProdutosPromocao(0);
    }
  }

  buscarProdutosPromocaoPaginator(event) {
    this.buscarProdutosPromocao(this.findPage(event.first));
  }

  buscarProdutosPromocao(page) {
    this.api.get(`/produtos/promocoes?page=${page}&rows=${this.rowsPerPage}`).subscribe((resp) => {
      this.totalPages = resp.totalPages;
      this.totalRecords = resp.totalElements;
      this.produtosPromocao = resp.content;
      this.produtosPromocaoFilter = resp.content;
    });
  }

  findPage(firstIndexPage) {
    const indicePages = [];
    
    for (let index = 0; index < this.totalPages; index++) {
      
      if(index === 0) {
        indicePages.push(0);
      
        continue;
      }

      indicePages.push(index * this.rowsPerPage);
    }

   return indicePages.indexOf(firstIndexPage);
  }

  filtroProdutosPromocao(e) {
    const query = (<String>e.query).toUpperCase();
    this.produtosPromocaoFilter = this.produtosPromocao.filter(
      (produto) => produto.descricao.toUpperCase().indexOf(query) > -1
    );
  }

  restoreProdutosPromocao() {
    if (this.inputAutoComplete.inputEL.nativeElement.value.trim() === '') {
      this.produtosPromocaoFilter = [...this.produtosPromocao];
    }
  }

  showLogs(show, id) {
    if(show) {
      document.getElementById(`log-${id}`).classList.add('log-show');
      document.getElementById(`log-${id}`).classList.remove('log-hide');
    }else {
      document.getElementById(`log-${id}`).classList.add('log-hide');
      document.getElementById(`log-${id}`).classList.remove('log-show');
    }
  }
}
