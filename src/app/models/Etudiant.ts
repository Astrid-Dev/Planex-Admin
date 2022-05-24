import {Classe} from "./Classe";

export interface Etudiant {
  id?: number,
  noms: string,
  matricule: string,
  email: string,
  classe: string | Classe,
  classeId?: number | null,
  defaultClasse?: string,
  createdAt?: string,
  updatedAt?: string,
}

export interface DonneeEtudiant{
  lettre: string,
  nbre: number,
  classeId?: number,
  classe?: Classe | string
}
