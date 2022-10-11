import {Component, Input, OnInit} from '@angular/core';
import {ActionZone} from "../../models/ActionZone";
import {FacultyService} from "../../services/faculty.service";
import {TranslationService} from "../../services/translation.service";
import {Router} from "@angular/router";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import {Classe} from "../../models/Classe";

@Component({
  selector: 'app-multi-tutorials-time-table',
  templateUrl: './multi-tutorials-time-table.component.html',
  styleUrls: ['./multi-tutorials-time-table.component.scss']
})
export class MultiTutorialsTimeTableComponent implements OnInit {

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

  async export()
  {
    this.isExporting = true;

    setTimeout(() =>{
      let pdf = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF

      let fileName = "Planex_Tutorials_Planning_of_"+this.faculty.nom + ".pdf";

      let promises = this.classrooms.map((classroom, index) =>{
        return new Promise((resolve, reject) =>{
          let id = "courseTimeTable"+classroom.id;
          html2canvas(<HTMLElement>document.getElementById(id)).then(canvas => {
            // Few necessary setting options

            const contentDataURL = canvas.toDataURL('image/jpeg')

            let width = pdf.internal.pageSize.getWidth();
            let height = canvas.height * width / canvas.width;
            pdf.addImage(contentDataURL, 'JPEG', 0, 5, width, height);
            pdf.addPage();

            resolve(true);
          });
        })
      });

      Promise.all(promises)
        .then((res) =>{
          pdf.save(fileName);
          this.isExporting = false;
        })
        .catch((err) =>{
          console.error(err);
        })
    }, 200)

  }

  onSelectClassroom(classroom: Classe)
  {
    //this.hasSelectedClassroom = true;
    this.router.navigate(["plannings/tutorials"], {queryParams: {classroom: classroom.code}});
  }

  activateDownloadButtons(){
    this.showDownloadsButtons = true;
  }

  desactivateDownloadButtons(){
    this.showDownloadsButtons = false;
  }


}
