import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-files-input',
  templateUrl: './files-input.component.html',
  styleUrls: ['./files-input.component.scss']
})
export class FilesInputComponent implements OnInit {

  pageTitle = "";
  searchValue: string = "";

  files_type_list: any = [];
  list: any = [];

  constructor(private translationService: TranslationService, private router: Router) {
  }

  ngOnInit(): void {
    this.pageTitle = "FILESINPUT.TITLE";
    this.files_type_list.push(
      {
        title: "FILESINPUT.TEACHER",
        image: "/assets/images/teachers.png",
        link: "files-input/teachers"
      }, {
        title: "FILESINPUT.ROOM",
        image: "/assets/images/rooms.png",
        link: "files-input/rooms"
      }, {
        title: "FILESINPUT.SECTOR",
        image: "/assets/images/sectors.png",
        link: "files-input/sectors"
      }, {
        title: "FILESINPUT.LEVEL",
        image: "/assets/images/levels.png",
        link: "files-input/levels"
      }, {
        title: "FILESINPUT.CLASSROOM",
        image: "/assets/images/classrooms.png",
        link: "files-input/classrooms"
      }, {
        title: "FILESINPUT.TUMEANING",
        image: "/assets/images/teaching-units.png",
        link: "files-input/teaching-units"
      }
    );
    this.filter();
  }

  goToFileType(index: number)
  {
    this.router.navigate([this.files_type_list[index].link]);
  }

  filter(event: any = null)
  {
    this.list = this.files_type_list.filter((a: any) =>{return a.title.includes(this.searchValue)});
  }

  getValueOf(key: string)
  {
    return this.translationService.getValueOf(key);
  }

}
