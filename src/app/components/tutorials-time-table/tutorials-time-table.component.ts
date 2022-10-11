import {Component, Input, OnInit} from '@angular/core';
import {PlanningCours} from "../../models/PlanningCours";
import {FacultyService} from "../../services/faculty.service";
import {TranslationService} from "../../services/translation.service";
import {PlanningCoursesService} from "../../services/planning-courses.service";
import {NgxSmartModalService} from "ngx-smart-modal";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

const MODAL_ID = "coursesPlanningModal";

@Component({
  selector: 'app-tutorials-time-table',
  templateUrl: './tutorials-time-table.component.html',
  styleUrls: ['./tutorials-time-table.component.scss']
})
export class TutorialsTimeTableComponent implements OnInit {

  currentYear = new Date().getFullYear();

  @Input("classroom") classroomCode: string | null = null;
  @Input("readOnly") readOnly: boolean = true;
  @Input("showSaveButton") showSaveButton: boolean = true;

  plannings: PlanningCours[] = [];
  isFirstTimePlanning: boolean = false;

  planningsCeilsToUpdate: PlanningCours[] = [];

  modal: any = null;

  isSaving: boolean = false;

  undefinedPeriods: any = [{id: null, debut: "", debut_en: "", fin: "", fin_en: ""}, {id: null, debut: "", debut_en: "", fin: "", fin_en: ""}, {id: null, debut: "", debut_en: "", fin: "", fin_en: ""}, {id: null, debut: "", debut_en: "", fin: "", fin_en: ""}];

  previousClickItem: PlanningCours | null = null;

  currentHoverItem: PlanningCours | null = null;

  constructor(
    private facultyService: FacultyService,
    private translationService: TranslationService,
    private planningCoursesService: PlanningCoursesService,
    private ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit(): void {
    this.initPlannings();
  }

  ngAfterViewInit() {
    if(!this.readOnly)
    {
      this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    }
  }

  initPlannings()
  {
    let classroomId: any = this.classroom.infos?.id;
    let predefinedPlannings: PlanningCours[] = this.planningCoursesService.getPlanningOfOneClassroom(classroomId);
    this.isFirstTimePlanning = predefinedPlannings.length === 0;
    this.plannings = this.isFirstTimePlanning ? this.defaultPlanning : predefinedPlannings;
  }

  get faculty(){
    return this.facultyService.currentFaculty;
  }

  get classroom()
  {
    return this.facultyService.getAClassroomByCode(this.classroomCode);
  }

  get printedSector()
  {
    let sectorCode = this.classroom.sector?.code;
    return this.translationService.getCurrentLang() === "fr" ? (
        this.translationService.getValueOf("COURSESTIMETABLE.SECTOR") + " " +sectorCode
      )
      : (
        sectorCode+ " "+ this.translationService.getValueOf("COURSESTIMETABLE.SECTOR")
      )
  }

  get printedAcademicYear()
  {
    return this.facultyService.facultyAcademicYear?.debut +" - "+ this.facultyService.facultyAcademicYear?.fin;
  }

  get periods()
  {
    if(this.classroom.sector?.typeHoraireId !== null)
    {
      return this.facultyService.getATimeType(this.classroom.sector?.typeHoraireId)?.periodes;
    }
    else{
      return this.facultyService.defaultFacultyTimeType ? this.facultyService.defaultFacultyTimeType.periodes : this.undefinedPeriods;
    }
  }



  get days()
  {
    return this.facultyService.allDays
      .sort((a, b) => {
        let numero1 = a.numero === 0 ? 100 : a.numero;
        let numero2 = b.numero === 0 ? 100 : b.numero;
        return numero1 - numero2
      });
  }

  get defaultPlanning()
  {

    let result: PlanningCours[] = [];
    if(this.periods && this.days)
    {
      let classroomId: any = this.classroom.infos?.id;
      let academicYearId: any = this.faculty.anneeScolaireId;
      this.periods.forEach((period: any) =>{
        this.days.forEach((day) =>{
          let dayId: any = day.id;
          let periodId: any = period.id;
          result.push({
            id: this.planningCoursesService.getMaxPlanningId() + result.length + 1,
            classeId: classroomId,
            anneeScolaireId: academicYearId,
            enseignant1Id: null,
            enseignant2Id: null,
            enseignant3Id: null,
            enseignant4Id: null,
            salleId: null,
            groupeTdId: null,
            groupeCoursId: null,
            jourId: dayId,
            periodeId: periodId,
            tdId: null,
            ueId: null
          });
        })
      })
    }

    return result;
  }

  getDayName(day: any)
  {
    return this.translationService.getCurrentLang() === "fr" ? day.intitule : day.intitule_en;
  }

  getTimeName(period: any, field: string)
  {
    return this.translationService.getCurrentLang() === "fr" ? period[field] : period[field+"_en"];
  }

  get teachingUnits()
  {
    let classroomId: any = this.classroom.infos?.id;
    return this.facultyService.getTeachingUnitsOfOneClassroom(classroomId);
  }

  get teachers()
  {
    return this.facultyService.facultyTeachers;
  }

  get rooms()
  {
    return this.facultyService.facultyRooms;
  }

  get coursesGroups()
  {
    let classroomId: any = this.classroom.infos?.id;
    return this.facultyService.getCoursesGroupsOfOneClassroom(classroomId);
  }

  get tutorialsGroups()
  {
    let classroomId: any = this.classroom.infos?.id;
    return this.facultyService.getAClassroomTutorialsGroups(classroomId);
  }

  get tutorials()
  {
    let classroomId: any = this.classroom.infos?.id;
    return this.facultyService.getAClassroomTutorials(classroomId);
  }

  get studentsNumber()
  {
    let classroomId: any = this.classroom.infos?.id;
    return this.facultyService.getAClassroomStudentsNumber(classroomId);
  }

  getTeachingUnitCode(teachingUnitId: any)
  {
    let teachingUnit = this.teachingUnits.find(ue => ue.id === teachingUnitId);
    return teachingUnitId === null ? null : ((teachingUnit?.est_optionnelle ? '*' : '') + teachingUnit?.code);
  }

  getTeacherName(teacherId: any)
  {
    return teacherId === null ? null : this.teachers.find(teacher => teacher.id === teacherId)?.noms;
  }

  getRoomCode(roomId: any)
  {
    return roomId === null ? null : this.rooms.find(room => room.id === roomId)?.code;
  }

  getCourseGroupName(courseGroupId: any)
  {
    return courseGroupId === null ? null : this.coursesGroups.find(courseGroup => courseGroup.id === courseGroupId)?.nom;
  }

  getTutorialGroupName(tutorialGroupId: any)
  {
    return tutorialGroupId === null ? null : this.tutorialsGroups.find(tutorialGroup => tutorialGroup.id === tutorialGroupId)?.nom;
  }

  getTutorialCode(tutorialId: any)
  {
    return tutorialId === null ? null : this.tutorials.find(tutorial => tutorial.id === tutorialId)?.code;
  }

  getAPlanningCeilByDayAndPeriod(dayIndex: number, periodIndex: number)
  {
    let index = this.getPlanningIndexByDayAndPeriodIndexes(dayIndex, periodIndex);
    return this.plannings[index];
  }

  getPlanningIndexByDayAndPeriodIndexes(dayIndex: number, periodIndex: number)
  {
    return (this.days.length * periodIndex) + dayIndex;
  }

  getPlanningActivityCodeAt(dayIndex: number, periodIndex: number)
  {
    let planningCeil = this.getAPlanningCeilByDayAndPeriod(dayIndex, periodIndex);
    let result:any = ".";

    if(planningCeil.ueId !== null)
    {
      result = this.getTeachingUnitCode(planningCeil.ueId);
    }
    else if(planningCeil.tdId !== null)
    {
      result = this.getTutorialCode(planningCeil.tdId);
    }

    return result;
  }

  getPlanningRoomCodeAt(dayIndex: number, periodIndex: number)
  {
    let planningCeil = this.getAPlanningCeilByDayAndPeriod(dayIndex, periodIndex);
    let groupCode: any = "";
    let roomCode: string = planningCeil.salleId !== null ? (this.getRoomCode(planningCeil.salleId) + "") : ".";

    if(planningCeil.groupeCoursId !== null)
    {
      groupCode = this.getCourseGroupName(planningCeil.groupeCoursId);
    }
    else if(planningCeil.groupeTdId !== null)
    {
      groupCode = this.getTutorialGroupName(planningCeil.groupeTdId);
    }

    return {
      room: roomCode,
      group: groupCode,
      hasGroup: groupCode !== ""
    };
  }

  getPlanningTeacherAt(dayIndex: number, periodIndex: number, teacherNumber: number)
  {
    let planningCeil: any = this.getAPlanningCeilByDayAndPeriod(dayIndex, periodIndex);

    let fieldId: string = "enseignant"+teacherNumber+"Id";
    let field: string = "enseignant"+teacherNumber;
    let result:any = planningCeil[fieldId] !== null ? this.getTeacherName(planningCeil[fieldId]) : teacherNumber === 1 ? "." : "";

    return result;
  }

  onCeilClick(dayIndex: number, periodIndex: number)
  {
    if(!this.readOnly)
    {
      let currentCeil = this.getAPlanningCeilByDayAndPeriod(dayIndex, periodIndex);
      let classroomId: any = this.classroom.infos?.id;
      let dayName = this.getDayName(this.days[dayIndex]);
      let periodBeginning = this.getTimeName(this.periods?.[periodIndex], "debut");
      let periodEnding = this.getTimeName(this.periods?.[periodIndex], "fin");
      let data = {
        title: this.classroom.infos?.code +" ("+ dayName + ", "+ this.translationService.getValueOf("COURSESTIMETABLE.FROM") +" "+ periodBeginning
          + " " +this.translationService.getValueOf("COURSESTIMETABLE.TO") + " "+periodEnding + ")",
        currentPlannings: this.plannings.filter(elt => elt.id !== currentCeil.id),
        othersPlannings: this.planningCoursesService.getPlanningsWithoutAClassroom(classroomId),
        teachers: this.teachers,
        teachingUnits: this.teachingUnits,
        rooms: this.rooms,
        studentsNumber: this.studentsNumber,
        tutorials: this.tutorials,
        coursesGroups: this.coursesGroups,
        tutorialsGroups: this.tutorialsGroups,
        currentCeil: currentCeil,
        periods: this.facultyService.allPeriods
      }
      this.modal.setData(data, true);
      this.modal.open();
    }
  }

  updateACeil(newCeilDatas: PlanningCours)
  {
    this.addAPlanningCeilToCeilsToUpdate(newCeilDatas);
    this.plannings.forEach((ceil, index, newPlannings) =>{
      if(ceil.id === newCeilDatas.id)
      {
        newPlannings[index] = newCeilDatas;
      }
    });
  }

  addAPlanningCeilToCeilsToUpdate(ceil: PlanningCours)
  {
    if(!this.isFirstTimePlanning)
    {
      let exist: boolean = false;
      this.planningsCeilsToUpdate.forEach((item, index, newPlannings) =>{
        if(item.id === ceil.id)
        {
          exist = true;
          newPlannings[index] = ceil;
        }
      });

      if(!exist)
      {
        this.planningsCeilsToUpdate.push(ceil);
      }
    }
  }

  onSave()
  {
    let classroomId: any = this.classroom.infos?.id;
    if(this.isFirstTimePlanning)
    {
      this.isSaving = true;
      this.planningCoursesService.createPlanningsForAClassroom(this.plannings, classroomId)
        .then((res) =>{
          this.performSavingWithSuccess();
        })
        .catch((err) =>{
          console.error(err);
          this.performSavingWithError();
        })
    }
    else if(this.planningsCeilsToUpdate.length > 0)
    {
      this.isSaving = true;
      this.planningCoursesService.updateAClassroomPlannings(this.planningsCeilsToUpdate, classroomId)
        .then((res) =>{
          this.performSavingWithSuccess();
        })
        .catch((err) =>{
          console.error(err);
          this.performSavingWithError();
        })
    }

  }

  performSavingWithSuccess()
  {
    this.isSaving = false;
    this.isFirstTimePlanning = false;
    this.planningsCeilsToUpdate = [];
    Swal.fire({
      title: this.translationService.getValueOf("ALERT.SUCCESS"),
      text: this.translationService.getValueOf("COURSESTIMETABLE.SUCCESS1")+ " "+ this.classroomCode + " "+this.translationService.getValueOf("COURSESTIMETABLE.SUCCESS2"),
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  performSavingWithError()
  {
    this.isSaving = false;
    Swal.fire({
      title: this.translationService.getValueOf("ALERT.ERROR"),
      text: this.translationService.getValueOf("COURSESTIMETABLE.ERROR1") + " "+ this.classroomCode + " ! "+this.translationService.getValueOf("COURSESTIMETABLE.ERROR2"),
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  get id()
  {
    return "courseTimeTable"+ (this.classroom.infos?.id ? this.classroom.infos.id : "");
  }

  onExport()
  {
    let fileName = "Planex_Course_Planning_of_"+this.classroomCode + ".pdf";
    html2canvas(<HTMLElement>document.getElementById(this.id)).then(canvas => {
      // Few necessary setting options

      const contentDataURL = canvas.toDataURL('image/jpeg')
      let pdf = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF
      let width = pdf.internal.pageSize.getWidth();
      let height = canvas.height * width / canvas.width;
      pdf.addImage(contentDataURL, 'JPEG', 0, 5, width, height);
      // pdf.addPage();
      // pdf.addImage(contentDataURL, 'PNG', 0, 5, width, height);
      pdf.save(fileName); // Generated PDF
    });
  }

  onExchange(ceilPlanning: PlanningCours)
  {
    if(!this.previousClickItem)
    {
      this.previousClickItem = ceilPlanning;
    }
    else if(ceilPlanning !== this.previousClickItem){
      this.plannings.forEach((elt, index, array) =>{
        if(this.previousClickItem && elt.id === this.previousClickItem.id)
        {
          console.log("ok")
          let {id, jourId, jour, periodeId, periode,  ...data} = ceilPlanning;
          array[index] = {
            ...elt,
            ...data
          }
        }
        if(this.previousClickItem && elt.id === ceilPlanning.id)
        {
          console.log("ookok")
          let {id, jourId, jour, periodeId, periode,  ...data} = this.previousClickItem;
          array[index] = {
            ...elt,
            ...data
          }
        }
      });
      this.previousClickItem = null;
    }
    else{
      this.previousClickItem = null;
    }
  }

  isThePreviousClickItem(ceilPlanning: PlanningCours)
  {
    return this.previousClickItem && this.previousClickItem.id === ceilPlanning.id;
  }

  exchangeIconClass(ceilPlanning: PlanningCours)
  {
    return (this.previousClickItem && this.previousClickItem.id === ceilPlanning.id) ? "fa fa-exchange exchange-icon text-primary" : "fa fa-exchange exchange-icon";
  }

  canShowExchangeIcon(ceilPlanning: PlanningCours)
  {
    return (this.currentHoverItem && this.currentHoverItem.id === ceilPlanning.id) ? true : this.isThePreviousClickItem(ceilPlanning);
  }

  onMouseEnterCeilPlanning(ceilPlanning: PlanningCours)
  {
    this.currentHoverItem = ceilPlanning;
  }

  onMouseLeaveCeilPlanning(ceilPlanning: PlanningCours)
  {
    this.currentHoverItem = null;
  }

}
