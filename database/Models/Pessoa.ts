export interface Pessoa {
    id: string; // CPF
    senha: string;
    nome: string;
    sexo: string;
    dataNasc: string; // "YYYY-MM-DDTHH:MM:SS" para datas ISO
    raca_cor: string;
    celular: string;
    nome_mae: string;
    nome_pai: string;
    genero: string;
    orientacao_sexual: string;
    logradouro: string;
    numero: number;
    bairro: string;
    cidade: string;
    estado: string;
    img: string;
}
