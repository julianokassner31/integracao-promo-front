import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Produto } from '../model/produto';
import { ApiService } from '../services/api.service';
import { Calendar } from '../utils/Calendar';
import { DataView } from 'primeng/dataview';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MustMatch } from '../utils/must_match';

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
  sistemaOptionsDropDow = [];

  @ViewChild('inputAutoComplete') inputAutoComplete: AutoComplete;
  @ViewChild("produtosEnviadosTabPanel") produtosEnviadosTabPanel: DataView;

  setores: {value: string, label: string}[] = [];

  formConfig: FormGroup = this.fb.group({
    tempoScan: [''],
    token: [''],
    urlIntegracao: [''],
    sistema: ['']
  });

  formUsuario: FormGroup = this.fb.group({
    idConfig: [''],
    username: [''],
    password: [''],
    newPassword: [''],
    repeat: ['']
  })

  constructor(
    private api: ApiService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.api.get('/config').subscribe((resp) => {
      this.buildForms(resp);
    });

    this.api.get('/setores').subscribe(resp => {
      this.setores = resp.map(r => {
        return {value: r, label: r}
      });
    });

    this.api.get('/config/sistemas').subscribe(resp => {
      this.sistemaOptionsDropDow = resp.map(r => {
        return {value: r, label: r}
      });
    });

    this.buscarProdutosPromocao();
  }

  salvarConfigUsuario() {
    this.messageService.clear();
    this.api.post('/config/save-usuario', this.formUsuario.value).subscribe(
      (resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensagem',
          detail: 'Usuário alterado com sucesso!',
          life: 3000,
        });
      },
      (err) => {

        if(err.status == 404) {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensagem',
            detail: `Não foi possível encontrar o usuário!`,
            life: 3000,
          });
        } else if (err.status == 400) {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensagem',
            detail: `Senha atual incorreta!`,
            life: 3000,
          });
        }

        
      },
      () => window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  salvarConfig() {
    this.messageService.clear();
    this.api.post('/config', this.formConfig.value).subscribe(
      (resp) => {
        this.buildForms(resp);
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

  syncProduto(idProduto) {
    this.messageService.clear();
    this.api.post(`/produtos/sincronizar/${idProduto}`).subscribe(
      (success) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensagem',
          detail: 'Produto enviado para sincronização!',
          life: 3000,
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensagem',
          detail: `Houve um erro ao tentar sincronizar o produto!`,
          life: 3000,
        });
      },
      () => {
        this.scrollTop();
      });
  }

  enviarProdutos() {

    this.messageService.clear();
    let produtos = this.produtos.filter((p) => p.selecionado);

    const produtosSemSetor = produtos.filter((p) => !p.setor);

    if (produtosSemSetor.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensagem',
        detail: 'Existe produto sem setor selecionado.',
        life: 3000,
      });
      
      this.scrollTop();
      
      return;
    }

    if (!produtos.length) {
      return this.messageService.add({
        severity: 'warn',
        summary: 'Mensagem',
        detail: `Selecione ao menos um produto para ser enviado.`,
      });

      this.scrollTop();
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
        this.resetListaProdutosBuscados();
        this.produtosEnviadosTabPanel.first = 0;
        this.scrollTop();
      });
  }

  resetListaProdutosBuscados() {
    this.produtos= [];
    this.produtosPromocao = [];
    this.produtosPromocaoFilter = [];
  }

  buscarProdutos(e) {
    
    let loader = <HTMLElement> document.querySelector('.produtosBuscar i');
    
    if (loader) loader.style.display = 'block';
    
    this.api.get(`/produtos?query=${e.query}`).subscribe((resp) => {
      
      this.produtos = resp;
      
      if (!loader) {
        loader = <HTMLElement> document.querySelector('.produtosBuscar i');
      } 
      
      loader.style.display = 'none';
    
    });
  }

  buscarProdutosPromocaoOnChangeTab(event) {
    this.inputAutoComplete.inputEL.nativeElement.value = '';
    if (event.index === 0) {
      this.buscarProdutosPromocao();
    }
  }

  buscarProdutosPromocao() {
      this.api.get('/produtos/promocoes').subscribe((resp) => {
        this.totalPages = Math.ceil(resp.length / this.rowsPerPage);
        this.totalRecords = resp.length;
        this.produtosPromocao = resp;
        this.produtosPromocaoFilter = resp;
      });
  }

  filtroProdutosPromocao(e) {
    const query = (<String>e.query).toUpperCase();

    let loader = <HTMLElement> document.querySelector('.produtosPareados i');
 
    if (loader) loader.style.display = 'block';

    if (query) {
      this.produtosPromocaoFilter = this.produtosPromocao.filter(
        (produto) => produto.nome.toUpperCase().indexOf(query) > -1
      );
      
      setTimeout(() => {
        if (!loader) {
          loader = <HTMLElement> document.querySelector('.produtosPareados i');
         
        }
        loader.style.display = 'none';
      }, 500);

    } else {
      this.produtosPromocaoFilter = this.produtosPromocao;
    }
  }

  restoreProdutosPromocao() {
    if (this.inputAutoComplete.inputEL.nativeElement.value.trim() === '') {
      this.produtosPromocaoFilter = [...this.produtosPromocao];
    }
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  buildForms(resp) {
    this.formConfig = this.fb.group({
      id: [resp.id],
      tempoScan: [resp.tempoScan, [Validators.required, Validators.pattern(new RegExp(/\d/))]],
      token: [resp.token, [Validators.required]],
      urlIntegracao: [resp.urlIntegracao, [Validators.required]],
      sistema: [resp.sistema, [Validators.required]]
    });

    this.formUsuario = this.fb.group({
      idConfig: [resp.id],
      username: [resp.username, Validators.required],
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeat: ['', Validators.required]
    },
    {
      validator: MustMatch('newPassword', 'repeat')
    })
  }

  get f() { return this.formUsuario.controls; }
}
