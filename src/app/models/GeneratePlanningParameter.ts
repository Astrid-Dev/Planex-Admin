import {Classe} from "./Classe";
import {Enseignant} from "./Enseignant";
import {Ue} from "./Ue";
import {Domaine, DomaineEnseignant} from "./Domaine";
import {GroupeCours} from "./GroupeCours";
import {Salle} from "./Salle";
import {Jour, Periode} from "./TypeHoraire";

export interface GeneratePlanningParameter {
  classroom: Classe,
  teachers: Enseignant[],
  teachersDomains: DomaineEnseignant[],
  teachingUnits: Ue[],
  domains: Domaine[],
  coursesGroups: GroupeCours[],
  rooms: Salle[], days: Jour[],
  periods: Periode[],
  academicYearId: number,
  classroomStudentsNumber: number,
  allPeriods: Periode[]
}
