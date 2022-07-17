import {Classe} from "./Classe";
import {Enseignant} from "./Enseignant";
import {Ue} from "./Ue";
import {Domaine, DomaineEnseignant} from "./Domaine";
import {GroupeCours} from "./GroupeCours";
import {Salle} from "./Salle";
import {Jour, Periode} from "./TypeHoraire";
import {RepartitionCours} from "./RepartitionCours";

export interface GeneratePlanningParameter {
  classroom: Classe,
  teachingUnits: Ue[],
  coursesGroups: GroupeCours[],
  rooms: Salle[], days: Jour[],
  periods: Periode[],
  academicYearId: number,
  classroomStudentsNumber: number,
  allPeriods: Periode[],
  coursesRepartition: RepartitionCours[],
  selectedDays: [],
  teachingUnitsPerDay: number,
  oneTeachingUnitPerWeek: number,
  periodsBetweenTwoTeachingUnits: number
}
