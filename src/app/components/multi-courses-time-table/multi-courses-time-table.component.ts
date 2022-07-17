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

  export()
  {
    this.isExporting = true;
    let pdf = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF

    let fileName = "Planex_Course_Planning_of_"+this.faculty.nom + ".pdf";

    this.classrooms.forEach((classroom, index) =>{
      let id = "courseTimeTable"+classroom.id;
      html2canvas(<HTMLElement>document.getElementById(id)).then(canvas => {
        // Few necessary setting options

        const contentDataURL = canvas.toDataURL('image/png')

        let width = pdf.internal.pageSize.getWidth();
        let height = canvas.height * width / canvas.width;
        pdf.addImage(contentDataURL, 'PNG', 0, 5, width, height);
        if(index === this.classrooms.length -1)
        {
          pdf.save(fileName);
          this.isExporting = false;
        }
        else
        {
          pdf.addPage();
        }
      });
    })

  }

  onSelectClassroom(classroom: Classe)
  {
    //this.hasSelectedClassroom = true;
    this.router.navigate(["plannings/courses"], {queryParams: {classroom: classroom.code}});
  }


}
