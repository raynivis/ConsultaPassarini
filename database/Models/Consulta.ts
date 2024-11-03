export interface Consulta {
    id: number;
    tipo_consulta: string;
    preco: number;
    data_consulta: string; // Usando string para ISO date format "YYYY-MM-DDTHH:MM:SS"
    cpf_paciente: string;
    id_clinica: number;
}
