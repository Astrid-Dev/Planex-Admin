import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {Enseignant} from "../../models/Enseignant";
import {TeachersService} from "../../services/teachers.service";
import Swal from "sweetalert2";
import {FacultyService} from "../../services/faculty.service";

@Component({
  selector: 'app-file-input-teachers',
  templateUrl: './file-input-teachers.component.html',
  styleUrls: ['./file-input-teachers.component.scss']
})
export class FileInputTeachersComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  teachers: Enseignant[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  constructor(
    private translationService: TranslationService,
    private teachersService: TeachersService,
    private facultyService: FacultyService
    ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.TEACHERS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.TEACHERS",
        link: "files-input/teachers"
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
    this.teachersService.extractDataFromFile(resultString)
      .then((teachers) =>{
        this.teachers = teachers;
        this.sendTeachers();
        console.log(teachers);
      })
      .catch((err) =>{
        console.error(err);
        const fileIsEmpty = err === "Fichier vide";
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.ERROR"),
          text: this.translationService.getValueOf(fileIsEmpty ? "FILESINPUT.FILEIMPORT.EMPTYFILECONTENT" : "FILESINPUT.FILEIMPORT.INVALIDHEADER"),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }

  sendTeachers()
  {
    this.isImporting = true;
    this.teachersService.createTeachers(this.teachers)
      .then((teachers: Enseignant[] | any) =>{
        this.facultyService.setFacultyTeachers(teachers);
        this.isImporting = false;
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.SUCCESS"),
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
      })
  }

  get canUploadFile()
  {
    return this.facultyService.facultyTeachers.length === 0;
  }

}
