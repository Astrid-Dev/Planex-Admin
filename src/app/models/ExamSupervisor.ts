import {Supervisor} from "./Supervisor";

export interface ExamSupervisor {
  id: number;
  examSessionId: number;
  supervisorId: number;
  supervisor?: Supervisor;
}
