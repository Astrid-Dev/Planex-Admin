import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import Swal from "sweetalert2";
import {Periode, TypeHoraire} from "../../models/TypeHoraire";
import {TimesRangesService} from "../../services/times-ranges.service";

@Component({
  selector: 'app-file-input-times-ranges',
  templateUrl: './file-input-times-ranges.component.html',
  styleUrls: ['./file-input-times-ranges.component.scss']
})
export class FileInputTimesRangesComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  periods: Periode[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  constructor(
    private translationService: TranslationService,
    private timesRangesService: TimesRangesService,
    private facultyService: FacultyService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.TIMES.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.TIMES",
        link: "files-input/levels"
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
    this.timesRangesService.extractDataFromFile(resultString)
      .then((periods) =>{
        console.log(periods)
        this.periods = periods;
        this.sendTimes();
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

  sendTimes()
  {
    this.isImporting = true;
    let pauseDuration = 0;

    this.periods.forEach((period, index) =>{
      pauseDuration += parseInt(period.debut.split("h")[0]);
    });

    if(this.periods.length > 0)
    {
      pauseDuration = Math.ceil(pauseDuration / this.periods.length);
    }
    let timeType: TypeHoraire = {
      periodes: this.periods,
      pause: pauseDuration,
      faculteId: this.facultyService.currentFaculty.id
    }
    this.timesRangesService.createTimeType(timeType)
      .then((result: TypeHoraire[] | any) =>{
        this.facultyService.setFacultyTimesType(result);
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
    let result = (this.hasLoadedDatas && this.facultyService.facultyTimesTypes.length > 0);

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

}
