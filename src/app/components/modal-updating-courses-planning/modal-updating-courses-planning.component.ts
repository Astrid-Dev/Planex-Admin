import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {PlanningCours} from "../../models/PlanningCours";
import {TranslationService} from "../../services/translation.service";
import {Classe} from "../../models/Classe";

const MODAL_ID = "coursesPlanningModal";

const MAX_ROOM_CAPACITY_ACCURACY = 0.59;

enum ActivityType{
  COURSE,
  TUTORIAL
}

interface Activity{
  name: string,
  id: number,
  type: ActivityType
}

interface Group{
  name: string,
  id: number,
  type: ActivityType,
  description?: string,
  studentsNumber?: number
}

interface Item{
  id: number,
  name: string,
  description?: string
}

@Component({
  selector: 'app-modal-updating-courses-planning',
  templateUrl: './modal-updating-courses-planning.component.html',
  styleUrls: ['./modal-updating-courses-planning.component.scss']
})
export class ModalUpdatingCoursesPlanningComponent implements OnInit, AfterViewInit {

  @ViewChild('activity') activityInput: any;
  @ViewChild('room') roomInput: any;
  @ViewChild('group') groupInput: any;
  @ViewChild('teacher1') teacher1Input: any;
  @ViewChild('teacher2') teacher2Input: any;
  @ViewChild('teacher3') teacher3Input: any;
  @ViewChild('teacher4') teacher4Input: any;

  @Output("onModify") modifiedCeil: EventEmitter<PlanningCours> = new EventEmitter<PlanningCours>();

  modal: any = null;

  searchWordItem: string = "name";

  selectedActivity: Activity | null = null;
  selectedRoom: Item | null = null;
  selectedTeacher1: Item | null = null;
  selectedTeacher2: Item | null = null;
  selectedTeacher3: Item | null = null;
  selectedTeacher4: Item | null = null;
  selectedGroup: Group | null = null;

  activities: Activity[] = [];
  possiblesRooms: Item[] = [];
  possiblesTeachers1: Item[] = [];
  possiblesTeachers2: Item[] = [];
  possiblesTeachers3: Item[] = [];
  possiblesTeachers4: Item[] = [];
  possiblesGroups: Group[] = [];

  divideClassroom: string = "no";


  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.setAll();
      this.initInputsValues();
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.divideClassroom = "no";
      this.modal.removeData();
    });
  }

  initInputsValues()
  {
    let defaultPlanning: any = this.currentCeil;
    if(defaultPlanning.ueId !== null)
    {
      this.selectedActivity = {id: defaultPlanning.ueId, type: ActivityType.COURSE, name: this.teachingUnits.find((elt: any) => elt.id === defaultPlanning.ueId)?.code}
      this.activityInput.query = this.selectedActivity.name;
    }
    else if(defaultPlanning.tdId !== null)
    {
      this.selectedActivity = {id: defaultPlanning.tdId, type: ActivityType.TUTORIAL, name: this.tutorials.find((elt: any) => elt.id === defaultPlanning.tdId)?.code}
      this.activityInput.query = this.selectedActivity.name;
    }

    if(defaultPlanning.salleId !== null)
    {
      let room: any = this.rooms.find((elt: any) => elt.id === defaultPlanning.salleId);
      this.selectedRoom = {id: defaultPlanning.salleId, name: room.code, description: room.capacite};
      this.roomInput.query = this.selectedRoom.name;
    }

    if(defaultPlanning.enseignant1Id !== null)
    {
      this.selectedTeacher1 = {id: defaultPlanning.enseignant1Id, name: this.teachers.find((elt: any) => elt.id === defaultPlanning.enseignant1Id).noms};
      this.teacher1Input.query = this.selectedTeacher1.name;
    }

    if(defaultPlanning.enseignant2Id !== null)
    {
      this.selectedTeacher2 = {id: defaultPlanning.enseignant2Id, name: this.teachers.find((elt: any) => elt.id === defaultPlanning.enseignant2Id).noms};
      this.teacher2Input.query = this.selectedTeacher2.name;
    }

    if(defaultPlanning.enseignant3Id !== null)
    {
      this.selectedTeacher3 = {id: defaultPlanning.enseignant3Id, name: this.teachers.find((elt: any) => elt.id === defaultPlanning.enseignant3Id).noms};
      this.teacher3Input.query = this.selectedTeacher3.name;
    }

    if(defaultPlanning.enseignant4Id !== null)
    {
      this.selectedTeacher4 = {id: defaultPlanning.enseignant4Id, name: this.teachers.find((elt: any) => elt.id === defaultPlanning.enseignant4Id).noms};
      this.teacher4Input.query = this.selectedTeacher4.name;
    }

    if(defaultPlanning.groupeCoursId !== null || defaultPlanning.groupeTdId !== null)
    {
      this.divideClassroom = "yes";
    }

    setTimeout(() =>{
      if(defaultPlanning.groupeCoursId !== null)
      {
        let group: any = this.coursesGroups.find((elt: any) => elt.id === defaultPlanning.groupeCoursId);
        this.selectedGroup = {id: defaultPlanning.groupeCoursId, name: group.nom, studentsNumber: group.nbre_etudiants, type: ActivityType.COURSE, description: group.nbre_etudiants + " "+this.translationService.getValueOf("COURSESTIMETABLE.STUDENTS")};
        this.groupInput.query = this.selectedGroup.name;
      }
      else if(defaultPlanning.groupeTdId !== null)
      {
        let group: any = this.tutorialsGroups.find((elt: any) => elt.id === defaultPlanning.groupeTdId);
        this.selectedGroup = {id: defaultPlanning.groupeTdId, name: group.nom, studentsNumber: group.nbre_etudiants, type: ActivityType.TUTORIAL, description: group.nbre_etudiants + " "+this.translationService.getValueOf("COURSESTIMETABLE.STUDENTS")};
        this.groupInput.query = this.selectedGroup.name;
      }
    }, 100);


  }

  get hasData()
  {
    return this.modal !== null && this.modal.hasData();
  }

  get data()
  {
    return this.hasData ? this.modal.getData() : null;
  }

  get teachers()
  {
    return this.data?.teachers.sort((a: any, b: any) => a.noms.localeCompare(b.noms));
  }

  get teachingUnits()
  {
    return this.data?.teachingUnits.sort((a: any, b: any) => a.code.localeCompare(b.code));
  }

  get rooms()
  {
    return this.data?.rooms.sort((a: any, b: any) => a.code.localeCompare(b.code));
  }

  get tutorials()
  {
    return this.data?.tutorials.sort((a: any, b: any) => a.code.localeCompare(b.code));
  }

  get studentsNumber()
  {
    return this.data?.studentsNumber;
  }

  get coursesGroups()
  {
    return this.data?.coursesGroups.sort((a: any, b: any) => a.nom.localeCompare(b.nom));
  }

  get tutorialsGroups()
  {
    return this.data?.tutorialsGroups.sort((a: any, b: any) => a.nom.localeCompare(b.nom));
  }

  get currentPlannings()
  {
    return this.data?.currentPlannings;
  }

  get othersPlannings()
  {
    return this.data?.othersPlannings;
  }

  get periods()
  {
    return this.data?.periods;
  }


  close()
  {
    this.modal.close();
  }

  timesAreConcurent(period1Id: any, period2Id: any)
  {
    let result: boolean = false;
    if(period1Id !== null && period2Id !== null)
    {
      if(period1Id === period2Id)
      {
        result = true;
      }
      else
      {
        let period1 = this.periods.find((elt: any) => elt.id === period1Id);
        let period2 = this.periods.find((elt: any) => elt.id === period2Id);

        if((typeof period1 !== "undefined" && typeof period2 !== "undefined"))
        {
          let startHour1 = parseInt(period1.debut.split("h")[0]);
          let startHour2 = parseInt(period2.debut.split("h")[0]);
          let endHour1 = parseInt(period1.fin.split("h")[0]);
          let endHour2 = parseInt(period2.fin.split("h")[0]);
          let startMin1 = parseInt(period1.debut.split("h")[1]);
          let startMin2 = parseInt(period2.debut.split("h")[1]);
          let endMin1 = parseInt(period1.fin.split("h")[1]);
          let endMin2 = parseInt(period2.fin.split("h")[1]);

          let currentDate = new Date();
          currentDate.setHours(startHour1, startMin1);
          let startTime1 = currentDate.getTime();

          currentDate.setHours(startHour2, startMin2);
          let startTime2 = currentDate.getTime();

          currentDate.setHours(endHour1, endMin1);
          let endTime1 = currentDate.getTime();

          currentDate.setHours(endHour2, endMin2);
          let endTime2 = currentDate.getTime();
          if((startTime1 >= startTime2 && (endTime2 >= startTime1 && endTime1 >= endTime2)) || (startTime2 >= startTime1 && (endTime1 >= startTime2 && endTime2 >= endTime1)))
          {
            result = true;
          }
          else
          {
            result = false;
          }
        }
        else
        {
          result = false;
        }
      }
    }
    else{
      result = false;
    }

    return result;
  }

  get otherPlanningsAtThisTime()
  {
    return this.othersPlannings.filter((elt: any) =>{
      if(((elt.jourId !== null && elt.jourId === this.currentCeil.jourId)))
      {
        return (this.timesAreConcurent(elt.periodeId, this.currentCeil.periodeId));
      }
      else
      {
        return false;
      }
    });
  }

  setPossiblesTeachers(teacherNumber: number)
  {
    this.onUnselectTeacher(teacherNumber);

    let occupatedTeachersIdAtThisTime: number[] = [];

    this.otherPlanningsAtThisTime.forEach((elt: any)=>{
      if(elt.enseignant1Id !== null)
      {
        occupatedTeachersIdAtThisTime.push(elt.enseignant1Id)
      }
    });

    let unOccupatedTeachers = this.teachers.filter((elt: any) => !occupatedTeachersIdAtThisTime.includes(elt.id));

    if(teacherNumber === 1)
    {
      let temp = unOccupatedTeachers.filter((teacher: any) => (teacher.id !== this.selectedTeacher2?.id && teacher.id !== this.selectedTeacher3?.id && teacher.id !== this.selectedTeacher4?.id));

      this.possiblesTeachers1 = [];
      temp.forEach((teacher: any) =>{
        this.possiblesTeachers1.push({id: teacher.id, name: teacher.noms});
      });
    }
    else if(teacherNumber === 2)
    {
      let temp = this.teachers.filter((teacher: any) => (teacher.id !== this.selectedTeacher1?.id && teacher.id !== this.selectedTeacher3?.id && teacher.id !== this.selectedTeacher4?.id));

      this.possiblesTeachers2 = [];
      temp.forEach((teacher: any) =>{
        this.possiblesTeachers2.push({id: teacher.id, name: teacher.noms});
      });
    }
    else if(teacherNumber === 3)
    {
      let temp = this.teachers.filter((teacher: any) => (teacher.id !== this.selectedTeacher1?.id && teacher.id !== this.selectedTeacher2?.id && teacher.id !== this.selectedTeacher4?.id))

      this.possiblesTeachers3 = [];
      temp.forEach((teacher: any) =>{
        this.possiblesTeachers3.push({id: teacher.id, name: teacher.noms});
      });
    }
    else if(teacherNumber === 4)
    {
      let temp = this.teachers.filter((teacher: any) => (teacher.id !== this.selectedTeacher1?.id && teacher.id !== this.selectedTeacher2?.id && teacher.id !== this.selectedTeacher3?.id))

      this.possiblesTeachers4 = [];
      temp.forEach((teacher: any) =>{
        this.possiblesTeachers4.push({id: teacher.id, name: teacher.noms});
      });
    }
  }

  setPossiblesRooms()
  {
    this.onUnselectRoom();
    let usedRoomsIdAtThisTime: number[] = [];

    this.otherPlanningsAtThisTime.forEach((elt: any)=>{
      if(elt.salleId !== null)
      {
        usedRoomsIdAtThisTime.push(elt.salleId);
      }
    });

    let temp = this.rooms.filter((room: any) =>{
      let studentsGroupNumber: number = this.selectedGroup?.studentsNumber || 0;
      let condition1 = this.divideClassroom === "yes" && this.canUseRoom(studentsGroupNumber, room.capacite);
      let condition2 = this.divideClassroom === "no" && this.canUseRoom(this.studentsNumber, room?.capacite);

      let condition3 = !usedRoomsIdAtThisTime.includes(room.id);

      return ((condition1 || condition2) && (condition3));
    });
    this.possiblesRooms = [];

    temp.forEach((room: any) =>{
      this.possiblesRooms.push({id: room.id, name: room.code, description: room.capacite + " places"});
    });
  }

  canUseRoom(predictStudentsNumber: number, roomCapacity: number)
  {
   return predictStudentsNumber === 0 ? true : (predictStudentsNumber >= roomCapacity * MAX_ROOM_CAPACITY_ACCURACY && predictStudentsNumber <= roomCapacity)
  }

  setPossiblesGroups()
  {
    this.onUnselectGroup();
    this.possiblesGroups = [];
    if(this.canShowParticipationChoice && this.divideClassroom === "yes")
    {
      if(this.selectedActivity?.type === ActivityType.COURSE)
      {
        this.coursesGroups.forEach((group: any) =>{
          this.possiblesGroups.push({
            id: group.id,
            name: group.nom,
            type: ActivityType.COURSE,
            description: group.nbre_etudiants + " "+this.translationService.getValueOf("COURSESTIMETABLE.STUDENTS"),
            studentsNumber: group.nbre_etudiants
          })
        })
      }
      else if(this.selectedActivity?.type === ActivityType.TUTORIAL)
      {
        this.coursesGroups.forEach((group: any) =>{
          this.possiblesGroups.push({
            id: group.id,
            name: group.nom,
            type: ActivityType.TUTORIAL
          })
        })
      }
    }
  }

  setActivities()
  {
    this.onUnselectActivity();
    this.activities = [];
    this.teachingUnits.forEach((teachingUnit: any) =>{
      this.activities.push({
        id: teachingUnit.id,
        name: teachingUnit.code,
        type: ActivityType.COURSE
      });
    });
    this.tutorials.forEach((turorial: any) =>{
      this.activities.push({
        id: turorial.id,
        name: turorial.code,
        type: ActivityType.TUTORIAL
      });
    });
    this.activities.sort((a, b) => a.name.localeCompare(b.name));
  }

  setAll()
  {
    this.setActivities();
    this.setPossiblesRooms();
    this.setPossiblesTeachers(1);
    this.setPossiblesTeachers(2);
    this.setPossiblesTeachers(3);
    this.setPossiblesTeachers(4);
  }

  get classroomHasCoursesGroups()
  {
    return this.coursesGroups.length > 0;
  }

  get classroomHasTutorialsGroups()
  {
    return this.tutorialsGroups.length > 0;
  }

  //Activity

  onSelectActivity(activity: Activity)
  {
    this.selectedActivity = activity;
    this.selectedRoom = null;
    this.setPossiblesRooms();
    this.setPossiblesTeachers(1);
  }

  onUnselectActivity()
  {
    this.selectedActivity = null;
    if(this.activityInput?.query) {
      this.activityInput.query = "";
    }
    this.onUnselectRoom();
    this.onUnselectTeacher(1);
  }

  onActivityChange(activityName: string)
  {
    if(this.selectedActivity !== null && activityName !== this.selectedActivity.name)
    {
      this.selectedActivity = null;
    }
  }

  //Room

  onSelectRoom(room: Item)
  {
    this.selectedRoom = room;
  }

  onUnselectRoom()
  {
    this.selectedRoom = null;
    if(this.roomInput?.query) {
      this.roomInput.query="";
    }
  }

  onRoomChange(roomCode: string)
  {
    if(this.selectedRoom !== null && roomCode !== this.selectedRoom.name)
    {
      this.selectedRoom = null;
    }
  }

  //(Course or Turorial) Group

  onSelectGroup(group: Group)
  {
    this.selectedGroup = group;
    this.selectedRoom = null;
    this.setPossiblesRooms();
  }

  onUnselectGroup()
  {
    this.selectedGroup = null;
    if(this.groupInput?.query) {
      this.groupInput.query="";
    }
    this.onUnselectRoom();
  }

  onGroupChange(groupName: string)
  {
    if(this.selectedGroup !== null && groupName !== this.selectedGroup.name)
    {
      this.selectedGroup = null;
    }
  }

  //Teachers

  onSelectTeacher(teacher: Item, teacherNumber: number)
  {
    if(teacherNumber === 1)
    {
      this.selectedTeacher1 = teacher;
      this.setPossiblesTeachers(2);
    }
    else if(teacherNumber === 2)
    {
      this.selectedTeacher2 = teacher;
      this.setPossiblesTeachers(3);
    }
    else if(teacherNumber === 3)
    {
      this.selectedTeacher3 = teacher;
      this.setPossiblesTeachers(4);
    }
    else if(teacherNumber === 4)
    {
      this.selectedTeacher4 = teacher;
    }
  }

  onUnselectTeacher(teacherNumber: number) {
    if (teacherNumber === 1)
    {
      this.selectedTeacher1 = null;
      if(this.teacher1Input?.query) {
        this.teacher1Input.query="";
      }
      this.onUnselectTeacher(2);
    }
    else if (teacherNumber === 2)
    {
      this.selectedTeacher2 = null;
      if(this.teacher2Input?.query) {
        this.teacher2Input.query="";
      }
      this.onUnselectTeacher(3);
    }
    else if (teacherNumber === 3)
    {
      this.selectedTeacher3 = null;
      if(this.teacher3Input?.query) {
        this.teacher3Input.query="";
      }
      this.onUnselectTeacher(4);
    }
    else if (teacherNumber === 4)
    {
      this.selectedTeacher4 = null;
      if(this.teacher4Input?.query) {
        this.teacher4Input.query="";
      }
    }
  }

  onTeacherChange(teacherName: string, teacherNumber: number)
  {
    if (teacherNumber === 1)
    {
      if(this.selectedTeacher1 !== null && teacherName !== this.selectedTeacher1.name)
      {
        this.selectedTeacher1 = null;
      }
    }
    else if (teacherNumber === 2)
    {
      if(this.selectedTeacher2 !== null && teacherName !== this.selectedTeacher2.name)
      {
        this.selectedTeacher2 = null;
      }
    }
    else if (teacherNumber === 3)
    {
      if(this.selectedTeacher3 !== null && teacherName !== this.selectedTeacher3.name)
      {
        this.selectedTeacher3 = null;
      }
    }
    else if (teacherNumber === 4)
    {
      if(this.selectedTeacher4 !== null && teacherName !== this.selectedTeacher4.name)
      {
        this.selectedTeacher4 = null;
      }
    }
  }

  canSelectTeacher(teacherNumber: number)
  {
    if(teacherNumber === 1)
    {
      return this.selectedActivity !== null;
    }
    else if(teacherNumber === 2)
    {
      return this.selectedTeacher1 !== null;
    }
    else if(teacherNumber === 3)
    {
      return this.selectedTeacher2 !== null && this.selectedTeacher1 !== null;
    }
    else if(teacherNumber === 4)
    {
      return this.selectedTeacher3 !== null && this.selectedTeacher2 !== null && this.selectedTeacher1 !== null;
    }
    else return false;
  }

  get canSelectRoom()
  {
    if(this.canShowParticipationChoice && this.divideClassroom === "yes")
      return this.selectedGroup !== null;
    else
      return this.selectedActivity !== null;
  }

  get canShowParticipationChoice()
  {
    return ((this.selectedActivity !== null) && (this.selectedActivity.type === ActivityType.COURSE && this.classroomHasCoursesGroups || this.selectedActivity.type === ActivityType.TUTORIAL && this.classroomHasTutorialsGroups));
  }

  onDivideClassroomStatusChange(value: string)
  {
    if(value === "yes") {
      this.setPossiblesGroups();
    }
    else
    {
      this.selectedGroup = null;
    }
  }

  get currentCeil(){
    return this.data.currentCeil;
  }

  onApply()
  {
    let result: PlanningCours = {
      ...this.currentCeil,
      salleId: this.selectedRoom !== null ? this.selectedRoom.id : null,
      ueId: (this.selectedActivity !== null && this.selectedActivity.type === ActivityType.COURSE) ? this.selectedActivity.id : null,
      tdId: (this.selectedActivity !== null && this.selectedActivity.type === ActivityType.TUTORIAL) ? this.selectedActivity.id : null,
      enseignant1Id: this.selectedTeacher1 !== null ? this.selectedTeacher1.id : null,
      enseignant2Id: this.selectedTeacher2 !== null ? this.selectedTeacher2.id : null,
      enseignant3Id: this.selectedTeacher3 !== null ? this.selectedTeacher3.id : null,
      enseignant4Id: this.selectedTeacher4 !== null ? this.selectedTeacher4.id : null,
      groupeCoursId: (this.divideClassroom === "yes" && this.selectedGroup !== null && this.selectedGroup.type === ActivityType.COURSE) ? this.selectedGroup.id : null,
      groupeTdId: (this.divideClassroom === "yes" && this.selectedGroup !== null && this.selectedGroup.type === ActivityType.TUTORIAL) ? this.selectedGroup.id : null,
    }

    if(!this.ceilsAreEquals(this.currentCeil, result)){
      this.modifiedCeil.emit(result);
    }
    // console.log(result);
    // console.log(this.selectedRoom)

    this.close();
  }

  ceilsAreEquals(previous: PlanningCours, current: PlanningCours)
  {
    return (
      previous.salleId === current.salleId &&
        previous.ueId === current.ueId &&
        previous.tdId === current.tdId &&
        previous.enseignant1Id === current.enseignant1Id &&
        previous.enseignant2Id === current.enseignant2Id &&
        previous.enseignant3Id === current.enseignant3Id &&
        previous.enseignant4Id === current.enseignant4Id &&
        previous.groupeCoursId === current.groupeCoursId &&
        previous.groupeTdId === current.groupeTdId
    )
  }
}
