import {Classe} from "./Classe";

export interface GroupeCours {
  id?: number,
  nom: string,
  lettre_debut: string,
  lettre_fin: string,
  classeId?: number,
  classe?: Classe,
  createdAt?: string,
  updatedAt?: string,
  nbre_etudiants?: number
}

export interface CourseGroupCreation {
  startLetter: string,
  endLetter: string,
  possiblesStartLetters: string[],
  possiblesEndLetters: string[],
  name: string,
  studentsNumber: number,
  classeId: number
}
