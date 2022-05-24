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
      if((typeof teachingUnit.classeId === "undefined" || teachingUnit.classeId === null)){
        let classroom = this.getClassrooms().find(classroom => classroom.code === teachingUnit.classe);
        if(classroom)
        {
          let temp: Ue = {
            ...teachingUnit,
            classeId: classroom.id,
          }

          deleteProperty(temp, "classe");

          syncTeachingUnits.push(temp);
        }
        else
        {
          let temp: Ue = {
            ...teachingUnit,
            classeId: null,
            defaultClasse: ""+teachingUnit.classe
          }

          unSyncTeachingUnits.push(temp);
        }
      }
      else
      {
        syncTeachingUnits.push(teachingUnit);
      }
    });

    this.badTeachingUnits.forEach((teachingUnit) =>{
      let classroom = this.getClassrooms().find(classroom => classroom.code === teachingUnit.classe);

      if(classroom)
      {
        let temp: Ue = {
          ...teachingUnit,
          classeId: classroom.id,
        }

        deleteProperty(temp, "classe");

        syncTeachingUnits.push(temp);
      }
      else
      {
        let temp: Ue = {
          ...teachingUnit,
          classeId: null,
          defaultClasse: ""+teachingUnit.classe
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

  get canUploadFile()
  {
    if(this.facultyService.facultyClassrooms.length === 0)
    {
      return null;
    }
    else{
      return this.facultyService.facultyTeachingUnits.length === 0;
    }
  }

  getClassrooms(){
    return this.facultyService.facultyClassrooms;
  }

  getTeachingUnits(){
    return this.facultyService.facultyTeachingUnits;
  }

}
