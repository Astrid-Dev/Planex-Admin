import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {Salle} from "../../models/Salle";
import {RoomsService} from "../../services/rooms.service";
import {FacultyService} from "../../services/faculty.service";
import {Niveau} from "../../models/Niveau";

@Component({
  selector: 'app-file-input-rooms',
  templateUrl: './file-input-rooms.component.html',
  styleUrls: ['./file-input-rooms.component.scss']
})
export class FileInputRoomsComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  rooms: Salle[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  constructor(
    private translationService: TranslationService,
    private roomsService: RoomsService,
    private facultyService: FacultyService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.ROOMS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.ROOMS",
        link: "files-input/roomss"
      }
    )
  }

  loadDatas()
  {
    this.hasLoadedDatas = null;
    if(!this.facultyService.hasLoaded)
    {
      this.facultyService.findOneFacultyWithSubsDatas(1)
        .then((res) =>{
          this.hasLoadedDatas = true;
        })
        .catch((err) =>{
          console.error(err);
          this.hasLoadedDatas = false;
        });
    }
    else
    {
      this.hasLoadedDatas = true;
    }
  }

  readFileContent(resultString: string)
  {
    this.roomsService.extractDataFromFile(resultString)
      .then((rooms) =>{
        this.rooms = rooms;
        this.sendRooms();
        console.log(rooms);
      })
      .catch((err) =>{
        console.error(err);
        const fileIsEmpty = err === "Fichier vide";
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.ERROR"),
          text: this.translationService.getValueOf(fileIsEmpty ? "FILESINPUT.FILEIMPORT.EMPTYFILECONTENT" : "FILESINPUT.FILEIMPORT.INVALIDHEADER"),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }

  sendRooms()
  {
    this.isImporting = true;
    this.roomsService.createRooms(this.rooms)
      .then((rooms: Salle[] | any) =>{
        this.facultyService.setFacultyRooms(rooms);
        this.isImporting = false;
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.SUCCES"),
          text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.SUCCESSIMPORT"),
          icon: 'success',
          confirmButtonText: 'OK'
        });
      })
      .catch((err) =>{
        console.error(err);
        this.isImporting = false;
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.ERROR"),
          text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.ERRORIMPORT"),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }

  canUploadFile()
  {
    return this.facultyService.facultyRooms.length === 0;
  }

}
