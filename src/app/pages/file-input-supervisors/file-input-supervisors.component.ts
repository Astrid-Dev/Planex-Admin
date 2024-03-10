import {AfterViewInit, Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {Supervisor} from "../../models/Supervisor";
import {SupervisorsService} from "../../services/supervisors.service";
import Swal from "sweetalert2";
// import {FacultyService} from "../../services/faculty.service";
// import {Classe} from "../../models/Classe";
// import {Ue} from "../../models/Ue";
import deleteProperty = Reflect.deleteProperty;
import {NgxSmartModalService} from "ngx-smart-modal";
import { FacultyService } from 'src/app/services/faculty.service';


@Component({
  selector: 'app-file-input-supervisors',
  templateUrl: './file-input-supervisors.component.html',
  styleUrls: ['./file-input-supervisors.component.scss']
})
export class FileInputSupervisorsComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  supervisors: Supervisor[] = [];
  badsSupervisor: Supervisor[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  hasFoundBadsDatas: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  tableSizes: any = [5, 10, 15, 25, 35];
  paginationConfig = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }
  searchText: string = "";

  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private supervisorsService: SupervisorsService,
    private facultyService: FacultyService,
    private ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.SUPERVISORS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.SUPERVISORS",
        link: "files-input/teachers"
      }
    )
  }

  // ngAfterViewInit() {
  //   this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
  // }

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
    this.supervisorsService.extractDataFromFile(resultString)
      .then((supervisors) =>{
        this.supervisors = supervisors;
        this.sendSupervisors();
        console.log(this.supervisors);
        // this.syncTeachersWithDomains();
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
  continueReading()
  {
    this.hasFoundBadsDatas = false;
  }

  sendSupervisors()
  {
    this.isImporting = true;
    this.supervisorsService.createSupervisors(this.supervisors)
      .then((supervisors: Supervisor[] | any) =>{
        this.facultyService.setFacultySupervisors(supervisors);
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

  get supervisorsList()
  {
    let result = this.supervisors.filter(elt => elt.noms.toUpperCase().includes(this.searchText.toUpperCase()));
    this.setPaginationConfig("totalItems", result.length);
    return result;
  }

  get hasAlreadyUploadedData(){
    let result = (this.hasLoadedDatas && this.facultyService.facultySupervisors.length > 0);

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
    return true;
  }

  // get domains()
  // {
  //   return this.facultyService.facultyDomains;
  // }

  onConsult()
  {
    this.supervisors = this.facultyService.facultySupervisors;
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

  onTableDataChange(event: any) {
    this.setPaginationConfig("currentPage", event);
  }

  onTableSizeChange(event: any): void {
    this.setPaginationConfig("itemsPerPage", event);
  }

  getItemPosition(itemIndex: number)
  {
    return ((this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1)) + (itemIndex + 1))
  }

  setPaginationConfig(field: string, value: any)
  {
    this.paginationConfig = {
      ...this.paginationConfig,
      [field]: value
    }
  }

  get resultDescription()
  {
    if(this.supervisorsList.length > 0)
    {
      return this.translationService.getValueOf("GLOBAL.RESULTS") + " " +((this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1)) + 1) + " "+
        this.translationService.getValueOf("GLOBAL.TO")+" "+((this.paginationConfig.itemsPerPage * this.paginationConfig.currentPage)) +" "+
        this.translationService.getValueOf("GLOBAL.OF")+" " + this.paginationConfig.totalItems;
    }
    else{
      return "";
    }
  }

  onEditSupervisor(supervisor: Supervisor)
  {
    this.modal.setData(supervisor, true);
    this.modal.open();
  }

}
