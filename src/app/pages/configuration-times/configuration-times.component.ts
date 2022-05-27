import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {Filiere} from "../../models/Filiere";
import {NgxSmartModalService} from "ngx-smart-modal";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

const MODAL_ID = "timeTypeSelection";

@Component({
  selector: 'app-configuration-times',
  templateUrl: './configuration-times.component.html',
  styleUrls: ['./configuration-times.component.scss']
})
export class ConfigurationTimesComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];

  selectedSector : Filiere | null = null;
  modal: any = null;

  preferedSector: string | null = null;
  classroomOrigin: string | null = null;

  showSectorsList: boolean = true;

  constructor(
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private ngxSmartModalService: NgxSmartModalService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.pageTitle = "CONFIGURATIONS.TIMES.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.CONFIGURATIONS.TITLE",
        link: "configurations"
      },
      {
        linkName: "SIDEMENU.CONFIGURATIONS.SCHEDULE"
      }
    );

    let state: any = history.state;

    if(state && state.classroom && state.sector)
    {
      this.preferedSector = state.sector;
      this.classroomOrigin = state.classroom;
    }
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
  }

  onSelectSector(result: {sector: Filiere, searchText: string | null})
  {
    this.selectedSector = result.sector;
    this.preferedSector = result.searchText;
    this.modal.setData(result.sector, true);
    this.modal.open();
  }

  onModifySector()
  {
    this.showSectorsList = false;
    setTimeout(() =>{
      this.showSectorsList = true;
    }, 1);
    //this.showSectorsList = true;

    if(this.classroomOrigin !== null && this.selectedSector?.code === this.preferedSector)
    {
      this.router.navigate(["plannings/courses-and-tutorials"], {queryParams: {classroom: this.classroomOrigin}});
    }
  }

}
