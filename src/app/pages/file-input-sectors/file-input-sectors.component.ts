import { Component, OnInit } from '@angular/core';
import {Breadcumb} from "../../components/page-header-row/page-header-row.component";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {SectorsService} from "../../services/sectors.service";
import {Filiere} from "../../models/Filiere";
import {FacultyService} from "../../services/faculty.service";

@Component({
  selector: 'app-file-input-sectors',
  templateUrl: './file-input-sectors.component.html',
  styleUrls: ['./file-input-sectors.component.scss']
})
export class FileInputSectorsComponent implements OnInit {

  pageTitle: string = "";
  breadcumbs: Breadcumb[] = [];
  sectors: Filiere[] = [];

  hasLoadedDatas: boolean | null = null;
  isImporting: boolean = false;

  constructor(
    private translationService: TranslationService,
    private sectorsService: SectorsService,
    private facultyService: FacultyService
  ) { }

  ngOnInit(): void {

    this.loadDatas();

    this.pageTitle = "FILESINPUT.SECTORS.TITLE"
    this.breadcumbs.push(
      {
        linkName: "SIDEMENU.INPUTFILES.TITLE",
        link: "files-input"
      },
      {
        linkName: "SIDEMENU.INPUTFILES.SECTORS",
        link: "files-input/sectors"
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
    this.sectorsService.extractDataFromFile(resultString)
      .then((sectors) =>{
        this.sectors = sectors;
        this.sendSectors();
        console.log(sectors);
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

  sendSectors()
  {
    this.isImporting = true;
    this.sectorsService.createSectors(this.sectors)
      .then((sectors: Filiere[] | any) =>{
        this.facultyService.setFacultySectors(sectors);
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

  canUploadFile()
  {
    return this.facultyService.facultySectors.length === 0;
  }

}
