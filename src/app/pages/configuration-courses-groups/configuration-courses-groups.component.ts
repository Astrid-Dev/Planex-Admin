import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {NgxSmartModalService} from "ngx-smart-modal";
import {FacultyService} from "../../services/faculty.service";
import {Classe} from "../../models/Classe";

const MODAL_ID = "courseGroupsDefinition";

@Component({
  selector: 'app-configuration-courses-groups',
  templateUrl: './configuration-courses-groups.component.html',
  styleUrls: ['./configuration-courses-groups.component.scss']
})
export class ConfigurationCoursesGroupsComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];

  selectedClassroom: Classe | null = null;
  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private ngxSmartModalService: NgxSmartModalService,
    private facultyService: FacultyService
  ) { }

  ngOnInit(): void {

    this.pageTitle = "CONFIGURATIONS.COURSESGROUPS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.CONFIGURATIONS.TITLE",
        link: "configurations"
      },
      {
        linkName: "SIDEMENU.CONFIGURATIONS.COURSESGROUPS"
      }
    );
  }

  ngAfterViewInit(): void {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
  }

  onSelectClassroom(classroom: Classe)
  {
    console.log(classroom);
    this.selectedClassroom = classroom;
    this.modal.setData(classroom, true);
    this.modal.open();
  }

}
