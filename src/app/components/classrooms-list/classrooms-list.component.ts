import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Classe} from "../../models/Classe";
import {FacultyService} from "../../services/faculty.service";
import {TranslationService} from "../../services/translation.service";
import {Filiere} from "../../models/Filiere";

@Component({
  selector: 'app-classrooms-list',
  templateUrl: './classrooms-list.component.html',
  styleUrls: ['./classrooms-list.component.scss']
})
export class ClassroomsListComponent implements OnInit {

  @Output("onSelectClassroom") selectedClassroom: EventEmitter<Classe> = new EventEmitter();
  @Output("onSelectGlobalPlanning") selectAllClassrooms: EventEmitter<any> = new EventEmitter();
  @Output("onSelectSectorPlanning") selectedSector: EventEmitter<Filiere> = new EventEmitter();
  @Output("onLoadedEnd") hasUploadedFile: EventEmitter<boolean | null> = new EventEmitter();
  @Input("load") canLoadClassrooms: boolean = true;
  @Input("list") defaultClassroomsList: Classe[] = [];
  @Input("isForPlanning") showGlobal: boolean = false;

  hasLoadedDatas: boolean | null = null;
  searchText: string = "";
  classroomsList: Classe[] = [];
  prefferdSectorId: string = "-1";
  prefferdLevelId: string = "-1";

  constructor(
    private facultyService: FacultyService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    if(this.canLoadClassrooms)
    {
      this.loadClassrooms();
    }
    else
    {
      this.hasLoadedDatas = true;
      this.classroomsList = this.defaultClassroomsList;
    }
  }

  loadClassrooms()
  {
    this.hasLoadedDatas = null;
    if(!this.facultyService.hasLoaded)
    {
      this.facultyService.findOneFacultyWithSubsDatas(1)
        .then((res) =>{
          this.classroomsList = this.classrooms;
          this.hasLoadedDatas = true;
          this.hasUploadedFile.emit(this.classrooms.length > 0);
        })
        .catch((err) =>{
          console.error(err);
          this.hasLoadedDatas = false;
          this.hasUploadedFile.emit(null);
        });
    }
    else
    {
      this.hasUploadedFile.emit(this.classrooms.length > 0);
      this.classroomsList = this.classrooms
      this.hasLoadedDatas = true;
    }
  }

  get classrooms()
  {
    return this.facultyService.facultyClassrooms;
  }

  getClassroomEntitled(classroom: Classe)
  {
    if(this.translationService.getCurrentLang() === "en")
    {
      return classroom.intitule_en;
    }
    else
    {
      return classroom.intitule;
    }
  }

  filter()
  {
    this.classroomsList = this.classrooms;
    const sectorId = parseInt(this.prefferdSectorId);
    const levelId = parseInt(this.prefferdLevelId);
    if(this.searchText !== "")
    {
      this.classroomsList = this.classroomsList
        .filter((classroom) =>{
          return (
            (classroom.code.includes(this.searchText.toUpperCase())) ||
            (classroom.intitule && classroom.intitule.toLowerCase().includes(this.searchText.toLowerCase())) ||
            (classroom.intitule_en && classroom.intitule_en.toLowerCase().includes(this.searchText.toLowerCase()))
          );
        })
    }
    if(levelId !== -1)
    {
      this.classroomsList = this.classroomsList
        .filter((classroom) =>{
          return classroom.niveauId === levelId;
        });
    }
    if(sectorId !== -1)
    {
      this.classroomsList = this.classroomsList
        .filter((classroom) =>{
          return classroom.filiereId === sectorId;
        });
    }
  }

  onChooseClassroom(classroom: Classe)
  {
    this.selectedClassroom.emit(classroom);
  }

  getClassroomDescription(classroomId: any)
  {
    let studentsNumber = this.facultyService.getAClassroomStudentsNumber(classroomId);
    let description = studentsNumber + " " +this.translationService.getValueOf("CONFIGURATIONS.COURSESGROUPS.STUDENT") + (studentsNumber > 1 ? 's' : '');
    return description;
  }

  get sectors()
  {
    return this.facultyService.facultySectors;
  }

  get levels()
  {
    return this.facultyService.facultyLevels;
  }

  getClassroomGroupsNumber(classroomId: any)
  {
    return this.facultyService.getCoursesGroupsOfOneClassroom(classroomId).length;
  }

  get showGlobalPlanningItem()
  {
    return this.showGlobal && this.searchText === "" && this.prefferdLevelId === "-1" && this.prefferdSectorId === "-1";
  }

  get showSectorPlanningItem()
  {
    return this.showGlobal && this.searchText === "" && this.prefferdLevelId === "-1" && this.prefferdSectorId !== "-1";
  }

  getPreferredSectorCode()
  {
    let sectorId = parseInt(this.prefferdSectorId);

    if(sectorId !== -1)
    {
      return this.sectors.find(elt => elt.id === sectorId)?.code;
    }
    else{
      return null;
    }
  }

  onAllClassroomsClick()
  {
    this.selectAllClassrooms.emit();
  }

  onSectorPlanningClick()
  {
    let sectorId = parseInt(this.prefferdSectorId);
    let sector: any = this.sectors.find(elt => elt.id === sectorId);
    this.selectedSector.emit(sector);
  }

}
