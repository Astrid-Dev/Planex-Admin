import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {FacultyService} from "../../services/faculty.service";
import {TranslationService} from "../../services/translation.service";
import Swal from "sweetalert2";
import {HelpService} from "../../services/help.service";
import {CourseGroupCreation, GroupeCours} from "../../models/GroupeCours";
import {CourseGroupsService} from "../../services/course-groups.service";
import {ClassroomsService} from "../../services/classrooms.service";

const MODAL_ID = "courseGroupsDefinition";

@Component({
  selector: 'app-modal-course-groups-configuration',
  templateUrl: './modal-course-groups-configuration.component.html',
  styleUrls: ['./modal-course-groups-configuration.component.scss']
})
export class ModalCourseGroupsConfigurationComponent implements OnInit, AfterViewInit
{

  modal: any = null;
  isLoading: boolean = false;

  dividedClassroom: string = "no";
  prevDecision: string = "no";
  groups: CourseGroupCreation[] = [];

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private facultyService: FacultyService,
    private courseGroupsService: CourseGroupsService,
    private translationService: TranslationService,
    private classroomsService: ClassroomsService,
    private helpService: HelpService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      if(this.classroom.est_divisee !== 2)
      {
        this.dividedClassroom = "no";
      }
      else{
        let groups = this.facultyService.getCoursesGroupsOfOneClassroom(this.classroom.id);
        groups.forEach((group) =>{
          this.addGroup(group);
        });
        this.dividedClassroom = "yes";
      }
      this.prevDecision = this.dividedClassroom;
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.groups = [];
      this.dividedClassroom = "no";
      this.prevDecision = "no";
      this.isLoading = false;
      this.modal.removeData();
    });
  }

  get hasData()
  {
    return this.modal !== null && this.modal.hasData();
  }

  get classroom()
  {
    return this.modal !== null ? this.modal.getData(): null;
  }

  get classroomStudentsDatas(){
    return this.facultyService.getAClassroomInfos(this.classroom.id);
  }

  onChoiceChange(event: any)
  {
    if(this.prevDecision !== this.dividedClassroom && this.dividedClassroom === "yes" && this.groups.length === 0)
    {
      this.addGroup();
      this.addGroup();
    }

    this.prevDecision = this.dividedClassroom;
  }

  close()
  {
    this.modal.close();
  }

  onApply()
  {
    const hasDivided = this.dividedClassroom === "yes";

    let hasUpdatedGroupsLetters = false;
    let groups = this.facultyService.getCoursesGroupsOfOneClassroom(this.classroom.id);
    if(hasDivided && groups.length === this.groups.length)
    {
     for(let i = 0; i < this.groups.length; i++)
     {
       if(this.groups[i].startLetter !== groups[i].lettre_debut || this.groups[i].endLetter !== groups[i].lettre_fin)
       {
         hasUpdatedGroupsLetters = true;
         break;
       }
     }
    }
    else if(hasDivided && groups.length !== this.groups.length)
    {
      hasUpdatedGroupsLetters = true;
    }

    // for(let i = 0; i < this.groups.length; i++)
    // {
    //
    // }

    if((hasDivided && this.classroom.est_divisee !== 2) || (!hasDivided && this.classroom.est_divisee !== 1) || (hasUpdatedGroupsLetters))
    {
      this.isLoading = true;
      if(hasDivided)
      {
        let groupsToSend: GroupeCours[] = [];
        this.groups.forEach((group) =>{
          groupsToSend.push({
            classeId: this.classroom.id,
            lettre_debut: group.startLetter,
            lettre_fin: group.endLetter,
            nom: group.name
          });
        });

        this.courseGroupsService.createCourseGroups(groupsToSend)
          .then((res) =>{
            console.log(res);
            this.performActionWithSuccess();
          })
          .catch((err) =>{
            console.error(err);
            this.performActionWithError();
          })
      }
      else
      {
        if(this.classroom.est_divisee === 2)
        {
          this.courseGroupsService.deleteGroupsForOneClassroom(this.classroom.id)
            .then((res) =>{
              console.log(res);
              this.performActionWithSuccess();
            })
            .catch((err) =>{
              console.error(err);
              this.performActionWithError();
            })
        }
        else{
          this.classroomsService.updateAClassroom({est_divisee: 1}, this.classroom.id)
            .then((res) =>{
              console.log(res);
              this.performActionWithSuccess();
            })
            .catch((err) =>{
              console.error(err);
              this.performActionWithError();
            })
        }
      }
    }
    else{
      this.close();
    }
  }

  get canCreateGroups()
  {
    return !(this.dividedClassroom === "no");
  }

  get letters()
  {
    return this.helpService.upperCasesLetters;
  }

  addGroup(group: any = null)
  {
    if(group === null)
    {
      this.groups.push({
        classeId: this.classroom.id,
        name: "",
        startLetter: "",
        endLetter: "",
        possiblesEndLetters: [],
        possiblesStartLetters: [],
        studentsNumber: 0
      });

      if(this.groups.length > 1)
      {
        this.syncAll();
      }
    }
    else{
      this.groups.push({
        classeId: group.classeId,
        name: group.nom,
        startLetter: group.lettre_debut,
        endLetter: group.lettre_fin,
        possiblesEndLetters: [],
        possiblesStartLetters: [],
        studentsNumber: 0
      });
      if(this.groups.length > 1)
      {
        this.syncStudentsNumberPerGroup();
        this.syncPossiblesGroupsLetters();
      }
    }
  }

  deleteGroup(index: number)
  {
    this.groups = this.groups.filter((elt, i) => i !== index);
    this.syncAll();
  }

  syncAll()
  {
    this.syncGroupsLetters();
    this.syncPossiblesGroupsLetters();
    this.syncStudentsNumberPerGroup();
  }

  syncStudentsNumberPerGroup()
  {
    this.groups = this.facultyService.syncStudentsNumberPerGroup(this.classroom.id, this.groups);
  }

  syncGroupsLetters()
  {
    this.groups = this.facultyService.syncGroupsLetters(this.groups);
  }

  syncPossiblesGroupsLetters()
  {
    this.groups = this.facultyService.syncPossiblesGroupsLetters(this.groups);
  }

  getLettersInInterval(letter1: string, letter2: string, firstInside: boolean = false, lastInside: boolean = false)
  {
    return this.helpService.getLettersInInterval(letter1, letter2, firstInside, lastInside);
  }

  onStartGroupLetterChange(event: any, groupIndex: number)
  {
    if(groupIndex > 0)
    {
      const currentGroup = this.groups[groupIndex];
      const prevGroup = this.groups[groupIndex - 1];
      const tempLetters = this.getLettersInInterval(prevGroup.endLetter, currentGroup.startLetter);
      this.groups[groupIndex - 1].endLetter = tempLetters[tempLetters.length - 1];
    }

    this.syncPossiblesGroupsLetters();
    this.syncStudentsNumberPerGroup();
  }

  onEndGroupLetterChange(event: any, groupIndex: number)
  {
    if(groupIndex < this.groups.length - 1)
    {
      const currentGroup = this.groups[groupIndex];
      const nextGroup = this.groups[groupIndex + 1];
      const tempLetters = this.getLettersInInterval(currentGroup.endLetter, nextGroup.startLetter);
      this.groups[groupIndex + 1].startLetter = tempLetters[0];
    }

    this.syncPossiblesGroupsLetters();
    this.syncStudentsNumberPerGroup();
  }

  performActionWithSuccess()
  {
    let newGroups: GroupeCours[] = [];
    this.groups.forEach((group) =>{
      let newGroup: GroupeCours = {
        classeId: group.classeId,
        lettre_fin: group.endLetter,
        lettre_debut: group.startLetter,
        nom: group.name,
      }

      newGroups.push(newGroup);
    });

    let newClassroomData = {
      ...this.classroom,
      est_divisee: this.dividedClassroom === "yes" ? 2 : 1
    }

    this.facultyService.setCoursesGroupsOfOneClassroom(this.classroom.id, newGroups, newClassroomData);

    this.isLoading = false;
    this.modal.close();
    Swal.fire({
      title: this.translationService.getValueOf("ALERT.SUCCESS"),
      text: this.translationService.getValueOf("CONFIGURATIONS.COURSESGROUPS.SUCCESS1") + " "+ this.classroom.code + " "+ this.translationService.getValueOf("CONFIGURATIONS.COURSESGROUPS.SUCCESS2"),
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  performActionWithError()
  {
    this.isLoading = false;
    Swal.fire({
      title: this.translationService.getValueOf("ALERT.ERROR"),
      text: this.translationService.getValueOf("CONFIGURATIONS.COURSESGROUPS.ERROR1") + " ! "+ this.classroom.code + " "+ this.translationService.getValueOf("CONFIGURATIONS.COURSESGROUPS.ERROR2")+ " !",
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}
