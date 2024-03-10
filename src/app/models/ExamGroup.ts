import {Etudiant} from "./Etudiant";

export interface ExamGroup {
  id: number;
  firstStudentId: number;
  lastStudentId: number;
  firstStudent?: Etudiant;
  lastStudent?: Etudiant;
}
