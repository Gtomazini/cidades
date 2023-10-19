export interface Cidade {
    cidade_id?: number,
    estado_id: number,
    nome: string,
    pais_id: number,
    distancia_km: number, 
    valor_pedagio: number
}

export interface CidadeFull {
    cidade_id?: number,
    estado_id: number,
    estado_nome: string,
    pais_id: number,
    pais_nome: string,
    nome: string,
    distancia_km: number, 
    valor_pedagio: number
}