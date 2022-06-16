import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {Ue} from "../../models/Ue";
import {FacultyService} from "../../services/faculty.service";
import Swal from "sweetalert2";
import {TeachingUnitsService} from "../../services/teaching-units.service";
import {Td} from "../../models/Td";
import deleteProperty = Reflect.deleteProperty;
import {TutorialsService} from "../../services/tutorials.service";
import {Classe} from "../../models/Classe";

@Component({
  selector: 'app-file-input-teaching-units',
  templateUrl: './file-input-teaching-units.component.html',
  styleUrls: ['./file-input-teaching-units.component.scss']
})
export class FileInputTeachingUnitsComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];

  teachingUnits: Ue[] = [];
  badTeachingUnits: Ue[] = [];
  tutorials: Td[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  hasFoundBadsDatas: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  constructor(
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private teachingUnitsService: TeachingUnitsService,
    private tutorialsService: TutorialsService
    ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.TEACHINGUNITS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.TU",
        link: "files-input/teaching-units"
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
    this.teachingUnitsService.extractDataFromFile(resultString)
      .then((teachingUnitResult) =>{
        this.teachingUnits = teachingUnitResult.teachingUnits;
        this.tutorials = teachingUnitResult.tutorials;
        this.syncTeachingUnitsWithClassrooms()
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

  syncTeachingUnitsWithClassrooms()
  {
    let syncTeachingUnits: Ue[] = [];
    let unSyncTeachingUnits: Ue[] = [];

    this.teachingUnits.forEach((teachingUnit) =>{
      if((typeof teachingUnit.classeId === "undefined" || teachingUnit.classeId === null) || (typeof teachingUnit.domaineId === "undefined" || teachingUnit.domaineId === null)){
        let classroom = this.getClassrooms().find(classroom => classroom.code === teachingUnit.classe);
        let tmp = teachingUnit?.domaine?.toString().toUpperCase();
        let domain = this.domains.find(elt => elt.nom.toUpperCase() === tmp || elt.nom_en.toUpperCase() === tmp);
        if(classroom && domain)
        {
          let temp: Ue = {
            ...teachingUnit,
            classeId: classroom.id,
            domaineId: domain.id
          }

          deleteProperty(temp, "classe");
          deleteProperty(temp, "domaine");

          syncTeachingUnits.push(temp);
        }
        else
        {
          let temp: Ue = {
            ...teachingUnit,
            classeId: classroom ? classroom.id : null,
            domaineId: domain ? domain.id : null,
            defaultClasse: ""+teachingUnit.classe
          }

          if(temp.classeId === null)
          {
            temp = {...temp, defaultClasse: ""+temp.classe}
          }
          if(temp.domaineId === null)
          {
            temp = {...temp, defaultDomaine: ""+temp.domaine}
          }

          unSyncTeachingUnits.push(temp);
        }
      }
      else
      {
        syncTeachingUnits.push(teachingUnit);
      }
    });

    console.log(syncTeachingUnits);
    console.log(unSyncTeachingUnits);

    this.badTeachingUnits.forEach((teachingUnit) =>{
      let classroom = this.getClassrooms().find(classroom => classroom.code === teachingUnit.classe);
      let tmp = teachingUnit?.domaine?.toString().toUpperCase();
      let domain = this.domains.find(elt => elt.nom.toUpperCase() === tmp || elt.nom_en.toUpperCase() === tmp);
      if(classroom && domain)
      {
        let temp: Ue = {
          ...teachingUnit,
          classeId: classroom.id,
          domaineId: domain.id
        }

        deleteProperty(temp, "classe");
        deleteProperty(temp, "domaine");

        syncTeachingUnits.push(temp);
      }
      else
      {
        let temp: Ue = {
          ...teachingUnit,
          classeId: classroom ? classroom.id : null,
          domaineId: domain ? domain.id : null,
          defaultClasse: ""+teachingUnit.classe
        }

        if(temp.classeId === null)
        {
          temp = {...temp, defaultClasse: ""+temp.classe}
        }
        if(temp.domaineId === null)
        {
          temp = {...temp, defaultDomaine: ""+temp.domaine}
        }

        unSyncTeachingUnits.push(temp);
      }

    });


    this.teachingUnits = syncTeachingUnits;
    if(unSyncTeachingUnits.length > 0)
    {
      this.hasFoundBadsDatas = true;
      this.badTeachingUnits = unSyncTeachingUnits;
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.WARNING"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.BADSDATAS"),
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.badTeachingUnits = [];
      this.hasFoundBadsDatas = false;
      this.sendTeachingUnits();
    }
  }

  continueReading()
  {
    this.hasFoundBadsDatas = false;
    this.syncTeachingUnitsWithClassrooms();
  }

  get domains(){
    return this.facultyService.facultyDomains;
  }

  sendTeachingUnits()
  {
    this.isImporting = true;
    this.teachingUnitsService.createTeachingUnits(this.teachingUnits)
      .then((teachingUnits: Ue[] | any) =>{
        this.facultyService.setFacultyTeachingUnits(teachingUnits);
        this.sendTutorials();
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

  syncTutotialsWithTeachingUnits()
  {
    let syncTutorials: Td[] = [];
    this.tutorials.forEach((tutorial) =>{
      let teachingUnit = this.getTeachingUnits().find(teachingUnit => tutorial.ue === teachingUnit.code);
      if(teachingUnit)
      {
        let temp: Td = {
          ...tutorial,
          ueId: teachingUnit.id
        }

        syncTutorials.push(temp);
      }
    });
    this.tutorials = syncTutorials;
  }

  sendTutorials()
  {
    this.syncTutotialsWithTeachingUnits();

    this.isImporting = true;
    this.tutorialsService.createTutorials(this.tutorials)
      .then((tutorials: Td[] | any) =>{
        this.facultyService.setFacultyTutorials(tutorials);
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

  getBooleanText(value: boolean | undefined)
  {
    if(value)
    {
      return this.translationService.getValueOf("FILESINPUT.TEACHINGUNITS.YES")
    }
    else
    {
      return this.translationService.getValueOf("FILESINPUT.TEACHINGUNITS.NO")
    }
  }

  get hasAlreadyUploadedData(){
    let result = (this.hasLoadedDatas && this.facultyService.facultyTeachingUnits.length > 0);

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
    return (this.facultyService.facultyClassrooms.length > 0 && this.facultyService.facultyDomains.length > 0);
  }

  getClassrooms(){
    return this.facultyService.facultyClassrooms;
  }

  getTeachingUnits(){
    return this.facultyService.facultyTeachingUnits;
  }

}
