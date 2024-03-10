import { Injectable } from '@angular/core';
import {Classe} from "../models/Classe";
import {Departement} from "../models/Departement";
import {Domaine} from "../models/Domaine";
import {Enseignant} from "../models/Enseignant";
import {Exam} from "../models/Exam";
import {ExamDate} from "../models/ExamDate";
import {ExamGroup} from "../models/ExamGroup";
import {ExamPeriod} from "../models/ExamPeriod";
import { ExamSession } from '../models/ExamSession';
import {ExamSupervisor} from "../models/ExamSupervisor";
import {Faculte} from "../models/Faculte";
import {Filiere} from "../models/Filiere";
import {Niveau} from "../models/Niveau";
import {RepartitionCours} from "../models/RepartitionCours";
import {Salle} from "../models/Salle";
import {Supervisor} from "../models/Supervisor";
import {TypeHoraire} from "../models/TypeHoraire";
import {Ue} from "../models/Ue";
import {Etudiant} from "../models/Etudiant";
import {HttpClient} from "@angular/common/http";

const CLASSES_KEY = 'classes';
const DEPARTMENTS_KEY = 'departments';
const DOMAINS_KEY = 'domains';
const TEACHERS_KEY = 'teachers';
const STUDENTS_KEY = 'students-class-';
const EXAMS_KEY = 'exams';
const EXAM_DATES_KEY = 'exam_dates';
const EXAM_GROUPS_KEY = 'exams_groups';
const EXAM_PERIODS_KEY = 'exam_periods';
const EXAM_SESSIONS_KEY = 'exam_sessions';
const EXAM_SUPERVISORS_KEY = 'exam_supervisors';
const FACULTIES_KEY = 'faculties';
const SECTORS_KEY = 'sectors';
const LEVELS_KEY = 'levels';
const COURSES_REPARTITION_KEY = 'courses_repartition';
const ROOMS_KEY = 'rooms';
const SUPERVISORS_KEY = 'supervisors';
const SCHEDULE_TYPES_KEY = 'schedule_types';
const TEACHING_UNITS_KEY = 'teaching_units';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  classes: Classe[] = [];
  private departments: Departement[] = [];
  private domains: Domaine[] = [];
  private teachers: Enseignant[] = [];
  private students: any = {};
  private exams: Exam[] = [];
  private examDates: ExamDate[] = [];
  private examGroups: ExamGroup[] = [];
  private examPeriods: ExamPeriod[] = [];
  private examSessions: ExamSession[] = [];
  private examSupervisors: ExamSupervisor[] = [];
  private faculties: Faculte[] = [];
  private sectors: Filiere[] = [];
  private levels: Niveau[] = [];
  private coursesRepartition: RepartitionCours[] = [];
  private rooms: Salle[] = [];
  private supervisors: Supervisor[] = [];
  private schedulesTypes: TypeHoraire[] = [];
  private teachingUnits: Ue[] = [];

  public _hasSyncedData: boolean = false;

  constructor(private http: HttpClient) {
    const temp = localStorage.getItem('hasSyncedData');
    this._hasSyncedData = temp ? JSON.parse(temp) : false;
  }

  get hasSyncedData(): boolean {
    return this._hasSyncedData;
  }

  public syncData(data: any) {
    this.saveClasses(data.classes);
    this.saveSectors(data.filieres);
    this.saveScheduleTypes(data.horaires);
    this.saveSupervisors(data.surveillants);
    this.saveTeachers(data.enseignants);
    this.saveTeachingUnits(data.ues);
    this.saveRooms(data.salles);
    this.saveDomains(data.salles);
    this.saveFaculties([data.faculte]);
    this.saveLevels(data.niveaux);
    this.saveDepartments(data.departements);
    this.setSynchronizationStatus(true);
  }

  public getClasses()
  {
    return new Promise<Classe[]>((resolve, reject) => {
      if (this.classes.length > 0) {
        resolve(this.classes);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(CLASSES_KEY);
            this.classes =  temp ? JSON.parse(temp) : [];
            resolve(this.classes);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public setSynchronizationStatus(status: boolean)
  {
    this._hasSyncedData = status;
    localStorage.setItem('hasSyncedData', JSON.stringify(this._hasSyncedData));
  }

  public getDepartments()
  {
    return new Promise<Departement[]>((resolve, reject) => {
      if (this.departments.length > 0) {
        resolve(this.departments);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(DEPARTMENTS_KEY);
            this.departments = temp ? JSON.parse(temp) : [];
            resolve(this.departments);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getDomains()
  {
    return new Promise<Domaine[]>((resolve, reject) => {
      if (this.domains.length > 0) {
        resolve(this.domains);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(DOMAINS_KEY);
            this.domains = temp ? JSON.parse(temp) : [];
            resolve(this.domains);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getTeachers()
  {
    return new Promise<Enseignant[]>((resolve, reject) => {
      if (this.teachers.length > 0) {
        resolve(this.teachers);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(TEACHERS_KEY);
            this.teachers = temp ? JSON.parse(temp) : [];
            resolve(this.teachers);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getStudents(classeId: number) {
    const finalKey = STUDENTS_KEY + classeId;
    return new Promise<Etudiant[]>((resolve, reject) => {
      if (this.students[finalKey]) {
        resolve(this.students[finalKey]);
      } else {
        this.http.get('assets/students/'+finalKey+'.json')
          .subscribe({
            next: (students: any) => {
              this.students[finalKey] = students;
              resolve(students);
            },
            error: (err) => reject(err)
          });
      }
    });
  }

  public getExams()
  {
    return new Promise<Exam[]>((resolve, reject) => {
      if (this.exams.length > 0) {
        resolve(this.exams);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(EXAMS_KEY);
            this.exams = temp ? JSON.parse(temp) : [];
            resolve(this.exams);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getExamDates()
  {
    return new Promise<ExamDate[]>((resolve, reject) => {
      if (this.examDates.length > 0) {
        resolve(this.examDates);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(EXAM_DATES_KEY);
            this.examDates = temp ? JSON.parse(temp) : [];
            resolve(this.examDates);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getExamGroups()
  {
    return new Promise<ExamGroup[]>((resolve, reject) => {
      if (this.examGroups.length > 0) {
        resolve(this.examGroups);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(EXAM_GROUPS_KEY);
            this.examGroups = temp ? JSON.parse(temp) : [];
            resolve(this.examGroups);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getExamPeriods()
  {
    return new Promise<ExamPeriod[]>((resolve, reject) => {
      if (this.examPeriods.length > 0) {
        resolve(this.examPeriods);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(EXAM_PERIODS_KEY);
            this.examPeriods = temp ? JSON.parse(temp) : [];
            resolve(this.examPeriods);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getExamSessions()
  {
    return new Promise<ExamSession[]>((resolve, reject) => {
      if (this.examSessions.length > 0) {
        resolve(this.examSessions);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(EXAM_SESSIONS_KEY);
            this.examSessions = temp ? JSON.parse(temp) : [];
            resolve(this.examSessions);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getExamSupervisors()
  {
    return new Promise<ExamSupervisor[]>((resolve, reject) => {
      if (this.examSupervisors.length > 0) {
        resolve(this.examSupervisors);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(EXAM_SUPERVISORS_KEY);
            this.examSupervisors = temp ? JSON.parse(temp) : [];
            resolve(this.examSupervisors);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getFaculties()
  {
    return new Promise<Faculte[]>((resolve, reject) => {
      if (this.faculties.length > 0) {
        resolve(this.faculties);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(FACULTIES_KEY);
            this.faculties = temp ? JSON.parse(temp) : [];
            resolve(this.faculties);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getSectors()
  {
    return new Promise<Filiere[]>((resolve, reject) => {
      if (this.sectors.length > 0) {
        resolve(this.sectors);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(SECTORS_KEY);
            this.sectors = temp ? JSON.parse(temp) : [];
            resolve(this.sectors);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getLevels()
  {
    return new Promise<Niveau[]>((resolve, reject) => {
      if (this.levels.length > 0) {
        resolve(this.levels);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(LEVELS_KEY);
            this.levels = temp ? JSON.parse(temp) : [];
            resolve(this.levels);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getCoursesRepartition()
  {
    return new Promise<RepartitionCours[]>((resolve, reject) => {
      if (this.coursesRepartition.length > 0) {
        resolve(this.coursesRepartition);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(COURSES_REPARTITION_KEY);
            this.coursesRepartition = temp ? JSON.parse(temp) : [];
            resolve(this.coursesRepartition);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getRooms()
  {
    return new Promise<Salle[]>((resolve, reject) => {
      if (this.rooms.length > 0) {
        resolve(this.rooms);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(ROOMS_KEY);
            this.rooms = temp ? JSON.parse(temp) : [];
            resolve(this.rooms);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getSupervisors()
  {
    return new Promise<Supervisor[]>((resolve, reject) => {
      if (this.supervisors.length > 0) {
        resolve(this.supervisors);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(SUPERVISORS_KEY);
            this.supervisors = temp ? JSON.parse(temp) : [];
            resolve(this.supervisors);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getScheduleTypes()
  {
    return new Promise<TypeHoraire[]>((resolve, reject) => {
      if (this.schedulesTypes.length > 0) {
        resolve(this.schedulesTypes);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(SCHEDULE_TYPES_KEY);
            this.schedulesTypes = temp ? JSON.parse(temp) : [];
            resolve(this.schedulesTypes);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }

  public getTeachingUnits()
  {
    return new Promise<Ue[]>((resolve, reject) => {
      if (this.teachingUnits.length > 0) {
        resolve(this.teachingUnits);
      } else {
        setTimeout(() => {
          try {
            const temp = localStorage.getItem(TEACHING_UNITS_KEY);
            this.teachingUnits = temp ? JSON.parse(temp) : [];
            resolve(this.teachingUnits);
          } catch(err: any) {
            reject(err);
          }
        }, 500);
      }
    });
  }


  public saveClasses(newClasses: Classe[])
  {
    this.classes = newClasses;
    localStorage.setItem(CLASSES_KEY, JSON.stringify(newClasses));
  }

  public saveDepartments(newDepartments: Departement[])
  {
    this.departments = newDepartments;
    localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(newDepartments));
  }

  public saveDomains(newDomains: Domaine[])
  {
    this.domains = newDomains;
    localStorage.setItem(DOMAINS_KEY, JSON.stringify(newDomains));
  }

  public saveTeachers(newTeachers: Enseignant[])
  {
    this.teachers = newTeachers;
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(this.teachers));
  }

  public saveStudents(newStudents: Etudiant[], classeId: number) {
    const finalKey = STUDENTS_KEY + classeId;
    this.students[finalKey] = newStudents;
    const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(JSON.stringify(newStudents));

    const a = document.createElement('a');
    a.href = uri;
    a.style.display = 'none';
    a.download = finalKey + '.json';
    document.body.appendChild(a);
    a.click();
  }

  public saveExams(newExams: Exam[])
  {
    this.exams = newExams;
    localStorage.setItem(EXAMS_KEY, JSON.stringify(newExams));
  }

  public saveExamDates(newExamDates: ExamDate[])
  {
    this.examDates = newExamDates;
    localStorage.setItem(EXAM_DATES_KEY, JSON.stringify(newExamDates));
  }

  public saveExamGroups(newExamGroups: ExamGroup[])
  {
    this.examGroups = newExamGroups;
    localStorage.setItem(EXAM_GROUPS_KEY, JSON.stringify(newExamGroups));
  }

  public saveExamPeriods(newExamPeriods: ExamPeriod[])
  {
    this.examPeriods = newExamPeriods;
    localStorage.setItem(EXAM_PERIODS_KEY, JSON.stringify(newExamPeriods));
  }

  public saveExamSessions(newExamSessions: ExamSession[])
  {
    this.examSessions = newExamSessions;
    localStorage.setItem(EXAM_SESSIONS_KEY, JSON.stringify(newExamSessions));
  }

  public saveExamSupervisors(newExamSupervisors: ExamSupervisor[])
  {
    this.examSupervisors = newExamSupervisors;
    localStorage.setItem(EXAM_SUPERVISORS_KEY, JSON.stringify(newExamSupervisors));
  }

  public saveFaculties(newFaculties: Faculte[])
  {
    this.faculties = newFaculties;
    localStorage.setItem(FACULTIES_KEY, JSON.stringify(newFaculties));
  }

  public saveSectors(newSectors: Filiere[])
  {
    this.sectors = newSectors;
    localStorage.setItem(SECTORS_KEY, JSON.stringify(newSectors));
  }

  public saveLevels(newLevels: Niveau[])
  {
    this.levels = newLevels;
    localStorage.setItem(LEVELS_KEY, JSON.stringify(newLevels));
  }

  public saveCoursesRepartition(newCoursesRepartition: RepartitionCours[])
  {
    this.coursesRepartition = newCoursesRepartition;
    localStorage.setItem(COURSES_REPARTITION_KEY, JSON.stringify(newCoursesRepartition));
  }

  public saveRooms(newRooms: Salle[])
  {
    this.rooms = newRooms;
    localStorage.setItem(ROOMS_KEY, JSON.stringify(newRooms));
  }

  public saveSupervisors(newSupervisors: Supervisor[])
  {
    this.supervisors = newSupervisors;
    localStorage.setItem(SUPERVISORS_KEY, JSON.stringify(newSupervisors));
  }

  public saveScheduleTypes(newScheduleTypes: TypeHoraire[])
  {
    this.schedulesTypes = newScheduleTypes;
    localStorage.setItem(SCHEDULE_TYPES_KEY, JSON.stringify(newScheduleTypes));
  }

  public saveTeachingUnits(newTeachingUnits: Ue[])
  {
    this.teachingUnits = newTeachingUnits;
    localStorage.setItem(TEACHING_UNITS_KEY, JSON.stringify(newTeachingUnits));
  }
}
