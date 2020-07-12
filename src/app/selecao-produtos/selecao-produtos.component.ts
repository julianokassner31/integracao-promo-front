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
  pageLinks = 0;
  pt = Calendar.PT_BR;
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

  constructor(
    private api: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

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

    produtos.forEach((p) => {
      if (p.datas) {
        p.dtInicio = p.datas[0];
        p.dtFim = p.datas[1];
      }
    });

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
      () => window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  buscarProdutos(e) {
    this.api.get(`/produtos?query=${e.query}`).subscribe((resp) => {
      this.produtos = resp;
    });
  }

  buscarProdutosPromocao(e, page = 0) {
    this.inputAutoComplete.inputEL.nativeElement.value = '';
    if (e.index === 1) {
      this.api.get(`/produtos/promocoes?page=${page}`).subscribe((resp) => {
        this.pageLinks = resp.totalPages;
        this.produtosPromocao = resp.content;
        this.produtosPromocaoFilter = resp.content;
      });
    }
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
}
