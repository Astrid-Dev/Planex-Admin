export interface ExamPeriod {
  id: number;
  startDate: string;
  endDate: string;
  facultyId?: number | null;
  departmentId?: number | null;
  sectorId?: number | null;
  classeId?: number | null;
  scheduleId?: number;
}
