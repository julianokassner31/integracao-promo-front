export interface Produto {
  idIdentificador: number;
  descricao: string;
  prcVenda: number;
  vlCusto: number;
  vlPromocao: number;
  ativo: boolean;
  datas: Date[]; //usados somente aqui para pegar as datas
  codBarra: string;
  codNcm: string;
  qtAtual: number;
  uniMedida: string;
  sync: boolean;
  dtInicio: Date;
  dtFim: Date;
  selecionado: boolean;
}
