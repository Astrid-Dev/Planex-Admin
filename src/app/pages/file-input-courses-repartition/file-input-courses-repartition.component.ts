import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {RepartitionCours} from "../../models/RepartitionCours";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import Swal from "sweetalert2";
import deleteProperty = Reflect.deleteProperty;
import {CoursesRepartitionService} from "../../services/courses-repartition.service";
import {NgxSmartModalService} from "ngx-smart-modal";

const MODAL_ID = "courseRepartitionEditionModal";

@Component({
  selector: 'app-file-input-courses-repartition',
  templateUrl: './file-input-courses-repartition.component.html',
  styleUrls: ['./file-input-courses-repartition.component.scss']
})
export class FileInputCoursesRepartitionComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  coursesRepartition: RepartitionCours[] = [];
  badsCoursesRepartition: RepartitionCours[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  hasFoundBadsDatas: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private coursesRepartitionService: CoursesRepartitionService,
    private facultyService: FacultyService,
    private ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.COURSESREPARTITION.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.COURSESREPARTITION",
        link: "files-input/courses-repartition"
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
    this.coursesRepartitionService.extractDataFromFile(resultString, this.facultyService.currentFaculty.anneeScolaireId)
      .then((coursesRepartition) =>{
        this.coursesRepartition = coursesRepartition;
        this.syncRepartitionWithTeachersAndTeachingUnits();
        console.log(coursesRepartition);
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

  syncRepartitionWithTeachersAndTeachingUnits()
  {
    let syncRepartitions: RepartitionCours[] = [];
    let unSyncRepartitions: RepartitionCours[] = [];

    this.coursesRepartition.forEach((courseR) =>{
      if((typeof courseR.ueId === "undefined" || courseR.ueId === null) || (typeof courseR.enseignant1Id === "undefined" || courseR.enseignant1Id === null) || (typeof courseR.enseignant2Id === "undefined") || (typeof courseR.enseignant3Id === "undefined") || (typeof courseR.enseignant4Id === "undefined"))
      {
        let teachingUnitIsValid: boolean = true;
        let teacher1IsValid: boolean = true;
        let teacher2IsValid: boolean = true;
        let teacher3IsValid: boolean = true;
        let teacher4IsValid: boolean = true;
        let temp = {...courseR};

        if((typeof courseR.ueId === "undefined" || courseR.ueId === null))
        {
          teachingUnitIsValid = false;
          let classroom = this.classrooms.find(elt => elt.code === courseR.classe);
          if(classroom)
          {
            let classroomId = classroom.id;
            let classroomTeachingUnit = this.teachingUnits.find(elt => elt.classeId === classroomId && elt.code === courseR.ue);
            if(classroomTeachingUnit)
            {
              deleteProperty(temp, "ue");
              teachingUnitIsValid = true;
              temp = {...temp, ueId: classroomTeachingUnit.id, classeId: classroom.id};
            }
            else{
              temp = {
                ...temp,
                defaultUe: ""+courseR.ue,
                ueId: null,
                classeId: classroom.id
              }
            }
          }
          else{
            temp = {
              ...temp,
              defaultClasse: courseR.classe,
              ueId: null
            }
          }
        }
        if((typeof courseR.enseignant1Id === "undefined" || courseR.enseignant1Id === null))
        {
          teacher1IsValid = false;
          let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant1);
          if(teacher)
          {
            deleteProperty(temp, "enseignant1");
            teacher1IsValid = true;
            temp = {...temp, enseignant1Id: teacher.id};
          }
          else{
            temp = {...temp, defaultEnseignant1: ""+courseR.enseignant1, enseignant1Id: null};
          }
        }
        if((typeof courseR.enseignant2Id === "undefined"))
        {
          if(courseR.enseignant2 === "")
          {
            deleteProperty(temp, "enseignant2");
            teacher2IsValid = true;
            temp = {...temp, enseignant2Id: null};
          }
          else{
            teacher2IsValid = false;
            let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant2);
            if(teacher)
            {
              deleteProperty(temp, "enseignant2");
              teacher2IsValid = true;
              temp = {...temp, enseignant2Id: teacher.id};
            }
            else{
              temp = {...temp, defaultEnseignant2: ""+courseR.enseignant2};
            }
          }
        }
        if((typeof courseR.enseignant3Id === "undefined"))
        {
          if(courseR.enseignant3 === "")
          {
            deleteProperty(temp, "enseignant3");
            teacher3IsValid = true;
            temp = {...temp, enseignant3Id: null};
          }
          else{
            teacher3IsValid = false;
            let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant3);
            if(teacher)
            {
              deleteProperty(temp, "enseignant3");
              teacher3IsValid = true;
              temp = {...temp, enseignant3Id: teacher.id};
            }
            else{
              temp = {...temp, defaultEnseignant3: ""+courseR.enseignant3};
            }
          }
        }
        if((typeof courseR.enseignant4Id === "undefined"))
        {
          if(courseR.enseignant4 === "")
          {
            deleteProperty(temp, "enseignant4");
            teacher4IsValid = true;
            temp = {...temp, enseignant4Id: null};
          }
          else{
            teacher4IsValid = false;
            let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant4);
            if(teacher)
            {
              deleteProperty(temp, "enseignant4");
              teacher4IsValid = true;
              temp = {...temp, enseignant4Id: teacher.id};
            }
            else{
              temp = {...temp, defaultEnseignant4: ""+courseR.enseignant4};
            }
          }
        }

        if(teachingUnitIsValid && teacher1IsValid && teacher2IsValid && teacher3IsValid && teacher4IsValid)
        {
          syncRepartitions.push(temp);
        }
        else{
          unSyncRepartitions.push(temp);
        }
      }
      else
      {
        syncRepartitions.push(courseR);
      }

    });

    this.badsCoursesRepartition.forEach((courseR) =>{
      let teachingUnitIsValid: boolean = true;
      let teacher1IsValid: boolean = true;
      let teacher2IsValid: boolean = true;
      let teacher3IsValid: boolean = true;
      let teacher4IsValid: boolean = true;
      let temp = {...courseR};

      if((typeof courseR.ueId === "undefined" || courseR.ueId === null))
      {
        teachingUnitIsValid = false;
        let classroom = this.classrooms.find(elt => elt.code === courseR.classe);
        if(classroom)
        {
          let classroomId = classroom.id;
          let classroomTeachingUnit = this.teachingUnits.find(elt => elt.classeId === classroomId && elt.code === courseR.ue);
          if(classroomTeachingUnit)
          {
            deleteProperty(temp, "ue");
            teachingUnitIsValid = true;
            temp = {...temp, ueId: classroomTeachingUnit.id, classeId: classroom.id};
          }
          else{
            temp = {
              ...temp,
              defaultUe: ""+courseR.ue,
              ueId: null,
              classeId: classroom.id
            }
          }
        }
        else{
          temp = {
            ...temp,
            defaultClasse: courseR.classe,
            ueId: null
          }
        }
      }
      if((typeof courseR.enseignant1Id === "undefined" || courseR.enseignant1Id === null))
      {
        teacher1IsValid = false;
        let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant1);
        if(teacher)
        {
          deleteProperty(temp, "enseignant1");
          teacher1IsValid = true;
          temp = {...temp, enseignant1Id: teacher.id};
        }
        else{
          temp = {...temp, defaultEnseignant1: ""+courseR.enseignant1, enseignant1Id: null};
        }
      }
      if((typeof courseR.enseignant2Id === "undefined"))
      {
        if(courseR.enseignant2 === "")
        {
          deleteProperty(temp, "enseignant2");
          teacher2IsValid = true;
          temp = {...temp, enseignant2Id: null};
        }
        else{
          teacher2IsValid = false;
          let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant2);
          if(teacher)
          {
            deleteProperty(temp, "enseignant2");
            teacher2IsValid = true;
            temp = {...temp, enseignant2Id: teacher.id};
          }
          else{
            temp = {...temp, defaultEnseignant2: ""+courseR.enseignant2};
          }
        }
      }
      if((typeof courseR.enseignant3Id === "undefined"))
      {
        if(courseR.enseignant3 === "")
        {
          deleteProperty(temp, "enseignant3");
          teacher3IsValid = true;
          temp = {...temp, enseignant3Id: null};
        }
        else{
          teacher3IsValid = false;
          let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant3);
          if(teacher)
          {
            deleteProperty(temp, "enseignant3");
            teacher3IsValid = true;
            temp = {...temp, enseignant3Id: teacher.id};
          }
          else{
            temp = {...temp, defaultEnseignant3: ""+courseR.enseignant3};
          }
        }
      }
      if((typeof courseR.enseignant4Id === "undefined"))
      {
        if(courseR.enseignant4 === "")
        {
          deleteProperty(temp, "enseignant4");
          teacher4IsValid = true;
          temp = {...temp, enseignant4Id: null};
        }
        else{
          teacher4IsValid = false;
          let teacher = this.teachers.find(elt => elt.noms === courseR.enseignant4);
          if(teacher)
          {
            deleteProperty(temp, "enseignant4");
            teacher4IsValid = true;
            temp = {...temp, enseignant4Id: teacher.id};
          }
          else{
            temp = {...temp, defaultEnseignant4: ""+courseR.enseignant4};
          }
        }
      }

      if(teachingUnitIsValid && teacher1IsValid && teacher2IsValid && teacher3IsValid && teacher4IsValid)
      {
        syncRepartitions.push(temp);
      }
      else{
        unSyncRepartitions.push(temp);
      }
    });


    this.coursesRepartition = syncRepartitions;
    console.log(syncRepartitions);
    console.log(unSyncRepartitions);
    if(unSyncRepartitions.length > 0)
    {
      console.log("ok")
      this.hasFoundBadsDatas = true;
      this.badsCoursesRepartition = unSyncRepartitions;
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.WARNING"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.BADSDATAS"),
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    else
    {
      this.badsCoursesRepartition = [];
      this.hasFoundBadsDatas = false;
      this.sendRepartitions();
    }
  }

  continueReading()
  {
    this.hasFoundBadsDatas = false;
    this.syncRepartitionWithTeachersAndTeachingUnits();
  }

  sendRepartitions()
  {
    this.isImporting = true;
    this.coursesRepartitionService.createCoursesRepartition(this.coursesRepartition)
      .then((coursesRepartition: RepartitionCours[] | any) =>{
        this.facultyService.setFacultyCoursesRepartition(coursesRepartition);
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
    let result = (this.hasLoadedDatas && this.facultyService.facultyCoursesRepartition.length > 0);

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
    return ((this.hasLoadedDatas) && (this.facultyService.facultyTeachingUnits.length > 0 && this.facultyService.facultyTeachers.length > 0));

  }

  get teachers()
  {
    return this.facultyService.facultyTeachers;
  }

  get teachingUnits()
  {
    return this.facultyService.facultyTeachingUnits;
  }

  get classrooms()
  {
    return this.facultyService.facultyClassrooms;
  }

  getAclassroomTeachingUnits(classroomCode: string | undefined)
  {
    return this.teachingUnits.filter(elt => {
      let classroom = this.classrooms.find(c => c.id === elt.classeId);
      return classroom?.code === classroomCode;
    });
  }

  onConsult()
  {
    this.coursesRepartition = this.facultyService.facultyCoursesRepartition;
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

  teacher(teacherId: any)
  {
    return teacherId === null ? "" : this.teachers.find(elt => elt.id === teacherId)?.noms;
  }

  teachingUnit(teachingUnitId: any){
    return this.teachingUnits.find(elt => elt.id === teachingUnitId)?.code;
  }

  dataIsSet(data: any)
  {
    if(data)
    {
      return true;
    }
    else{
      return data === null;
    }
  }

  onEditCourseRepartition(courseRepartition: RepartitionCours)
  {
    this.modal.setData(courseRepartition, true);
    this.modal.open();
  }

  getClassroomByATeachingUnitId(teachingUnitId: any)
  {
    let teachingUnit = this.teachingUnits.find(elt => elt.id === teachingUnitId);
    return this.classrooms.find(elt => elt.id === teachingUnit?.classeId);
  }

}
