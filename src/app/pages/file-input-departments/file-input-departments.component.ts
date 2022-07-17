import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {NgxSmartModalService} from "ngx-smart-modal";
import Swal from "sweetalert2";
import {DepartmentsService} from "../../services/departments.service";
import {Departement} from "../../models/Departement";

const MODAL_ID = "departmentEditionModal";

@Component({
  selector: 'app-file-input-departments',
  templateUrl: './file-input-departments.component.html',
  styleUrls: ['./file-input-departments.component.scss']
})
export class FileInputDepartmentsComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  departments: Departement[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private departmentService: DepartmentsService,
    private facultyService: FacultyService,
    private ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.DEPARTMENTS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.DEPARTMENTS",
        link: "files-input/departments"
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
    this.departmentService.extractDataFromFile(resultString)
      .then((departments) =>{
        console.log(departments)
        this.departments = departments;
        this.sendDepartments();
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

  sendDepartments()
  {
    this.isImporting = true;
    this.departmentService.createDepartments(this.departments)
      .then((departments: Departement[] | any) =>{
        this.facultyService.setFacultyDepartments(departments);
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
    let result = (this.hasLoadedDatas && this.facultyService.facultyDepartments.length > 0);

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

  onConsult()
  {
    this.departments = this.facultyService.facultyDepartments;
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

  name(department: Departement)
  {
    return this.translationService.getCurrentLang() === "fr" ? department.nom : department.nom_en;
  }

  onEditDepartment(department: Departement)
  {
    this.modal.setData(department, true);
    this.modal.open();
  }

}
