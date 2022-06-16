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
    this.groups.forEach((group: any) =>{
      let temp = this.classroomStudentsDatas.filter((data) => data.lettre.toUpperCase().localeCompare(group.startLetter) >= 0 && data.lettre.toUpperCase().localeCompare(group.endLetter) <= 0)
      let studentsNumber = 0;

      temp.forEach((tmp: any) =>{
        studentsNumber += tmp.nbre;
      });

      group.studentsNumber = studentsNumber;
    });
  }

  syncGroupsLetters()
  {
    const groupsNumber: number = this.groups.length;

    let startIndex: number = -1;
    let endIndex: number = -1;

    const lettersNumber: number = parseInt(String(this.letters.length/groupsNumber));

    this.groups.forEach((group, i: number) =>{
      startIndex = endIndex + 1;
      endIndex = startIndex + lettersNumber - 1;
      if(i === 0)
      {
        endIndex += this.letters.length - (groupsNumber * lettersNumber);
      }

      group.name = this.translationService.getValueOf("CONFIGURATIONS.COURSESGROUPS.GROUP") + (i + 1);
      group.startLetter = this.letters[startIndex];
      group.endLetter = this.letters[endIndex];
    });
  }

  syncPossiblesGroupsLetters()
  {
    this.groups[0].possiblesStartLetters = [this.letters[0]];
    this.groups[this.groups.length - 1].possiblesEndLetters = [this.letters[this.letters.length - 1]];

    for(let i = 1; i < this.groups.length; i++)
    {
      let letter1: string = this.groups[i-1].endLetter;
      let letter2: string = this.groups[i].endLetter;

      this.groups[i].possiblesStartLetters = this.getLettersInInterval(letter1, letter2, false, true);
    }
    for(let i = 0; i < this.groups.length - 1; i++)
    {
      let letter1: string = this.groups[i].startLetter;
      let letter2: string = this.groups[i+1].startLetter;

      this.groups[i].possiblesEndLetters = this.getLettersInInterval(letter1, letter2, true, false);
    }

    let firstGroup = this.groups[0];
    let secondGroup = this.groups[1];

    let lastGroup = this.groups[this.groups.length - 1];
    let prevLastGroup = this.groups[this.groups.length - 2]
    this.groups[0].possiblesEndLetters = this.getLettersInInterval(firstGroup.startLetter, secondGroup.startLetter, true, false);
    this.groups[this.groups.length - 1].possiblesStartLetters = this.getLettersInInterval(prevLastGroup.endLetter, lastGroup.endLetter, false, true);
  }

  getLetterIndex(letter: string)
  {
    return this.letters.indexOf(letter);
  }

  getLettersInInterval(letter1: string, letter2: string, firstInside: boolean = false, lastInside: boolean = false)
  {
    let init = this.getLetterIndex(letter1) + 1;
    let end = this.getLetterIndex(letter2);

    if(firstInside)
    {
      --init;
    }

    if(lastInside)
    {
      ++end;
    }

    let result: any = [];

    for(let i = init; i < end; i++)
    {
      result.push(this.letters[i]);
    }

    return result;
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
