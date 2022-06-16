export interface TypeHoraire {
  id?: number,
  pause: number,
  periodes: Periode[],
  faculteId?: number
}

export interface Periode {
  id?: number,
  debut: string,
  debut_en: string,
  fin: string,
  fin_en: string,
  createdAt?: string,
  updatedAt?: string,
  typeHoraireId?: number
}

export interface Jour{
  id?: number,
  createdAt?: string,
  updatedAt?: string,
  intitule: string,
  intitule_en: string
}
