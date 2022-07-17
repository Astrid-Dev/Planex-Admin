import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {LevelsService} from "../../services/levels.service";
import {Niveau} from "../../models/Niveau";
import {FacultyService} from "../../services/faculty.service";
import {NgxSmartModalService} from "ngx-smart-modal";

const MODAL_ID = "levelEditionModal";

@Component({
  selector: 'app-file-input-levels',
  templateUrl: './file-input-levels.component.html',
  styleUrls: ['./file-input-levels.component.scss']
})
export class FileInputLevelsComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  levels: Niveau[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private levelsService: LevelsService,
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
        link: "files-input/levels"
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
    this.levelsService.extractDataFromFile(resultString)
      .then((levels) =>{
        console.log(levels)
        this.levels = levels;
        this.sendLevels();
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

  sendLevels()
  {
    this.isImporting = true;
    this.levelsService.createLevels(this.levels)
      .then((levels: Niveau[] | any) =>{
        this.facultyService.setFacultyLevels(levels);
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
    let result = (this.hasLoadedDatas && this.facultyService.facultyLevels.length > 0);

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
    this.levels = this.facultyService.facultyLevels;
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

  entitled(level: Niveau)
  {
    return this.translationService.getCurrentLang() === "fr" ? level.intitule : level.intitule_en;
  }

  onEditLevel(level: Niveau)
  {
    this.modal.setData(level, true);
    this.modal.open();
  }
}
