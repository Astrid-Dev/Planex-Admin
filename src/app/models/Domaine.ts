import {Faculte} from "./Faculte";
import {Enseignant} from "./Enseignant";

export interface Domaine {
  id?: number,
  nom: string,
  nom_en: string,
  faculteId?: number,
  createdAt?: string,
  updatedAt?: string,
  faculte?: Faculte
}

export interface DomaineEnseignant{
  id?: number,
  enseignantId: number,
  domaineId: number,
  enseignant?: Enseignant,
  domaine?: Domaine,
  createdAt?: string,
  updatedAt?: string
}
