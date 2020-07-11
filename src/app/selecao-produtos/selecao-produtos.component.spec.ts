import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoProdutosComponent } from './selecao-produtos.component';

describe('SelecaoProdutosComponent', () => {
  let component: SelecaoProdutosComponent;
  let fixture: ComponentFixture<SelecaoProdutosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecaoProdutosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecaoProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
