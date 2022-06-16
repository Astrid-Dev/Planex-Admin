import {DomaineEnseignant} from "./Domaine";

export interface Enseignant
{
  id?: number,
  noms: string,
  sexe?: number,
  telephone: string,
  email: string,
  bureau: string,
  faculteId: number,
  createdAt?: string,
  updatedAt?: string,
  domaines?: DomaineEnseignant[],
  idDomaines?: number[],
  nomsDomaines?: string[],
  grade?: string,
  etablissement?: string,
  position?: string,
  badDomain?: string,
}
