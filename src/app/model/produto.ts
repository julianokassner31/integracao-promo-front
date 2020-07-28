export interface Produto {
  idIdentificador: number;
  nome: string;
  descricao: string;
  valor: number;
  vlPromocao: number;
  codBarra: string;
  codNcm: string;
  qtAtual: number;
  uniMedida: string;
  dtFim: Date;
  dtInicio: Date;
  ativo: boolean;
  sync: boolean;
  setor: string;
  selecionado: boolean;
}
