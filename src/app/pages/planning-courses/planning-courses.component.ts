import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {Classe} from "../../models/Classe";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {PlanningCoursesService} from "../../services/planning-courses.service";
import Swal from "sweetalert2";
import {Filiere} from "../../models/Filiere";

@Component({
  selector: 'app-planning-courses',
  templateUrl: './planning-courses.component.html',
  styleUrls: ['./planning-courses.component.scss']
})
export class PlanningCoursesComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];

  hasLoadedClassrooms: boolean | null = null;
  hasLoadedPlannings: boolean | null = null;

  hasSelectedClassroom: boolean = false;
  hasSelectedGlobalPlanning: boolean = false;

  selectedClassroomCode: string | null = null;
  currentClassroom: Classe | null = null;

  currentSectorCode: string | undefined = "";

  filterResult: number | null = null;
  filterParam: string | null = null;

  constructor(
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private planningCoursesService: PlanningCoursesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    router.events
      .subscribe(event =>
      {
        if(event instanceof NavigationEnd)
        {
          if(this.route.snapshot.queryParamMap.get("classroom"))
          {
            this.selectedClassroomCode = this.route.snapshot.queryParamMap.get("classroom");
            this.hasSelectedClassroom = true;
            this.hasSelectedGlobalPlanning = false;
            this.verifyClassroomCode();
          }
          else
          {
            if(this.route.snapshot.queryParamMap.get("filter"))
            {
              this.filterParam = this.route.snapshot.queryParamMap.get("filter");
              this.hasSelectedGlobalPlanning = true;
              this.verifySectorCode();
            }
            else
            {
              this.hasSelectedGlobalPlanning = false;
            }
            this.hasSelectedClassroom = false;
          }
        }
      });
  }

  ngOnInit(): void {
    this.loadDatas();

    this.pageTitle = "PLANNINGS.COURSES.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.PLANNING.TITLE",
        link: "configurations"
      },
      {
        linkName: "SIDEMENU.PLANNING.COURSES"
      }
    );
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
      this.facultyService.facultyClassrooms.length > 0
    );
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

  get canShowMultiTimeTables()
  {
    return this.canDisplay && this.hasSelectedGlobalPlanning;
  }

  get classrooms()
  {
    return this.facultyService.classrooms;
  }

  onSelectClassroom(classroom: Classe)
  {
    //this.hasSelectedClassroom = true;
    this.router.navigate(["plannings/courses-and-tutorials"], {queryParams: {classroom: classroom.code}});
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
      this.currentSectorCode = this.facultyService.facultySectors.find(elt => elt.id === classroom.filiereId)?.code;
      this.hasSelectedClassroom = true;
    }
  }

  verifySectorCode()
  {
    if(this.filterParam !== "all")
    {
      let sector: any = this.facultyService.facultySectors.find(elt => elt.code === this.filterParam);
      if(!sector)
      {
        this.filterResult = null;
        this.hasSelectedGlobalPlanning = false;
      }
      else
      {
        this.filterResult = sector.id;
        this.currentSectorCode =  sector.code;
        this.hasSelectedGlobalPlanning = true;
      }
    }
    else
    {
      this.filterResult = null;
      this.hasSelectedGlobalPlanning = true;
    }

  }

  get timeTypeHasBeenConfigured()
  {
    let timeType = this.currentClassroom !== null ? this.facultyService.facultySectors.find(elt => elt.id === this.currentClassroom?.filiereId)?.typeHoraireId : null;

    return timeType !== null;
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
    this.router.navigate(["configurations/times"], {state: {sector: this.currentSectorCode, classroom: this.selectedClassroomCode}});
  }

  onSelectAAllClassrooms()
  {
    this.router.navigate(["plannings/courses-and-tutorials"], {queryParams: {filter: "all"}});
  }

  onSelectSectorClassrooms(sector: Filiere)
  {
    this.router.navigate(["plannings/courses-and-tutorials"], {queryParams: {filter: sector.code}});
  }

}
