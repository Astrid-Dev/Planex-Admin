import {Faculte} from "./Faculte";

export interface Departement {
  id?: number,
  nom: string,
  nom_en: string,
  faculteId: number,
  faculte?: Faculte,
  createdAt?: string,
  updatedAt?: string,
}
