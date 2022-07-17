import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {SectorsService} from "../../services/sectors.service";
import {Filiere} from "../../models/Filiere";
import {FacultyService, letters} from "../../services/faculty.service";
import deleteProperty = Reflect.deleteProperty;
import {Departement} from "../../models/Departement";
import {NgxSmartModalService} from "ngx-smart-modal";

const MODAL_ID = "sectorEditionModal";

@Component({
  selector: 'app-file-input-sectors',
  templateUrl: './file-input-sectors.component.html',
  styleUrls: ['./file-input-sectors.component.scss']
})
export class FileInputSectorsComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];

  sectors: Filiere[] = [];
  badSectors: Filiere[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  hasFoundBadsDatas: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private sectorsService: SectorsService,
    private ngxSmartModalService: NgxSmartModalService,
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.SECTORS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.SECTORS",
        link: "files-input/sectors"
      }
    )
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
    this.sectorsService.extractDataFromFile(resultString)
      .then((sectors) =>{
        this.sectors = sectors;
        this.syncSectorsWithDepartments();
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

  syncSectorsWithDepartments()
  {
    let syncSectors: Filiere[] = [];
    let unSyncSectors: Filiere[] = [];

    this.sectors.forEach((sector) =>{
      if((typeof sector.departementId === "undefined" || sector.departementId === null)){
        let dept: string = (""+sector?.departement).toUpperCase();
        let department = this.departments.find(elt => (elt.nom.toUpperCase() === dept));
        if(department)
        {
          let temp: Filiere = {
            ...sector,
            departementId: department.id,
          }

          deleteProperty(temp, "departement");

          syncSectors.push(temp);
        }
        else
        {
          let temp: Filiere = {
            ...sector,
            departementId: null,
            defaultDepartement: ""+sector.departement
          }

          unSyncSectors.push(temp);
        }
      }
      else
      {
        syncSectors.push(sector);
      }
    });

    this.badSectors.forEach((sector) =>{
      let dept: string = (""+sector?.departement).toUpperCase();
      let department = this.departments.find(elt => (elt.nom.toUpperCase() === dept));
      if(department)
      {
        let temp: Filiere = {
          ...sector,
          departementId: department.id,
        }

        deleteProperty(temp, "departement");

        syncSectors.push(temp);
      }
      else
      {
        let temp: Filiere = {
          ...sector,
          departementId: null,
          defaultDepartement: ""+sector.departement
        }

        unSyncSectors.push(temp);
      }

    });

    this.sectors = syncSectors;
    if(unSyncSectors.length > 0)
    {
      this.hasFoundBadsDatas = true;
      this.badSectors = unSyncSectors;
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.WARNING"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.BADSDATAS"),
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.badSectors = [];
      this.hasFoundBadsDatas = false;
      this.sendSectors();
    }
  }

  continueReading()
  {
    this.hasFoundBadsDatas = false;
    this.syncSectorsWithDepartments();
  }

  sendSectors()
  {
    this.isImporting = true;
    this.sectorsService.createSectors(this.sectors)
      .then((sectors: Filiere[] | any) =>{
        this.facultyService.setFacultySectors(sectors);
        this.sectors = sectors;
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
      });
  }

  get hasAlreadyUploadedData(){
    let result = (this.hasLoadedDatas && this.facultyService.facultySectors.length > 0);

    if(result && (!this.showDataList && !this.showFileImport))
    {
      this.showImportedStatus = true;
      this.showFileImport = false;
      this.showDataList = false;
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
    return (this.facultyService.facultyDepartments.length > 0)
  }

  get departments(){
    return this.facultyService.facultyDepartments;
  }

  onConsult()
  {
    this.sectors = this.facultyService.facultySectors;
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

  entitled(sector: Filiere)
  {
    return this.translationService.getCurrentLang() === "fr" ? sector.intitule : sector.intitule_en;
  }

  department(id: any)
  {
    return this.departments.find(elt => elt.id === id);
  }

  departmentName(department: Departement | undefined)
  {
    return department ? (this.translationService.getCurrentLang() === "fr" ? department.nom : department.nom_en) : "";
  }

  onEditSector(sector: Filiere)
  {
    this.modal.setData(sector, true);
    this.modal.open();
  }

}
