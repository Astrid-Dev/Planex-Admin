import {Departement} from "./Departement";

export interface Filiere {
  id?: number,
  code: string,
  intitule: string,
  intitule_en: string,
  departementId?: number | null,
  departement?: Departement | string,
  createdAt?: string,
  updatedAt?: string,
  typeHoraireId?: number | null,
  defaultDepartement?: string
}
