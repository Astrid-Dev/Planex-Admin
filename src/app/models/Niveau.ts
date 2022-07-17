import {Faculte} from "./Faculte";

export interface Niveau {
  id?: number,
  code: string,
  intitule: string,
  intitule_en: string,
  faculteId: number,
  faculte?: Faculte,
  createdAt?: string,
  updatedAt?: string,
}
