import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {Salle} from "../../models/Salle";
import {RoomsService} from "../../services/rooms.service";
import {FacultyService} from "../../services/faculty.service";
import {NgxSmartModalService} from "ngx-smart-modal";

const MODAL_ID = "roomEditionModal";

@Component({
  selector: 'app-file-input-rooms',
  templateUrl: './file-input-rooms.component.html',
  styleUrls: ['./file-input-rooms.component.scss']
})
export class FileInputRoomsComponent implements OnInit, AfterViewInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  rooms: Salle[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  showDataList: boolean = false;
  showFileImport: boolean = false;
  showImportedStatus: boolean = false;

  modal: any = null;

  constructor(
    private translationService: TranslationService,
    private roomsService: RoomsService,
    private facultyService: FacultyService,
    private ngxSmartModalService: NgxSmartModalService
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

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
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
        this.showImportedStatus = true;
        this.showDataList = false;
        this.showFileImport = false;
        this.isImporting = false;
        Swal.fire({
            title: this.translationService.getValueOf("ALERT.SUCCESS"),
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

  get hasAlreadyUploadedData(){
    let result = (this.hasLoadedDatas && this.facultyService.facultyRooms.length > 0);

    if(result && (!this.showDataList && !this.showFileImport))
    {
      this.showImportedStatus = true;
      this.showFileImport = false;
      this.showDataList = false;
    }

    if(this.hasLoadedDatas && !this.showDataList && !this.showFileImport && !this.showImportedStatus)
    {
      this.showFileImport = true;
    }

    return result;
  }

  get canShowFileImport(){
    return ((this.hasLoadedDatas && this.showFileImport));
  }

  get canShowDataList(){
    return ((this.hasLoadedDatas) && (this.showDataList));
  }

  get canShowImportedStatus()
  {
    return this.hasLoadedDatas && this.showImportedStatus;
  }

  onConsult()
  {
    this.rooms = this.facultyService.facultyRooms;
    this.showDataList = true;
    this.showFileImport = false;
    this.showImportedStatus = false;
  }

  onCancelConsult()
  {
    this.showDataList = false;
    this.showFileImport = false;
    this.showImportedStatus = true;
  }

  onComplement()
  {
    this.showDataList = false;
    this.showFileImport = true;
    this.showImportedStatus = false;
  }

  onEditRoom(room: Salle)
  {
    this.modal.setData(room, true);
    this.modal.open();
  }
}
