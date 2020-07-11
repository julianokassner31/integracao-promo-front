export interface Estoque {
  idIdentificador: number;
  descricao: string;
  prcVenda: number;
  ativo: boolean;
  datas: Date[];
  codBarra: string;
  codNcm: string;
  qtdAtual: number;
  uniMedida: string;
}
