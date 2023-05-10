import {AfterViewInit, Component, OnInit} from '@angular/core';

import deleteProperty = Reflect.deleteProperty;
import {NgxSmartModalService} from "ngx-smart-modal";
import Swal from 'sweetalert2';
import { Breadcumb } from '../components/page-header-row/page-header-row.component';
import { Enseignant } from '../models/Enseignant';
import { FacultyService } from '../services/faculty.service';
import { TeachersService } from '../services/teachers.service';
import { TranslationService } from '../services/translation.service';

const MODAL_ID = "teacherEditionModal";

@Component({
  selector: 'app-surveillant',
  templateUrl: './surveillant.component.html',
  styleUrls: ['./surveillant.component.scss']
})
export class SurveillantComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  teachers: Enseignant[] = [];
  badsTeachers: Enseignant[] = [];

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
    private teachersService: TeachersService,
    private facultyService: FacultyService,
    private ngxSmartModalService: NgxSmartModalService
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
    this.teachersService.extractDataFromFile(resultString)
      .then((teachers) =>{
        this.teachers = teachers;
        // this.sendTeachers();
        console.log(this.teachers);
        this.syncTeachersWithDomains();
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

  syncTeachersWithDomains(){
    let syncTeachers: Enseignant[] = [];
    let unSyncTeachers: Enseignant[] = [];

    this.teachers.forEach((teacher, index, array) =>{
      if((typeof teacher.idDomaines === "undefined")){

        let hasValidDomains = true;

        let length = teacher.nomsDomaines ? teacher.nomsDomaines.length : 0;
        let badDomain: string = "";

        let teachersDomainsId: any = [];
        if(teacher.nomsDomaines && teacher.nomsDomaines[0] !== "")
        {
          for(let i = 0; i < length; i++)
          {
            let temp = this.isPossibleDomain(teacher.nomsDomaines[i]);
            if(temp.result)
            {
              teachersDomainsId.push(temp.item?.id);
            }
            else{
              hasValidDomains = false;
              badDomain = teacher.nomsDomaines[i];
              let newDomains = teacher.nomsDomaines.filter((elt, j) => j !== i);

              array[index] = {
                ...teacher,
                nomsDomaines: newDomains
              }
              break;
            }
          }
        }

        if(hasValidDomains){
          let temp = {
            ...teacher,
            idDomaines: teachersDomainsId
          };
          deleteProperty(temp, "nomsDomaines");
          syncTeachers.push(temp);
        }
        else{
          unSyncTeachers.push({
            ...teacher,
            badDomain: badDomain
          })
        }
      }
      else
      {
        syncTeachers.push(teacher);
      }
    });

    this.badsTeachers.forEach((teacher, index, array) =>{
      if((typeof teacher.idDomaines === "undefined")){

        let hasValidDomains = true;

        let length = teacher.nomsDomaines ? teacher.nomsDomaines.length : 0;
        let badDomain: string = "";

        let teachersDomainsId: any = [];
        if(teacher.nomsDomaines && teacher.nomsDomaines[0] !== "")
        {
          for(let i = 0; i < length; i++)
          {
            let temp = this.isPossibleDomain(teacher.nomsDomaines[i])
            if(temp.result)
            {
              teachersDomainsId.push(temp.item?.id);
            }
            else{
              hasValidDomains = false;
              badDomain = teacher.nomsDomaines[i];
              let newDomains = teacher.nomsDomaines.filter((elt, j) => j !== i);

              array[index] = {
                ...teacher,
                nomsDomaines: newDomains
              }
              break;
            }
          }
        }

        if(hasValidDomains){
          let temp = {
            ...teacher,
            idDomaines: teachersDomainsId
          };
          deleteProperty(temp, "nomsDomaines");
          syncTeachers.push(temp);
        }
        else{
          unSyncTeachers.push({
            ...teacher,
            badDomain: badDomain
          })
        }
      }
      else
      {
        syncTeachers.push(teacher);
      }
    });

    console.log(syncTeachers);
    console.log(unSyncTeachers)
    this.teachers = syncTeachers;
    if(unSyncTeachers.length > 0)
    {
      this.hasFoundBadsDatas = true;
      this.badsTeachers = unSyncTeachers;
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.WARNING"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.BADSDATAS"),
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.badsTeachers = [];
      this.hasFoundBadsDatas = false;
      this.sendTeachers();
    }
  }

  continueReading()
  {
    this.hasFoundBadsDatas = false;
    this.syncTeachersWithDomains();
  }

  isPossibleDomain(domainName: string)
  {
    let temp = domainName.toUpperCase();

    let domain = this.domains.find(elt => {return elt.nom.toUpperCase() === temp || elt.nom_en.toUpperCase() === temp});

    return {
      result: typeof domain !== "undefined",
      item: domain ? domain : null
    }
  }

  sendTeachers()
  {
    this.isImporting = true;
    this.teachersService.createTeachers(this.teachers)
      .then((teachers: Enseignant[] | any) =>{
        this.facultyService.setFacultyTeachers(teachers);
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

  get teachersList()
  {
    let result = this.teachers.filter(elt => elt.noms.toUpperCase().includes(this.searchText.toUpperCase()));
    this.setPaginationConfig("totalItems", result.length);
    return result;
  }

  get hasAlreadyUploadedData(){
    let result = (this.hasLoadedDatas && this.facultyService.facultyTeachers.length > 0);

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
    return this.facultyService.facultyDomains.length > 0;
  }

  get domains()
  {
    return this.facultyService.facultyDomains;
  }

  onConsult()
  {
    this.teachers = this.facultyService.facultyTeachers;
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
    if(this.teachersList.length > 0)
    {
      return this.translationService.getValueOf("GLOBAL.RESULTS") + " " +((this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1)) + 1) + " "+
        this.translationService.getValueOf("GLOBAL.TO")+" "+((this.paginationConfig.itemsPerPage * this.paginationConfig.currentPage)) +" "+
        this.translationService.getValueOf("GLOBAL.OF")+" " + this.paginationConfig.totalItems;
    }
    else{
      return "";
    }
  }

  onEditTeacher(teacher: Enseignant)
  {
    this.modal.setData(teacher, true);
    this.modal.open();
  }

}
