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
import {CourseGroupCreation, GroupeCours} from "../models/GroupeCours";
import {GroupeTd} from "../models/GroupeTd";
import {Domaine, DomaineEnseignant} from "../models/Domaine";
import {RepartitionCours} from "../models/RepartitionCours";
import {Departement} from "../models/Departement";
import {HelpService} from "./help.service";

export const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const FACULTY_URL = BACKEND_URL + "/facultes";

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  departments: Departement[] = [];
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
  coursesRepartition: RepartitionCours[] = [];
  times: TypeHoraire[] = [];
  days: { numero: number, id?: number, intitule: string, intitule_en: string}[] = [];
  faculty !: Faculte;
  facultyStats: any = null;
  academicYear: any = null;

  hasLoadedDatas: boolean = false;

  undefinedPeriods: any = [{id: null, debut: "", debut_en: "", fin: "", fin_en: ""}, {id: null, debut: "", debut_en: "", fin: "", fin_en: ""}, {id: null, debut: "", debut_en: "", fin: "", fin_en: ""}, {id: null, debut: "", debut_en: "", fin: "", fin_en: ""}];

  constructor(private http: HttpClient, private helpService: HelpService) { }

  findOneFacultyWithSubsDatas(id: number)
  {
    return new Promise(((resolve, reject) => {
      this.http.get(FACULTY_URL + "/"+ id + "/withsubsdatas")
        .subscribe(
          (res: any) =>{
            this.departments = res.departements;
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
            this.coursesRepartition = res.repartition_cours;

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

  get facultyDepartments()
  {
    return this.departments.sort((a, b) =>a.nom.localeCompare(b.nom));
  }
  setFacultyDepartments(newDepartments: Departement[])
  {
    this.departments = newDepartments;
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

  getATeacherDomains(teacherId: number)
  {
    return this.teachersDomains.filter(elt => elt.enseignantId === teacherId);
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

  get facultyCoursesRepartition(){
    return this.coursesRepartition;
  }

  setFacultyCoursesRepartition(newCoursesRepartition: RepartitionCours[])
  {
    this.coursesRepartition = newCoursesRepartition;
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

  get defaultFacultyTimeType()
  {
    return this.times.length > 0 ? this.times[0] : {id: null, pause: 0, periodes: this.undefinedPeriods, faculteId: this.faculty.id};
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

  getAClassroomStudentsNumber(classroomId: any)
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

  getATeachingUnitCourseRepartition(teachingUnitId: any)
  {
    return this.coursesRepartition.find(elt => elt.ueId === teachingUnitId);
  }

  getAClassroomCoursesRepartition(classroomId: any)
  {
    let result: RepartitionCours[] = [];
    let teachingUnitsId = this.getTeachingUnitsOfOneClassroom(classroomId).map(elt => elt.id);
    return this.coursesRepartition.filter(elt => elt.ueId && teachingUnitsId.includes(elt.ueId));
  }

  getCoursesGroupsOfOneClassroom(classroomId: any)
  {
    return this.coursesGroups.filter((group => group.classeId === classroomId));
  }

  setCoursesGroupsOfOneClassroom(classroomId: any, newGroups: GroupeCours[], newClassroomData: any = null)
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

  getASectorClassrooms(sectorId: any)
  {
    return this.classrooms.filter(elt => elt.filiereId === sectorId);
  }

  getADepartmentSectors(deptId: any)
  {
    return this.sectors.filter(elt => elt.departementId === deptId);
  }

  getADepartmentClassrooms(deptId: any)
  {
    let result: Classe[] = [];
    this.getADepartmentSectors(deptId).forEach((sector) =>{
      result = result.concat(this.getASectorClassrooms(sector.id));
    });
    return result;
  }

  proposeDivisionOfAClassroomInGroup(classroomId: any, groupsNumber: number = 2)
  {
    let coursesGroups: GroupeCours[] = [];
    let coursesGroupsDuringCreation: CourseGroupCreation[] = [];
    if(groupsNumber >= 2)
    {
      let classroom = this.classrooms.find(elt => elt.id === classroomId);

      for(let i = 0; i < groupsNumber; i++)
      {
        coursesGroupsDuringCreation.push({
          classeId: classroomId,
          name: "",
          startLetter: "",
          endLetter: "",
          possiblesEndLetters: [],
          possiblesStartLetters: [],
          studentsNumber: 0
        });
      }
      coursesGroupsDuringCreation = this.syncGroupsLetters(coursesGroupsDuringCreation);
      coursesGroupsDuringCreation = this.syncStudentsNumberPerGroup(classroomId, coursesGroupsDuringCreation);
    }

    return coursesGroupsDuringCreation;
  }

  proposeAClassroomDivisionToFitARoomCapacity(classroomId: any, roomCapacity: number = this.maxRoomCapacity)
  {
    let groupsNumber = 2;
    let groups: CourseGroupCreation[] = [];
    let maxStudentsNumber = this.getAClassroomStudentsNumber(classroomId);

    while(maxStudentsNumber > roomCapacity){
      groups = this.proposeDivisionOfAClassroomInGroup(classroomId, groupsNumber);
      ++groupsNumber;
      let studentsGroupsNumber = groups.map(elt => {return elt.studentsNumber});
      maxStudentsNumber = Math.max(...studentsGroupsNumber);
    }

    let canContinue = true;

    while(canContinue)
    {
      let foundIndex = 0;
      let hasFound = false;

      for(let i = 0; i < groups.length - 1; i++)
      {
        if((groups[i].studentsNumber + groups[i+1].studentsNumber) < roomCapacity)
        {
          foundIndex = i;
          hasFound = true;
          break;
        }
      }

      if(hasFound)
      {
        console.log("Ok")
        groups[foundIndex] = {
          ...groups[foundIndex],
          name: "Grp" + (foundIndex + 1),
          studentsNumber: (groups[foundIndex].studentsNumber + groups[foundIndex + 1].studentsNumber),
          endLetter: groups[foundIndex + 1].endLetter
        }

        groups = groups.filter((elt, index) => index !== (foundIndex + 1));
      }

      canContinue = hasFound;
    }

    return groups;
  }

  divideAClassroomToFitARoomCapacity(classroomId: any, roomCapacity: number = this.maxRoomCapacity)
  {
    let groupsCreation = this.proposeAClassroomDivisionToFitARoomCapacity(classroomId, roomCapacity);
    let groups: GroupeCours[] = [];
    let temp = this.getMaxCoursesGroupId();
    console.log(groupsCreation)

    groupsCreation.forEach((elt) =>{
      temp = temp + 1;
      groups.push({
        lettre_fin: elt.startLetter,
        nom: elt.name,
        lettre_debut: elt.endLetter,
        nbre_etudiants: elt.studentsNumber,
        classeId: classroomId,
        id: temp,
      });
    });

    let classroom = this.classrooms.find(elt => elt.id === classroomId);
    if(classroom)
    {
      classroom = {
        ...classroom,
        est_divisee: 1
      }
    }

    this.setCoursesGroupsOfOneClassroom(classroomId, groups, classroom)
  }

  getMaxCoursesGroupId()
  {
    if(this.coursesGroups.length === 0){
      return 0;
    }
    return Math.max(...this.coursesGroups.map(elt => {
      let id: any = elt.id ? elt.id : 0;
      return id;
    }))
  }

  syncStudentsNumberPerGroup(classroomId: any, groupsData: CourseGroupCreation[])
  {
    let groups = groupsData.filter(elt => true);
    groups.forEach((group: any) =>{
      let temp = this.getAClassroomInfos(classroomId).filter((data) => data.lettre.toUpperCase().localeCompare(group.startLetter) >= 0 && data.lettre.toUpperCase().localeCompare(group.endLetter) <= 0)
      let studentsNumber = 0;

      temp.forEach((tmp: any) =>{
        studentsNumber += tmp.nbre;
      });

      group.studentsNumber = studentsNumber;
    });

    return groups;
  }

  syncGroupsLetters(groupsData: CourseGroupCreation[])
  {
    let groups = groupsData.filter(elt => true);
    const groupsNumber: number = groups.length;

    let startIndex: number = -1;
    let endIndex: number = -1;

    const lettersNumber: number = parseInt(String(this.letters.length/groupsNumber));

    groups.forEach((group, i: number) =>{
      startIndex = endIndex + 1;
      endIndex = startIndex + lettersNumber - 1;
      if(i === 0)
      {
        endIndex += this.letters.length - (groupsNumber * lettersNumber);
      }

      group.name = "Grp" + (i + 1);
      group.startLetter = this.letters[startIndex];
      group.endLetter = this.letters[endIndex];
    });

    return groups;
  }

  syncPossiblesGroupsLetters(groupsData: CourseGroupCreation[])
  {
    let groups = groupsData.filter(elt => true);
    groups[0].possiblesStartLetters = [this.letters[0]];
    groups[groups.length - 1].possiblesEndLetters = [this.letters[this.letters.length - 1]];

    for(let i = 1; i < groups.length; i++)
    {
      let letter1: string = groups[i-1].endLetter;
      let letter2: string = groups[i].endLetter;

      groups[i].possiblesStartLetters = this.getLettersInInterval(letter1, letter2, false, true);
    }
    for(let i = 0; i < groups.length - 1; i++)
    {
      let letter1: string = groups[i].startLetter;
      let letter2: string = groups[i+1].startLetter;

      groups[i].possiblesEndLetters = this.getLettersInInterval(letter1, letter2, true, false);
    }

    let firstGroup = groups[0];
    let secondGroup = groups[1];

    let lastGroup = groups[groups.length - 1];
    let prevLastGroup = groups[groups.length - 2]
    groups[0].possiblesEndLetters = this.getLettersInInterval(firstGroup.startLetter, secondGroup.startLetter, true, false);
    groups[groups.length - 1].possiblesStartLetters = this.getLettersInInterval(prevLastGroup.endLetter, lastGroup.endLetter, false, true);
    return groups;
  }

  private get letters()
  {
    return this.helpService.upperCasesLetters;
  }

  private getLettersInInterval(letter1: string, letter2: string, firstInside: boolean = false, lastInside: boolean = false)
  {
    return this.helpService.getLettersInInterval(letter1, letter2, firstInside, lastInside);
  }

  get maxRoomCapacity()
  {
    return this.rooms.length > 0 ? Math.max(...this.rooms.map(elt => elt.capacite)) : 0;
  }

}
