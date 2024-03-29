import {Component, Input, OnInit} from '@angular/core';
import {FacultyService} from "../../services/faculty.service";
import {TranslationService} from "../../services/translation.service";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import {Router} from "@angular/router";
import {Classe} from "../../models/Classe";
import {ActionZone} from "../../models/ActionZone";

@Component({
  selector: 'app-multi-courses-time-table',
  templateUrl: './multi-courses-time-table.component.html',
  styleUrls: ['./multi-courses-time-table.component.scss']
})
export class MultiCoursesTimeTableComponent implements OnInit {

  @Input("filter") filter: {actionZone: ActionZone, itemId: any} = {actionZone: ActionZone.GLOBAL, itemId: null};

  isExporting: boolean = false;

  showDownloadsButtons: boolean = false;

  constructor(
    private facultyService: FacultyService,
    private translationService: TranslationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  get classrooms()
  {
    if(this.filter.actionZone === ActionZone.GLOBAL)
    {
      return this.facultyService.facultyClassrooms;
    }
    else if(this.filter.actionZone === ActionZone.DEPARTMENT)
    {
      return this.facultyService.getADepartmentClassrooms(this.filter.itemId);
    }
    else if(this.filter.actionZone === ActionZone.SECTOR)
    {
      return this.facultyService.getASectorClassrooms(this.filter.itemId);
    }
    else{
      return [];
    }
  }

  get faculty()
  {
    return this.facultyService.currentFaculty;
  }

  exportAll()
  {
    this.isExporting = true;
    console.log("okokoko")
    setTimeout(() =>{
      let pdf = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF

      let fileName = "Planex_Course_Planning_of_"+this.faculty.nom + ".pdf";

      let temp = this.classrooms.length > 2 ? 2 : this.classrooms.length;

      for(let i = 0; i< temp; i++) {
        console.log("77777")
        let classroom = this.classrooms[i];
        let id = "courseTimeTable" + classroom.id;
        html2canvas(<HTMLElement>document.getElementById(id)).then(canvas => {
          // Few necessary setting options

          const contentDataURL = canvas.toDataURL('image/png')

          let width = pdf.internal.pageSize.getWidth();
          let height = canvas.height * width / canvas.width;
          pdf.addImage(contentDataURL, 'PNG', 0, 5, width, height);
          pdf.addPage();
        });
      }
      pdf.save(fileName);
      this.isExporting = false;

    }, 200)

  }

  onSelectClassroom(classroom: Classe)
  {
    //this.hasSelectedClassroom = true;
    this.router.navigate(["plannings/courses"], {queryParams: {classroom: classroom.code}});
  }

  activateDownloadButtons(){
    this.showDownloadsButtons = true;
  }

  desactivateDownloadButtons(){
    this.showDownloadsButtons = false;
  }


}
