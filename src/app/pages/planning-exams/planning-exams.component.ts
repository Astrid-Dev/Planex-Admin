import { Component } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {Classe} from "../../models/Classe";
import {Filiere} from "../../models/Filiere";
import {Departement} from "../../models/Departement";
import {ActionZone} from "../../models/ActionZone";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {PlanningCoursesService} from "../../services/planning-courses.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NgxSmartModalService} from "ngx-smart-modal";
import Swal from "sweetalert2";
import {DataManagementService} from "../../services/data-management.service";
import {Exam} from "../../models/Exam";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

const MODAL_ID = "coursesPlanningGenerationModal";

@Component({
  selector: 'app-planning-exams',
  templateUrl: './planning-exams.component.html',
  styleUrls: ['./planning-exams.component.scss']
})
export class PlanningExamsComponent {


  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];

  hasLoadedClassrooms: boolean | null = null;
  hasLoadedPlannings: boolean | null = null;

  hasSelectedClassroom: boolean = false;
  hasSelectedSector: boolean = false;
  hasSelectedDepartment: boolean = false;
  hasSelectedGlobalPlanning: boolean = false;

  selectedClassroomCode: string | null = null;
  selectedSectorCode: string | null = null;
  selectedDepartmentName: string | null = null;

  currentClassroom: Classe | null = null;
  currentSector: Filiere | null = null;
  currentDepartment: Departement | null = null;

  currentClassroomSector : string | undefined;

  currentActionZone: ActionZone = ActionZone.GLOBAL;
  currentActionZoneId: any = null;

  modal: any = null;

  exams: Exam[] = [];

  newExamForm!: FormGroup;
  newExamFormIsSubmitted: boolean = false;

  datesList: {date: Date; isChecked: boolean}[] = [];

  constructor(
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private planningCoursesService: PlanningCoursesService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxSmartModalService: NgxSmartModalService,
    private dataManagementService: DataManagementService,
    private formBuilder: FormBuilder
  ) {
    router.events
      .subscribe(event =>
      {
        if(event instanceof NavigationEnd)
        {
          if(this.route.snapshot.queryParamMap.get("classroom"))
          {
            this.hasSelectedGlobalPlanning = false;
            this.hasSelectedDepartment = false;
            this.hasSelectedSector = false;
            this.selectedClassroomCode = this.route.snapshot.queryParamMap.get("classroom");
            this.hasSelectedClassroom = true;
            this.currentActionZone = ActionZone.CLASSROOM;
            this.currentActionZoneId = null;
            this.verifyClassroomCode();
          }
          else if(this.route.snapshot.queryParamMap.get("sector"))
          {
            this.hasSelectedGlobalPlanning = false;
            this.hasSelectedDepartment = false;
            this.hasSelectedClassroom = false;
            this.selectedSectorCode = this.route.snapshot.queryParamMap.get("sector");
            this.hasSelectedSector = true;
            this.verifySectorCode();
          }
          else if(this.route.snapshot.queryParamMap.get("department"))
          {
            this.hasSelectedClassroom = false;
            this.hasSelectedSector = false;
            this.hasSelectedGlobalPlanning = false;
            this.selectedDepartmentName = this.route.snapshot.queryParamMap.get("department");
            this.hasSelectedDepartment = true;
            this.verifyDepartmentName();
          }
          else
          {
            this.hasSelectedClassroom = false;
            this.hasSelectedSector = false;
            this.hasSelectedDepartment = false;
            this.currentActionZone = ActionZone.GLOBAL;
            this.currentActionZoneId = null;
            if (this.route.snapshot.queryParamMap.get("filter") && this.route.snapshot.queryParamMap.get("filter") === "all")
            {
              this.hasSelectedGlobalPlanning = true;
            }
            else
            {
              this.hasSelectedGlobalPlanning = false;
            }
          }
        }
      });
  }

  ngOnInit(): void {
    this.loadDatas();

    this.pageTitle = "PLANNINGS.EXAMS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.PLANNING.TITLE",
        link: "configurations"
      },
      {
        linkName: "SIDEMENU.PLANNING.EXAMS"
      }
    );
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
  }

  loadDatas()
  {
    this.loadClassrooms();
    this.loadPlannings();
  }
  async loadClassrooms()
  {
    this.hasLoadedClassrooms = null;
    try {
      if(!this.dataManagementService.hasSyncedData)
      {
        const data: any = await this.facultyService.findOneFacultyWithSubsDatas(1);
        this.dataManagementService.syncData(data);
        this.verifyClassroomCode();
        this.verifySectorCode();
        this.hasLoadedClassrooms = true;
      }
      else
      {
        const data = await Promise.all([
          this.dataManagementService.getClasses(),
          this.dataManagementService.getSectors(),
          this.dataManagementService.getDepartments(),
          this.dataManagementService.getLevels(),
          this.dataManagementService.getRooms(),
          this.dataManagementService.getTeachers(),
          this.dataManagementService.getTeachingUnits(),
          this.dataManagementService.getScheduleTypes(),
          this.dataManagementService.getCoursesRepartition(),
          this.dataManagementService.getExams()
        ]);
        console.log(data[0]);
        this.facultyService.setFacultyClassrooms(data[0]);
        this.facultyService.setFacultySectors(data[1]);
        this.facultyService.setFacultyDepartments(data[2]);
        this.facultyService.setFacultyLevels(data[3]);
        this.facultyService.setFacultyRooms(data[4]);
        this.facultyService.setFacultyTeachers(data[5]);
        this.facultyService.setFacultyTeachingUnits(data[6]);
        this.facultyService.setFacultyTimesType(data[7]);
        this.facultyService.setFacultyCoursesRepartition(data[8]);
        this.exams = data[9];

        if (!this.currentExam) {
          this.newExamForm = this.formBuilder.group({
            semester: [null, [Validators.required, Validators.min(1), Validators.max(2)]],
            schoolYear: [null, [Validators.required]],
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]],
          });

          this.newExamForm.controls.startDate.valueChanges.subscribe({
            next: (value) => {
              this.datesList = [];
            }
          });

          this.newExamForm.controls.endDate.valueChanges.subscribe({
            next: (value) => {
              this.datesList = [];
            }
          });
        }
        this.verifyClassroomCode();
        this.verifySectorCode();
        this.hasLoadedClassrooms = true;
      }
    } catch (error) {
      console.error(error);
      this.hasLoadedClassrooms = false;
    }
  }

  loadPlannings()
  {
    this.hasLoadedPlannings = null;
    if(!this.planningCoursesService.hasLoaded)
    {
      this.planningCoursesService.loadPlannings()
        .then((res) =>{
          this.hasLoadedPlannings = true;
        })
        .catch((err) =>{
          this.hasLoadedPlannings = false;
        });
    }
    else{
      this.hasLoadedPlannings = true;
    }
  }


  get canDisplay()
  {
    return (this.facultyService.facultyTeachers.length > 0 &&
      this.facultyService.facultyTeachingUnits.length > 0 &&
      this.facultyService.facultyRooms.length > 0 &&
      this.facultyService.facultyClassrooms.length > 0 &&
      this.facultyService.facultyCoursesRepartition.length > 0 &&
      this.facultyService.facultyTimes.length > 0
    );
  }

  get canShowClassroomsList()
  {
    return (this.hasLoadedDatasWithSuccess && !(this.hasSelectedClassroom || this.hasSelectedSector || this.hasSelectedDepartment || this.hasSelectedGlobalPlanning));
  }

  get hasLoadedDatasWithError()
  {
    return (this.hasLoadedClassrooms === false && this.hasLoadedPlannings !== null) || (this.hasLoadedPlannings === false && this.hasLoadedClassrooms !== null);
  }

  get hasLoadedDatasWithSuccess()
  {
    return this.hasLoadedPlannings === true && this.hasLoadedClassrooms === true;
  }

  get isLoading()
  {
    return this.hasLoadedClassrooms === null || this.hasLoadedPlannings === null;
  }

  get canShowTimeTable()
  {
    return this.canDisplay && this.hasSelectedClassroom && this.timeTypeHasBeenConfigured;
  }

  get canShowTimeTypeWarning()
  {
    return this.canDisplay && this.hasSelectedClassroom && !this.timeTypeHasBeenConfigured;
  }

  get canShowMultiTimeTables()
  {
    return this.canDisplay && (this.hasSelectedGlobalPlanning || this.hasSelectedDepartment || this.hasSelectedSector);
  }

  get classrooms()
  {
    return this.facultyService.classrooms;
  }

  get departments()
  {
    return this.facultyService.facultyDepartments;
  }

  get sectors()
  {
    return this.facultyService.facultySectors;
  }

  get currentExam() {
    return this.exams.find(elt => elt.facultyId === 1);
  }

  get newExamFormControls()
  {
    return this.newExamForm.controls;
  }

  verifyClassroomCode()
  {
    let classroom: any = this.classrooms.find(elt => elt.code === this.selectedClassroomCode);
    if(!classroom)
    {
      this.hasSelectedClassroom = false;
    }
    else
    {
      this.currentClassroom = classroom;
      this.currentClassroomSector = this.sectors.find(elt => elt.id === classroom.filiereId)?.code;
      this.hasSelectedClassroom = true;
    }
  }

  verifySectorCode()
  {
    let sector: any = this.sectors.find(elt => elt.code === this.selectedSectorCode);
    if(!sector)
    {
      this.hasSelectedSector = false;
    }
    else
    {
      this.currentActionZone = ActionZone.SECTOR;
      this.currentActionZoneId = sector.id;
      this.currentSector = sector;
      this.hasSelectedSector = true;
    }

  }

  verifyDepartmentName()
  {
    let department: any = this.departments.find(elt => (elt.nom.toUpperCase() === this.selectedDepartmentName?.toUpperCase() || elt.nom_en.toUpperCase() === this.selectedDepartmentName?.toUpperCase()));
    if(!department)
    {
      this.hasSelectedDepartment = false;
    }
    else
    {
      this.currentActionZone = ActionZone.DEPARTMENT;
      this.currentActionZoneId = department.id;
      this.currentDepartment = department;
      this.hasSelectedDepartment = true;
    }

  }

  get timeTypeHasBeenConfigured()
  {
    let timeType = ((this.currentClassroom !== null) ? (this.sectors.find(elt => elt.id === this.currentClassroom?.filiereId)?.typeHoraireId) : null);
    // return timeType !== null;
    return true;
  }

  retry()
  {
    if(!this.hasLoadedPlannings)
    {
      this.loadPlannings();
    }
    if(!this.hasLoadedClassrooms)
    {
      this.loadClassrooms();
    }
  }

  goToSectorConfigurationTime()
  {
    this.router.navigate(["configurations/times"], {state: {sector: this.currentClassroomSector, classroom: this.selectedClassroomCode}});
  }

  onSelectAAllClassrooms()
  {
    this.openModal({filter: "all"}, this.translationService.getValueOf("PLANNINGS.COURSES.NOPLANNING"), ActionZone.GLOBAL);
    //this.router.navigate(["plannings/courses"], {queryParams: {filter: "all"}});
  }

  onSelectDepartmentClassrooms(department: Departement)
  {
    this.openModal({department: this.translationService.getCurrentLang() === "fr" ? department.nom : department.nom_en}, this.translationService.getValueOf("PLANNINGS.COURSES.NODEPARTMENTPLANNING"), ActionZone.DEPARTMENT, department.id);
    //this.router.navigate(["plannings/courses"], {queryParams: {department: this.translationService.getCurrentLang() === "fr" ? department.nom : department.nom_en}});
  }

  onSelectSectorClassrooms(sector: Filiere)
  {
    this.openModal({sector: sector.code}, this.translationService.getValueOf("PLANNINGS.COURSES.NOSECTORPLANNING"), ActionZone.SECTOR, sector.id);
    //this.router.navigate(["plannings/courses"], {queryParams: {filter: sector.code}});
  }

  onSelectClassroom(classroom: Classe)
  {
    this.openModal({classroom: classroom.code}, this.translationService.getValueOf("PLANNINGS.COURSES.NOCLASSROOMPLANNING"), ActionZone.CLASSROOM, classroom.id);
    //this.router.navigate(["plannings/courses"], {queryParams: {classroom: classroom.code}});
  }

  openModal(queryParams: any, alertText: string, actionZone: ActionZone, itemId: any = null)
  {
    Swal.fire({
      text: alertText,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: this.translationService.getValueOf("SUBMITS.YES"),
      denyButtonText: this.translationService.getValueOf("SUBMITS.NO"),
      cancelButtonText: this.translationService.getValueOf("SUBMITS.CANCEL")
    }).then((result) => {
      if (result.isConfirmed) {
        this.modal.setData({actionZone: actionZone, queryParams: queryParams, itemId: itemId}, true);
        this.modal.open();
      } else if (result.isDenied) {
        this.router.navigate(["plannings/courses"], {queryParams: queryParams});
      }
    })
  }

  onSubmitDates() {
    this.newExamFormIsSubmitted = true;
    if (!this.newExamForm.valid) {
      return;
    }

    const startDate = new Date(this.newExamForm.value.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(this.newExamForm.value.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (endDate.getTime() < startDate.getTime()) {
      Swal.fire({
        title: this.translationService.getValueOf('PLANNINGS.EXAMS.NEWEXAMFORM.INVALIDDATES'),
        text: this.translationService.getValueOf('PLANNINGS.EXAMS.NEWEXAMFORM.INVALIDDATESERROR'),
        icon: "error",
      });
      return;
    }

    if (new Date().getTime() > endDate.getTime() || new Date().getTime() > startDate.getTime()) {
      Swal.fire({
        title: this.translationService.getValueOf('PLANNINGS.EXAMS.NEWEXAMFORM.INVALIDDATES'),
        text: this.translationService.getValueOf('PLANNINGS.EXAMS.NEWEXAMFORM.PASSEDDATE'),
        icon: "error",
      });
      return;
    }

    let currentDate = startDate;
    while(currentDate.getTime() <= endDate.getTime()) {
      this.datesList.push({
        date: currentDate,
        isChecked: true
      });
      currentDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
    }
  }
}
