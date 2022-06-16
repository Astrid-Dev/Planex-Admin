import {Injectable} from '@angular/core';
import {BACKEND_URL} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Filiere} from "../models/Filiere";
import {Niveau} from "../models/Niveau";
import {Ue} from "../models/Ue";
import {Classe} from "../models/Classe";
import {Salle} from "../models/Salle";
import {Enseignant} from "../models/Enseignant";
import {Periode, TypeHoraire} from "../models/TypeHoraire";
import {Faculte} from "../models/Faculte";
import {Td} from "../models/Td";
import {DonneeEtudiant} from "../models/Etudiant";
import {GroupeCours} from "../models/GroupeCours";
import {GroupeTd} from "../models/GroupeTd";
import {Domaine, DomaineEnseignant} from "../models/Domaine";

export const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const FACULTY_URL = BACKEND_URL + "/facultes";

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  sectors: Filiere[] = [];
  levels: Niveau[] = [];
  teachingUnits: Ue[] = [];
  classrooms: Classe[] = [];
  rooms: Salle[] = [];
  teachers: Enseignant[] = [];
  tutorials: Td[] = [];
  coursesGroups: GroupeCours[] = [];
  tutorialsGroups: GroupeTd[] = [];
  studentsDatas: DonneeEtudiant[] = [];
  domains: Domaine[] = [];
  teachersDomains: DomaineEnseignant[] = [];
  times: TypeHoraire[] = [];
  days: { numero: number, id?: number, intitule: string, intitule_en: string}[] = [];
  faculty !: Faculte;
  facultyStats: any = null;
  academicYear: any = null;

  hasLoadedDatas: boolean = false;

  constructor(private http: HttpClient) { }

  findOneFacultyWithSubsDatas(id: number)
  {
    return new Promise(((resolve, reject) => {
      this.http.get(FACULTY_URL + "/"+ id + "/withsubsdatas")
        .subscribe(
          (res: any) =>{
            this.sectors = res.filieres;
            this.levels = res.niveaux;
            this.teachingUnits = res.ues;
            this.tutorials = res.tds;
            this.rooms = res.salles;
            this.classrooms = res.classes;
            this.times = res.horaires;
            this.days = res.jours;
            this.faculty = res.faculte;
            this.studentsDatas = res.etudiants;
            this.coursesGroups = res.groupes_cours;
            this.tutorialsGroups = res.groupes_tds;
            this.facultyStats = res.donnees_fichiers;
            this.teachers = res.enseignants;
            this.domains = res.domaines;
            this.teachersDomains = res.domaines_enseignants;
            this.academicYear = res.annee_scolaire;

            this.attributeStudentsNumberToCoursesGroups();

            console.log(res);

            this.hasLoadedDatas = true;
            resolve(res);
          },
          err =>{
            this.hasLoadedDatas = false;
            reject(err);
          }
        )
    }))
  }

  private attributeStudentsNumberToCoursesGroups()
  {
    this.coursesGroups.forEach((group, index, newCoursesGroups) =>{
      newCoursesGroups[index] = {
        ...group,
        nbre_etudiants: this.getACourseGroupStudentsNumber(group)
      }
    })
  }

  get currentFaculty()
  {
    return this.faculty;
  }

  get facultySectors()
  {
    return this.sectors.sort((a, b) =>a.code.localeCompare(b.code));
  }
  setFacultySectors(newSectors: Filiere[])
  {
    this.sectors = newSectors;
  }

  get facultyTeachers()
  {
    return this.teachers.sort((a, b) => a.noms.localeCompare(b.noms));
  }
  setFacultyTeachers(newTeachers: Enseignant[])
  {
    this.teachers = newTeachers;
  }

  get facultyDomains(){
    return this.domains.sort((a, b) => a.nom.toUpperCase().localeCompare(b.nom.toUpperCase()));
  }

  setFacultyDomains(newDomains: Domaine[])
  {
    this.domains = newDomains;
  }

  get facultyTeachersDomains()
  {
    return this.teachersDomains;
  }

  setFacultyTeachersDomains(newTeachersDomains: DomaineEnseignant[]){
    this.teachersDomains = newTeachersDomains;
  }

  getADomainById(id: any){
    let domain = this.domains.find(elt => elt.id === id);
    return domain ? domain : null;
  }

  get facultyTeachingUnits()
  {
    return this.teachingUnits.sort((a, b) => a.code.localeCompare(b.code));
  }
  setFacultyTeachingUnits(newTeachingUnits: Ue[])
  {
    this.teachingUnits = newTeachingUnits;
  }

  get facultyRooms()
  {
    return this.rooms.sort((a, b) => a.code.toUpperCase().localeCompare(b.code.toUpperCase()));
  }
  setFacultyRooms(newRooms: Salle[])
  {
    this.rooms = newRooms;
  }

  get facultyClassrooms()
  {
    return this.classrooms
      .sort((a, b) =>{
        const sectorA: any = this.sectors.find(sector => sector.id === a.filiereId);
        const sectorB: any = this.sectors.find(sector => sector.id === b.filiereId);
        const levelA: any = this.levels.find(level => level.id === a.niveauId);
        const levelB: any = this.levels.find(level => level.id === b.niveauId);
        if(sectorA.code.localeCompare(sectorB.code) === 0 && levelB.code.localeCompare(levelA.code) < 0)
        {
          return a.code.localeCompare(b.code) <= 0;
        }
        else
        {
          return ((sectorA.code.localeCompare(sectorB.code) ||  a.code.localeCompare(b.code)) || (levelA.code.localeCompare(levelB.code)));
        }
      });
  }
  setFacultyClassrooms(newClassrooms: Classe[])
  {
    this.classrooms = newClassrooms
  }
  get facultyTutorials()
  {
    return this.tutorials;
  }
  setFacultyTutorials(newTutorials: Td[])
  {
    this.tutorials = newTutorials;
  }

  get allDays()
  {
    return this.days;
  }

  get facultyTimes()
  {
    return this.times;
  }

  get allPeriods()
  {
    let result: Periode[] = [];
    this.times.forEach((time) =>{
      result = result.concat(time.periodes);
    })

    return result;
  }

  get facultyLevels()
  {
    return this.levels;
  }
  setFacultyLevels(newLevels: Niveau[])
  {
    this.levels = newLevels;
  }

  get facultyCoursesGroups()
  {
    return this.coursesGroups;
  }

  get facultyTutorialsGroups()
  {
    return this.tutorialsGroups;
  }

  get facultyStudentsDatas(){
    return this.studentsDatas;
  }
  setStudentsDatas(newStudentsDatas: DonneeEtudiant[], studentsNumber: number)
  {
    this.studentsDatas = newStudentsDatas;
    this.facultyStats.etudiants = studentsNumber;
  }
  hasUploadStudents()
  {
    return this.facultyStats.etudiants > 0;
  }

  get hasLoaded()
  {
    return this.hasLoadedDatas;
  }

  updateOneSectorOnList(sectorId: number, newSectorDatas: Filiere)
  {
    console.log(newSectorDatas)
    console.log(this.sectors);
    this.sectors.forEach(function(sector, index: number, theArray){
      if(sector.id === sectorId)
      {
        theArray[index] = newSectorDatas;
      }
    });
    console.log(this.sectors);
  }

  getAClassroomInfos(classroomId: number)
  {
    return this.studentsDatas.filter(studentData => studentData.classeId === classroomId);
  }

  getAClassroomStudentsNumber(classroomId: number)
  {
    let temp = this.getAClassroomInfos(classroomId);
    let studentsNumber = 0;

    temp.forEach((studentData) =>{
      studentsNumber += studentData.nbre;
    });

    return studentsNumber;
  }

  getACourseGroupStudentsNumber(group: GroupeCours)
  {
    let classroom: any = this.classrooms.find(elt => elt.id = group.classeId);

    let studentsNumber = 0;

    this.getAClassroomInfos(classroom.id).forEach((data) =>{
      if(data.lettre.localeCompare(group.lettre_debut) > -1 && data.lettre.localeCompare(group.lettre_fin) < 1)
      {
        studentsNumber += data.nbre;
      }
    });

    return studentsNumber;
  }

  getCoursesGroupsOfOneClassroom(classroomId: number)
  {
    return this.coursesGroups.filter((group => group.classeId === classroomId));
  }

  setCoursesGroupsOfOneClassroom(classroomId: number, newGroups: GroupeCours[], newClassroomData: any = null)
  {
    this.coursesGroups = this.coursesGroups.filter(group => group.classeId !== classroomId);
    newGroups.forEach((group) =>{
      this.coursesGroups.push(group);
    });

    this.attributeStudentsNumberToCoursesGroups();

    if(newClassroomData !== null)
    {
      this.updateAFacultyClassroom(classroomId, newClassroomData);
    }
  }

  updateAFacultyClassroom(classroomId: number, newClassroomData: Classe)
  {
    this.classrooms.forEach((classroom, index, newClassrooms) =>{
      if(classroom.id === classroomId)
      {
        newClassrooms[index] = newClassroomData;
      }
    })
  }

  getTeachingUnitsOfOneClassroom(classroomId: number)
  {
    return this.teachingUnits.filter(teachingUnit => teachingUnit.classeId === classroomId);
  }

  getAClassroomById(classroomId: number | null)
  {
    return classroomId === null ? {} :{
      infos: this.classrooms.find(classroom => classroom.id === classroomId),
      hasGroups: this.getCoursesGroupsOfOneClassroom(classroomId).length !== 0,
      groups: this.getCoursesGroupsOfOneClassroom(classroomId),
      teachingUnits: this.getTeachingUnitsOfOneClassroom(classroomId),
      studentsNumber: this.getAClassroomStudentsNumber(classroomId),
      sector: this.sectors.find((sector) =>{
        let classroom = this.classrooms.find(elt => elt.id === classroomId);
        return classroom?.filiereId === sector.id;
      })
    };
  }

  getAClassroomByCode(classroomCode: string | null)
  {
    let temp = this.classrooms.find(classroom => classroom.code === classroomCode);
    let classroomId: any = temp ? temp.id : null;
    return this.getAClassroomById(classroomId);
  }

  get facultyAcademicYear()
  {
    return this.academicYear;
  }

  getATimeType(timeTypeId: any)
  {
    return this.times.find(elt => elt.id === timeTypeId);
  }

  get facultyTimesTypes()
  {
    return this.times;
  }

  setFacultyTimesType(newTimesType: TypeHoraire[])
  {
    this.times = newTimesType;
  }

  getAClassroomTutorials(classroomId: number)
  {
    let allTeachingUnits = this.getTeachingUnitsOfOneClassroom(classroomId);
    let teachingUnitsList: any[] = [];
    allTeachingUnits.forEach((teachingUnit) =>{
      teachingUnitsList.push(teachingUnit.id);
    });
    return this.tutorials.filter(turorial => teachingUnitsList.includes(turorial.ueId));
  }

  getAClassroomTutorialsGroups(classroomId: number)
  {
    let tutorials = this.getAClassroomTutorials(classroomId);
    let tutorialsList: any[] = [];

    tutorials.forEach((tutorial) =>{
      tutorialsList.push(tutorial.id);
    });

    return this.tutorialsGroups.filter(tutorialGroup => tutorialsList.includes(tutorialGroup.id));
  }


}
