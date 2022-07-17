import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {CheckItem} from "../../models/CheckItem";
import {FacultyService} from "../../services/faculty.service";
import {ActionZone} from "../../models/ActionZone";
import {PlanningCoursesService} from "../../services/planning-courses.service";
import {Router} from "@angular/router";
import {GeneratePlanningParameter} from "../../models/GeneratePlanningParameter";
import {Classe} from "../../models/Classe";

const MODAL_ID = "coursesPlanningGenerationModal";

@Component({
  selector: 'app-modal-courses-planning-generation',
  templateUrl: './modal-courses-planning-generation.component.html',
  styleUrls: ['./modal-courses-planning-generation.component.scss']
})
export class ModalCoursesPlanningGenerationComponent implements OnInit, AfterViewInit {

  modal: any = null;

  daysChecksList: CheckItem[] = [];
  departmentsChecksList: CheckItem[] = [];
  sectorsChecksList: CheckItem[] = [];
  levelsChecksList: CheckItem[] = [];

  selectAllDays: boolean = true;
  selectAllDepartments: boolean = true;
  selectAllSectors: boolean = true;
  selectAllLevels: boolean = true;

  teachingUnitsPerDay = {min: 1, max: 3, value: 1};
  oneTeachingUnitPerWeek = {min: 1, max: 3, value: 1};
  periodsBetweenTwoTeachingUnits = {min: 0, max: 3, value: 0};

  isLoading: boolean = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private planningCoursesService: PlanningCoursesService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{

      this.daysChecksList = this.days.map((elt) => {
        let id: any = elt.id;
        return {
          label: this.translationService.getCurrentLang() === "fr" ? elt.intitule : elt.intitule_en,
          id: id,
          checked: false
        }
      });

      this.sectorsChecksList = this.sectors.map((elt) => {
        let id: any = elt.id;
        return {
          label: elt.code,
          id: id,
          checked: false
        }
      });

      this.departmentsChecksList = this.departments.map((elt) => {
        let id: any = elt.id;
        return {
          label: this.translationService.getCurrentLang() === "fr" ? elt.nom : elt.nom_en,
          id: id,
          checked: false
        }
      });

      this.levelsChecksList = this.levels.map((elt) => {
        let id: any = elt.id;
        return {
          label: elt.code,
          id: id,
          checked: false
        }
      });

      this.onDayCheckChange(true);
      this.onDepartmentCheckChange(true);
      this.onSectorCheckChange(true);
      this.onLevelCheckChange(true);

    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.modal.removeData();
    });
  }

  get sectors()
  {
    return this.isForDepartment ? this.facultyService.facultySectors.filter(elt => elt.departementId === this.itemId) : [];
  }

  get departments()
  {
    return this.isForGlobal ? this.facultyService.facultyDepartments : [];
  }

  get rooms(){
    return this.facultyService.facultyRooms;
  }

  get teachers(){
    return this.facultyService.facultyTeachers;
  }

  get teachingUnits(){
    return this.facultyService.facultyTeachingUnits;
  }

  get allPeriods()
  {
    return this.facultyService.allPeriods;
  }

  getPeriods(sectorId: any = null)
  {
    if(sectorId){
      let sector = this.facultyService.facultySectors.find(elt =>elt.id === sectorId);
      return (sector && sector?.typeHoraireId) ? this.facultyService.facultyTimes.find(elt => elt.id === sector?.typeHoraireId) : this.facultyService.defaultFacultyTimeType.periodes;
    }
    else{
      return this.facultyService.defaultFacultyTimeType.periodes;
    }
  }

  getAClassroomTeachingUnits(classroomId: any){
    return this.facultyService.getTeachingUnitsOfOneClassroom(classroomId);
  }

  get levels()
  {
   return this.isForSector ? this.facultyService.facultyLevels : [];
  }

  get days()
  {
    return this.facultyService.allDays;
  }

  get hasData()
  {
    return this.modal !== null && this.modal.hasData();
  }

  get data()
  {
    return this.hasData ? this.modal.getData() : null;
  }

  get isForGlobal(){
    return this.data?.actionZone === ActionZone.GLOBAL;
  }

  get isForDepartment(){
    return this.data?.actionZone === ActionZone.DEPARTMENT;
  }

  get isForSector(){
    return this.data?.actionZone === ActionZone.SECTOR;
  }
  get isForClassroom(){
    return this.data?.actionZone === ActionZone.CLASSROOM;
  }

  get itemId()
  {
    return this.data?.itemId;
  }


  onDayCheckChange(isForAll: boolean = false)
  {
    if(isForAll)
    {
      if(this.selectAllDays)
      {
        this.daysChecksList.forEach((elt, index, array) =>{
          array[index] = {
            ...elt,
            checked: true
          }
        })
      }
    }
    else{
      let hasCheckAll = true;
      let unCheckItems = 0;
      for(let i = 0; i < this.daysChecksList.length; i++)
      {
        if(!this.daysChecksList[i].checked)
        {
          hasCheckAll = false;
          ++unCheckItems;
        }
      }
      if(!hasCheckAll && unCheckItems === this.daysChecksList.length)
      {
        this.selectAllDays = true;
        this.onDayCheckChange(true);
      }
      else{
        this.selectAllDays = hasCheckAll;
      }
    }
  }

  onDepartmentCheckChange(isForAll: boolean = false)
  {
    if(isForAll)
    {
      if(this.selectAllDepartments)
      {
        this.departmentsChecksList.forEach((elt, index, array) =>{
          array[index] = {
            ...elt,
            checked: true
          }
        })
      }
    }
    else{
      let hasCheckAll = true;
      let unCheckItems = 0;
      for(let i = 0; i < this.departmentsChecksList.length; i++)
      {
        if(!this.departmentsChecksList[i].checked)
        {
          hasCheckAll = false;
          ++unCheckItems;
        }
      }

      if(!hasCheckAll && unCheckItems === this.departmentsChecksList.length)
      {
        this.selectAllDepartments = true;
        this.onDepartmentCheckChange(true);
      }
      else{
        this.selectAllDepartments = hasCheckAll;
      }
    }
  }

  onSectorCheckChange(isForAll: boolean = false)
  {
    if(isForAll)
    {
      if(this.selectAllSectors)
      {
        this.sectorsChecksList.forEach((elt, index, array) =>{
          array[index] = {
            ...elt,
            checked: true
          }
        })
      }
    }
    else{
      let hasCheckAll = true;
      let unCheckItems = 0;
      for(let i = 0; i < this.sectorsChecksList.length; i++)
      {
        if(!this.sectorsChecksList[i].checked)
        {
          hasCheckAll = false;
          ++unCheckItems;
        }
      }

      if(!hasCheckAll && unCheckItems === this.sectorsChecksList.length)
      {
        this.selectAllSectors = true;
        this.onSectorCheckChange(true);
      }
      else{
        this.selectAllSectors = hasCheckAll;
      }
    }
  }

  onLevelCheckChange(isForAll: boolean = false)
  {
    if(isForAll)
    {
      if(this.selectAllLevels)
      {
        this.levelsChecksList.forEach((elt, index, array) =>{
          array[index] = {
            ...elt,
            checked: true
          }
        })
      }
    }
    else{
      let hasCheckAll = true;
      let unCheckItems = 0;
      for(let i = 0; i < this.levelsChecksList.length; i++)
      {
        if(!this.levelsChecksList[i].checked)
        {
          hasCheckAll = false;
          ++unCheckItems;
        }
      }

      if(!hasCheckAll && unCheckItems === this.levelsChecksList.length)
      {
        this.selectAllLevels = true;
        this.onLevelCheckChange(true);
      }
      else{
        this.selectAllLevels = hasCheckAll;
      }
    }
  }

  onTeachingUnitsPerDayChange(sign: boolean)
  {
    if(sign)
    {
      if(this.teachingUnitsPerDay.value < this.teachingUnitsPerDay.max)
      {
        ++this.teachingUnitsPerDay.value;
      }
    }
    else{
      if(this.teachingUnitsPerDay.value > this.teachingUnitsPerDay.min)
      {
        --this.teachingUnitsPerDay.value;
      }
    }
  }

  onOneTeachingUnitPerWeekChange(sign: boolean)
  {
    if(sign)
    {
      if(this.oneTeachingUnitPerWeek.value < this.oneTeachingUnitPerWeek.max)
      {
        ++this.oneTeachingUnitPerWeek.value;
      }
    }
    else{
      if(this.oneTeachingUnitPerWeek.value > this.oneTeachingUnitPerWeek.min)
      {
        --this.oneTeachingUnitPerWeek.value;
      }
    }
  }

  onPeriodsBetweenTwoTeachingUnitsChange(sign: boolean)
  {
    if(sign)
    {
      if(this.periodsBetweenTwoTeachingUnits.value < this.periodsBetweenTwoTeachingUnits.max)
      {
        ++this.periodsBetweenTwoTeachingUnits.value;
      }
    }
    else{
      if(this.periodsBetweenTwoTeachingUnits.value > this.periodsBetweenTwoTeachingUnits.min)
      {
        --this.periodsBetweenTwoTeachingUnits.value;
      }
    }
  }

  onApply()
  {
    this.isLoading = true;

    setTimeout(() =>{
      let selectedDays: any = [];
      this.daysChecksList.forEach(elt =>{
        if(elt.checked)
        {
          selectedDays.push(elt.id)
        }
      })
      if(this.isForClassroom)
      {
        let temp: any = this.facultyService.facultyClassrooms.find(elt => elt.id === this.itemId);

        if(this.classroomShouldCreateGroups(temp?.id))
        {
          this.facultyService.divideAClassroomToFitARoomCapacity(temp?.id)
        }

        let classroom: any = this.facultyService.facultyClassrooms.find(elt => elt.id === this.itemId);
        let options: GeneratePlanningParameter = {
          days: this.days,
          teachingUnits: this.getAClassroomTeachingUnits(classroom?.id),
          oneTeachingUnitPerWeek: this.oneTeachingUnitPerWeek.value,
          rooms: this.rooms,
          allPeriods: this.allPeriods,
          periods: this.getPeriods(classroom?.filiereId),
          academicYearId: this.facultyService.facultyAcademicYear.id,
          classroomStudentsNumber: this.facultyService.getAClassroomStudentsNumber(classroom?.id),
          classroom: classroom,
          selectedDays: selectedDays,
          teachingUnitsPerDay: this.teachingUnitsPerDay.value,
          periodsBetweenTwoTeachingUnits: this.periodsBetweenTwoTeachingUnits.value,
          coursesGroups: this.facultyService.getCoursesGroupsOfOneClassroom(classroom?.id),
          coursesRepartition: this.facultyService.getAClassroomCoursesRepartition(classroom?.id)
        }

        this.planningCoursesService.generateAClassroomCoursesPlanning(options);
      }
      else{
        let options: GeneratePlanningParameter[] = [];
        let classrooms: Classe[] = [];

        if(this.isForSector)
        {
          let selectedLevelsId = this.levelsChecksList.map((elt) => {return elt.checked ? elt.id : null});
          selectedLevelsId = selectedLevelsId.filter(elt => elt);

          classrooms = this.facultyService.facultyClassrooms.filter(elt => elt.niveauId && selectedLevelsId.includes(elt.niveauId));
        }
        else if(this.isForDepartment)
        {
          let selectedSectorsId = this.sectorsChecksList.map((elt) => {return elt.checked ? elt.id : null});
          selectedSectorsId = selectedSectorsId.filter(elt => elt);

          classrooms = this.facultyService.facultyClassrooms.filter(elt => elt.filiereId && selectedSectorsId.includes(elt.filiereId));
        }
        else{
          console.log(this.departmentsChecksList)
          let selectedDepartmentsId = this.departmentsChecksList.map((elt) => {return elt.checked ? elt.id : null});
          selectedDepartmentsId = selectedDepartmentsId.filter(elt => elt);
          console.log(selectedDepartmentsId);
          classrooms = [];
          selectedDepartmentsId.forEach((elt) =>{
            classrooms = classrooms.concat(this.facultyService.getADepartmentClassrooms(elt));
          });
        }

        classrooms.forEach((elt) =>{

          if(this.classroomShouldCreateGroups(elt?.id))
          {
            this.facultyService.divideAClassroomToFitARoomCapacity(elt?.id)
          }

          let classroom: any = this.facultyService.facultyClassrooms.find(cl => cl.id === elt.id);
          options.push({
            days: this.days,
            teachingUnits: this.getAClassroomTeachingUnits(classroom?.id),
            oneTeachingUnitPerWeek: this.oneTeachingUnitPerWeek.value,
            rooms: this.rooms,
            allPeriods: this.allPeriods,
            periods: this.getPeriods(classroom?.filiereId),
            academicYearId: this.facultyService.facultyAcademicYear.id,
            classroomStudentsNumber: this.facultyService.getAClassroomStudentsNumber(classroom?.id),
            classroom: classroom,
            selectedDays: selectedDays,
            teachingUnitsPerDay: this.teachingUnitsPerDay.value,
            periodsBetweenTwoTeachingUnits: this.periodsBetweenTwoTeachingUnits.value,
            coursesGroups: this.facultyService.getCoursesGroupsOfOneClassroom(classroom?.id),
            coursesRepartition: this.facultyService.getAClassroomCoursesRepartition(classroom?.id)
          });

          this.planningCoursesService.generateAGroupOfClassroomsCoursesPlanning(options);
        })
      }
      setTimeout(() =>{
        this.isLoading = false;
        this.close();
        this.router.navigate(["plannings/courses"], {queryParams: this.data?.queryParams});
      }, 500)
    }, 500)

  }

  classroomShouldCreateGroups(classroomId: any)
  {
    let result = false;

    let classroom = this.facultyService.facultyClassrooms.find(elt => elt.id === classroomId);
    if(classroom)
    {
      let maxRoomCapacity = this.facultyService.maxRoomCapacity;
       if(this.facultyService.getAClassroomStudentsNumber(classroomId) > maxRoomCapacity)
       {
          result = true;
       }
       else{
         let groups = this.facultyService.getCoursesGroupsOfOneClassroom(classroomId);

         for(let i = 0; i < groups.length; i++)
         {
           let temp: any = groups[i]?.nbre_etudiants ? groups[i].nbre_etudiants : 0;
           if(temp > maxRoomCapacity)
           {
             result = true;
             break;
           }
         }
       }
    }
    else{
      result = false;
    }

    return result;
  }

  close()
  {
    this.modal.close();
  }

}
