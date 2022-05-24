import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {ClassroomsService} from "../../services/classrooms.service";
import {FacultyService} from "../../services/faculty.service";
import {Classe} from "../../models/Classe";
import deleteProperty = Reflect.deleteProperty;
import {Niveau} from "../../models/Niveau";

@Component({
  selector: 'app-file-input-classrooms',
  templateUrl: './file-input-classrooms.component.html',
  styleUrls: ['./file-input-classrooms.component.scss']
})
export class FileInputClassroomsComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  classrooms: Classe[] = [];
  badsClassrooms: Classe[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  hasFoundBadsDatas: boolean = false;

  constructor(
    private translationService: TranslationService,
    private classroomsService: ClassroomsService,
    private facultyService: FacultyService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.CLASSROOMS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.CLASSROOMS",
        link: "files-input/classrooms"
      }
    );
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
    this.classroomsService.extractDataFromFile(resultString)
      .then((classrooms) =>{
        this.classrooms = classrooms;
        this.syncClassroomsWithSectorsAndLevels();
        console.log(classrooms);
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

  syncClassroomsWithSectorsAndLevels()
  {
    let syncClassrooms: Classe[] = [];
    let unSyncClassrooms: Classe[] = [];

    this.classrooms.forEach((classroom) =>{
      if((typeof classroom.filiereId === "undefined" || classroom.filiereId === null) || (typeof classroom.niveauId === "undefined" || classroom.niveauId === null))
      {
        let sectors = this.getSectors().filter((a) => {return a.code === classroom.filiere});
        let levels = this.getLevels().filter((a) =>{return a.code === classroom.niveau});

        if(sectors.length > 0 && levels.length > 0)
        {
          let temp: Classe = {
            ...classroom,
            filiereId: sectors[0].id,
            niveauId: levels[0].id
          }

          deleteProperty(temp, "filiere");
          deleteProperty(temp, "niveau");

          syncClassrooms.push(temp);
        }
        else
        {
          let temp: Classe = {
            ...classroom,
            filiereId: sectors.length > 0 ? sectors[0].id: null,
            niveauId: levels.length > 0 ? levels[0].id : null
          }

          if(temp.filiereId === null)
          {
            temp = {...temp, defaultFiliere: ""+temp.filiere}
          }
          if(temp.niveauId === null)
          {
            temp = {...temp, defaultNiveau: ""+temp.niveau}
          }

          unSyncClassrooms.push(temp);
        }
      }
      else
      {
        syncClassrooms.push(classroom);
      }

    });

    this.badsClassrooms.forEach((classroom) =>{
      let sectors = this.getSectors().filter((a) => {return a.code === classroom.filiere});
      let levels = this.getLevels().filter((a) =>{return a.code === classroom.niveau});

      if(sectors.length > 0 && levels.length > 0)
      {
        let temp: Classe = {
          ...classroom,
          filiereId: sectors[0].id,
          niveauId: levels[0].id
        }

        deleteProperty(temp, "filiere");
        deleteProperty(temp, "niveau");

        syncClassrooms.push(temp);
      }
      else
      {
        let temp: Classe = {
          ...classroom,
          filiereId: sectors.length > 0 ? sectors[0].id: null,
          niveauId: levels.length > 0 ? levels[0].id : null
        }

        if(temp.filiereId === null)
        {
          temp = {...temp, defaultFiliere: ""+temp.filiere}
        }
        if(temp.niveauId === null)
        {
          temp = {...temp, defaultNiveau: ""+temp.niveau}
        }

        unSyncClassrooms.push(temp);
      }

    });


    this.classrooms = syncClassrooms;
    if(unSyncClassrooms.length > 0)
    {
      this.hasFoundBadsDatas = true;
      this.badsClassrooms = unSyncClassrooms;
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.WARNING"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.BADSDATAS"),
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.badsClassrooms = [];
      this.hasFoundBadsDatas = false;
      this.sendClassrooms();
    }
  }

  continueReading()
  {
    this.hasFoundBadsDatas = false;
    this.syncClassroomsWithSectorsAndLevels();
  }

  sendClassrooms()
  {
    this.isImporting = true;
    this.classroomsService.createClassrooms(this.classrooms)
      .then((classrooms: Classe[] | any) =>{
        this.facultyService.setFacultyClassrooms(classrooms);
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
      })
  }

  get canUploadFile()
  {
    if(this.facultyService.facultySectors.length === 0 || this.facultyService.facultyLevels.length === 0)
    {
      return null;
    }
    else{
      return this.facultyService.facultyClassrooms.length === 0;
    }
  }

  getSectors()
  {
    return this.facultyService.facultySectors;
  }

  getLevels()
  {
    return this.facultyService.facultyLevels;
  }

}