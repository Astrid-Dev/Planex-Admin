import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {ClassroomsService} from "../../services/classrooms.service";
import {FacultyService} from "../../services/faculty.service";
import {Classe} from "../../models/Classe";
import deleteProperty = Reflect.deleteProperty;
import {NgxSmartModalService} from "ngx-smart-modal";

const MODAL_ID = "classroomEditionModal";

@Component({
  selector: 'app-file-input-classrooms',
  templateUrl: './file-input-classrooms.component.html',
  styleUrls: ['./file-input-classrooms.component.scss']
})
export class FileInputClassroomsComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  classrooms: Classe[] = [];
  badsClassrooms: Classe[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  hasFoundBadsDatas: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private classroomsService: ClassroomsService,
    private facultyService: FacultyService,
    private ngxSmartModalService: NgxSmartModalService,
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

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
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
        let sector = this.sectors.find((a) => {return a.code === classroom.filiere});
        let level = this.levels.find((a) =>{return a.code === classroom.niveau});

        if(sector && level)
        {
          let temp: Classe = {
            ...classroom,
            filiereId: sector.id,
            niveauId: level.id
          }

          deleteProperty(temp, "filiere");
          deleteProperty(temp, "niveau");

          syncClassrooms.push(temp);
        }
        else
        {
          let temp: Classe = {
            ...classroom,
            filiereId: sector ? sector.id: null,
            niveauId: level ? level.id : null
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
      let sector = this.sectors.find((a) => {return a.code === classroom.filiere});
      let level = this.levels.find((a) =>{return a.code === classroom.niveau});

      if(sector && level)
      {
        let temp: Classe = {
          ...classroom,
          filiereId: sector.id,
          niveauId: level.id
        }

        deleteProperty(temp, "filiere");
        deleteProperty(temp, "niveau");

        syncClassrooms.push(temp);
      }
      else
      {
        let temp: Classe = {
          ...classroom,
          filiereId: sector ? sector.id: null,
          niveauId: level ? level.id : null
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
        this.classrooms = classrooms;
        this.showImportedStatus = true;
        this.showDataList = false;
        this.showFileImport = false;
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

  get hasAlreadyUploadedData(){
    let result = (this.hasLoadedDatas && this.facultyService.facultyClassrooms.length > 0);

    if(result && (!this.showDataList && !this.showFileImport))
    {
      this.showImportedStatus = true;
    }

    if(this.hasLoadedDatas && !this.showDataList && !this.showFileImport && !this.showImportedStatus)
    {
      this.showFileImport = true;
    }

    return result;
  }

  get canShowFileImport(){
    return ((this.hasLoadedDatas && this.showFileImport));
  }

  get canShowDataList(){
    return ((this.hasLoadedDatas) && (this.showDataList));
  }

  get canShowImportedStatus()
  {
    return this.hasLoadedDatas && this.showImportedStatus;
  }

  get canUploadFile()
  {
    return ((this.hasLoadedDatas) && (this.facultyService.facultySectors.length > 0 && this.facultyService.facultyLevels.length > 0));

  }

  get sectors()
  {
    return this.facultyService.facultySectors;
  }

  get levels()
  {
    return this.facultyService.facultyLevels;
  }

  onConsult()
  {
    this.classrooms = this.facultyService.facultyClassrooms;
    this.showDataList = true;
    this.showFileImport = false;
    this.showImportedStatus = false;
  }

  onCancelConsult()
  {
    this.showDataList = false;
    this.showFileImport = false;
    this.showImportedStatus = true;
  }

  onComplement()
  {
    this.showDataList = false;
    this.showFileImport = true;
    this.showImportedStatus = false;
  }

  entitled(classroom: Classe)
  {
    return this.translationService.getCurrentLang() === "fr" ? classroom.intitule : classroom.intitule_en;
  }

  level(levelId: any)
  {
    return this.levels.find(elt => elt.id === levelId)?.code;
  }

  sector(sectorId: any){
    return this.sectors.find(elt => elt.id === sectorId)?.code;
  }

  studentsNumber(classroomId: any){
    return this.facultyService.getAClassroomStudentsNumber(classroomId);
  }

  onEditClassroom(classroom: Classe)
  {
    this.modal.setData(classroom, true);
    this.modal.open();
  }

}
