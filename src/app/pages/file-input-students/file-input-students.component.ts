import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {DonneeEtudiant, Etudiant} from "../../models/Etudiant";
import {FacultyService, letters} from "../../services/faculty.service";
import {TeachingUnitsService} from "../../services/teaching-units.service";
import {TutorialsService} from "../../services/tutorials.service";
import {StudentsService} from "../../services/students.service";
import Swal from "sweetalert2";
import {Ue} from "../../models/Ue";
import deleteProperty = Reflect.deleteProperty;

@Component({
  selector: 'app-file-input-students',
  templateUrl: './file-input-students.component.html',
  styleUrls: ['./file-input-students.component.scss']
})
export class FileInputStudentsComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];

  students: Etudiant[] = [];
  badStudents: Etudiant[] = [];
  studentsDatasToSend: DonneeEtudiant[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  hasFoundBadsDatas: boolean = false;

  constructor(
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private studentsService: StudentsService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.STUDENTS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.STUDENTS",
        link: "files-input/students"
      }
    )
  }

  loadDatas()
  {
    this.hasLoadedDatas = null;
    if(!this.facultyService.hasLoaded)
    {
      this.facultyService.findOneFacultyWithSubsDatas(1)
        .then((res) =>{
          this.hasLoadedDatas = true;
        })
        .catch((err) =>{
          console.error(err);
          this.hasLoadedDatas = false;
        });
    }
    else
    {
      this.hasLoadedDatas = true;
    }
  }

  readFileContent(resultString: string)
  {
    this.studentsService.extractDataFromFile(resultString)
      .then((students) =>{
        this.students = students;
        this.syncStudentsWithClassroom();
      })
      .catch((err) =>{
        console.error(err);
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.ERROR"),
          text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.INVALIDHEADER"),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }

  syncStudentsWithClassroom()
  {
    let syncStudents: Etudiant[] = [];
    let unSyncStudents: Etudiant[] = [];

    this.students.forEach((student) =>{
      if((typeof student.classeId === "undefined" || student.classeId === null)){
        let classroom = this.getClassrooms().find(classroom => classroom.code === student.classe);
        if(classroom)
        {
          let temp: Etudiant = {
            ...student,
            classeId: classroom.id,
          }

          deleteProperty(temp, "classe");

          syncStudents.push(temp);
        }
        else
        {
          console.log(classroom + "   " + student.classe)
          let temp: Etudiant = {
            ...student,
            classeId: null,
            defaultClasse: ""+student.classe
          }

          unSyncStudents.push(temp);
        }
      }
      else
      {
        syncStudents.push(student);
      }
    });

    this.badStudents.forEach((student) =>{
      let classroom = this.getClassrooms().find(classroom => classroom.code === student.classe);

      if(classroom)
      {
        let temp: Etudiant = {
          ...student,
          classeId: classroom.id,
        }

        deleteProperty(temp, "classe");

        syncStudents.push(temp);
      }
      else
      {
        let temp: Etudiant = {
          ...student,
          classeId: null,
          defaultClasse: ""+student.classe
        }

        unSyncStudents.push(temp);
      }

    });

    this.students = syncStudents;
    if(unSyncStudents.length > 0)
    {
      this.hasFoundBadsDatas = true;
      this.badStudents = unSyncStudents;
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.WARNING"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.BADSDATAS"),
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.badStudents = [];
      this.hasFoundBadsDatas = false;
      this.sendStudents();
    }
  }

  continueReading()
  {
    this.hasFoundBadsDatas = false;
    this.syncStudentsWithClassroom();
  }

  sendStudents()
  {
    this.prepareFacultyStudentsDatas(this.students);
    this.isImporting = true;
    this.studentsService.createStudents(this.students)
      .then((students: Etudiant[] | any) =>{
        this.facultyService.setStudentsDatas(this.studentsDatasToSend, this.students.length)
        this.isImporting = false;
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.SUCCES"),
          text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.SUCCESSIMPORT"),
          icon: 'success',
          confirmButtonText: 'OK'
        });
      })
      .catch((err) =>{
        console.error(err);
        this.isImporting = false;
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.ERROR"),
          text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.ERRORIMPORT"),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }

  prepareFacultyStudentsDatas(syncStudents: Etudiant[])
  {
    this.getClassrooms().forEach((classroom) =>{
      letters.forEach((letter) =>{
        this.studentsDatasToSend.push({
          lettre: letter,
          nbre: syncStudents.filter((student) =>{return (student.noms.startsWith(letter) && student.classeId === classroom.id)}).length,
          classeId: classroom.id
        })
      })
    })
  }

  get canUploadFile()
  {
    if(this.facultyService.facultyClassrooms.length === 0)
    {
      return null;
    }
    else{
      return this.facultyService.canUploadStudentsFile();
    }
  }

  getClassrooms(){
    return this.facultyService.facultyClassrooms;
  }

}
