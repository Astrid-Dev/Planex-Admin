import {Enseignant} from "./Enseignant";
import {Ue} from "./Ue";

export interface RepartitionCours {
  id?: number,
  ueId?: number | null,
  classeId?: number,
  classe?: string,
  enseignant1Id?: number | null,
  enseignant2Id?: number | null,
  enseignant3Id?: number | null,
  enseignant4Id?: number | null,
  ue?: Ue | string,
  enseignant1?: Enseignant | string,
  enseignant2?: Enseignant | string,
  enseignant3?: Enseignant | string,
  enseignant4?: Enseignant | string,
  anneeScolaire?: any,
  anneeScolaireId: number,
  defaultUe?: string,
  defaultClasse?: string,
  defaultEnseignant1?: string,
  defaultEnseignant2?: string,
  defaultEnseignant3?: string,
  defaultEnseignant4?: string,
}
