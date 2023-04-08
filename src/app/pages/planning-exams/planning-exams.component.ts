import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {Classe} from "../../models/Classe";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {PlanningCoursesService} from "../../services/planning-courses.service";
import Swal from "sweetalert2";
import {Filiere} from "../../models/Filiere";
import {NgxSmartModalService} from "ngx-smart-modal";
import {ActionZone} from "../../models/ActionZone";
import {Departement} from "../../models/Departement";

const MODAL = "coursesPlanningGenerationModal";

@Component({
  selector: 'app-planning-exams',
  templateUrl: './planning-exams.component.html',
  styleUrls: ['./planning-exams.component.scss']
})
export class PlanningExamsComponent implements OnInit {

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

  constructor(
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private planningCoursesService: PlanningCoursesService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxSmartModalService: NgxSmartModalService
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
          if(this.route.snapshot.queryParamMap.get("filter") && this.route.snapshot.queryParamMap.get("filter") === "all")
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
    this.pageTitle = "Planning d'examens"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.PLANNING.TITLE",
        link: "configurations"
      },
      {
        linkName: "SIDEMENU.PLANNING.EX"
      }
    );
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL);
  }

  loadDatas()
  {
    this.loadClassrooms();
    this.loadPlannings();
  }
  loadClassrooms()
  {
    this.hasLoadedClassrooms = null;
    if(!this.facultyService.hasLoaded)
    {
      this.facultyService.findOneFacultyWithSubsDatas(1)
        .then((res) =>{
          this.verifyClassroomCode();
          this.verifySectorCode();

          this.hasLoadedClassrooms = true;
        })
        .catch((err) =>{
          console.error(err);
          this.hasLoadedClassrooms = false;
        });
    }
    else
    {
      this.verifyClassroomCode();
      this.verifySectorCode();
      this.hasLoadedClassrooms = true;
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
    this.openModal({filter: "all"}, this.translationService.getValueOf("PLANNINGS.EXAMS.NOPLANNING"), ActionZone.GLOBAL);
    //this.router.navigate(["plannings/courses"], {queryParams: {filter: "all"}});
  }

  onSelectDepartmentClassrooms(department: Departement)
  {
    this.openModal({department: this.translationService.getCurrentLang() === "fr" ? department.nom : department.nom_en}, this.translationService.getValueOf("PLANNINGS.COURSES.NODEPARTMENTPLANNING"), ActionZone.DEPARTMENT, department.id);
    //this.router.navigate(["plannings/courses"], {queryParams: {department: this.translationService.getCurrentLang() === "fr" ? department.nom : department.nom_en}});
  }

  onSelectSectorClassrooms(sector: Filiere)
  {
    this.openModal({sector: sector.code}, this.translationService.getValueOf("PLANNINGS.EXAMS.NOSECTORPLANNING"), ActionZone.SECTOR, sector.id);
    //this.router.navigate(["plannings/courses"], {queryParams: {filter: sector.code}});
  }

  onSelectClassroom(classroom: Classe)
  {
    this.openModal({classroom: classroom.code}, this.translationService.getValueOf("PLANNINGS.EXAMS.NOCLASSROOMPLANNING"), ActionZone.CLASSROOM, classroom.id);
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
        this.router.navigate(["plannings/exams"], {queryParams: queryParams});
      }
    })
  }

}

