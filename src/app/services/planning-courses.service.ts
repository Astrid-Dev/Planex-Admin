import { Injectable } from '@angular/core';
import {BACKEND_URL} from "../../environments/environment";
import {PlanningCours, PlanningCoursCreation} from "../models/PlanningCours";
import {HttpClient} from "@angular/common/http";
import {Ue} from "../models/Ue";
import {Jour, Periode} from "../models/TypeHoraire";
import {Salle} from "../models/Salle";
import {GeneratePlanningParameter} from "../models/GeneratePlanningParameter";
import {FacultyService} from "./faculty.service";

const PLANNING_COURSES_URL = BACKEND_URL + "/planningCoursEtTds";

const MAX_ROOM_CAPACITY_ACCURACY = 0.59;

@Injectable({
  providedIn: 'root'
})
export class PlanningCoursesService {

  private plannings$: PlanningCours[] = [];
  private hasLoadedPlannings: boolean = false;

  constructor(private http: HttpClient, private facultyService: FacultyService) { }

  createPlanningsForAClassroom(planningsDatas: PlanningCours[], classroomId: number)
  {
    return new Promise((resolve, reject) =>{
      this.http.post(PLANNING_COURSES_URL + "/"+classroomId, planningsDatas)
        .subscribe(
          (res: any) =>{
            this.setAClassroomPlannings(res.plannings, classroomId);
            resolve(res);
          },
          err =>{
            reject(err);
          }
        )
    })
  }

  updateAClassroomPlannings(planningsDatas: PlanningCours[], classroomId: number)
  {
    return new Promise((resolve, reject) =>{
      this.http.put(PLANNING_COURSES_URL + "/"+classroomId, planningsDatas)
        .subscribe(
          (res: any) =>{
            this.setAClassroomPlannings(res.plannings, classroomId);
            resolve(res);
          },
          err =>{
            reject(err);
          }
        )
    })
  }

  loadPlannings()
  {
    return new Promise((resolve, reject) =>{
      this.http.get(PLANNING_COURSES_URL)
        .subscribe(
          (res: any) =>{
            console.log(res);
            this.plannings$ = res;
            this.hasLoadedPlannings = true;
            resolve(res);
          },
          err =>{
            this.hasLoadedPlannings = false;
            reject(err);
          }
        )
    })
  }

  get hasLoaded()
  {
    return this.hasLoadedPlannings;
  }

  private setAClassroomPlannings(plannings: PlanningCours[], classroomId: number)
  {
    if(classroomId !== null)
    {
      this.plannings$ = this.plannings$.filter(planning => planning.classeId !== classroomId);
      this.plannings$ = this.plannings$.concat(plannings);
    }
    else
    {
      this.plannings$ = plannings;
    }
  }

  get plannings()
  {
    return this.plannings$;
  }

  getPlanningOfOneClassroom(classroomId: number)
  {
    return this.plannings$.filter(planning => planning.classeId === classroomId);
  }

  getPlanningsWithoutAClassroom(classroomId: number)
  {
    return this.plannings$.filter(planning => planning.classeId !== classroomId);
  }

  getAClassroomsGroupPlannings(searchedClassrooms: number [])
  {
    let result: PlanningCours[] = [];
    searchedClassrooms.forEach((elt) =>{
      result = result.concat(this.getPlanningOfOneClassroom(elt));
    });

    return result;
  }

  getMaxPlanningId()
  {
    if(this.plannings$.length === 0){
      return 0;
    }
    return Math.max(...this.plannings$.map(elt => {
      let id: any = elt.id ? elt.id : 0;
      return id;
    }))
  }

  generateAClassroomCoursesPlanning(parameter: GeneratePlanningParameter)
  {
    let classroom: any = parameter.classroom;
    let teachingUnits: Ue[] = [];
    let rooms = parameter.rooms;
    let periods = parameter.periods;
    let days = parameter.days;
    let coursesGroups = parameter.coursesGroups;
    let academicYearId = parameter.academicYearId;
    let othersPlannings = this.plannings$.filter(elt => elt.classeId !== classroom?.id);
    let coursesRepartition = parameter.coursesRepartition;
    let selectedDays = parameter.selectedDays;
    let teachingUnitsPerDay = parameter.teachingUnitsPerDay;
    let oneTeachingUnitPerWeek = parameter.oneTeachingUnitPerWeek;
    let periodsBetweenTwoTeachingUnits = parameter.periodsBetweenTwoTeachingUnits;

    let daysOccurences: number[] = [];


    parameter.teachingUnits.forEach((elt) =>{
      for(let i = 0; i < oneTeachingUnitPerWeek; i++)
      {
        teachingUnits.push(elt);
      }
    })

    let classroomPlanning: PlanningCours[] = [];

    let id = this.getMaxPlanningId();
    periods.forEach((period, periodIndex) =>{
      let periodId: any = period.id;
      days.forEach((day, dayIndex) =>{
        let dayId: any = day.id;
        ++id;
        classroomPlanning.push({
          id: id,
          classeId: classroom.id,
          anneeScolaireId: academicYearId,
          enseignant1Id: null,
          enseignant2Id: null,
          enseignant3Id: null,
          enseignant4Id: null,
          salleId: null,
          groupeTdId: null,
          groupeCoursId: null,
          jourId: dayId,
          periodeId: periodId,
          tdId: null,
          ueId: null
        });
      })
    })



    let planningIndexes = classroomPlanning.map((elt, index) => index);
    let teachingUnitsIndexes = teachingUnits.map((elt, index) => index);

    for(let i = 0; i < teachingUnits.length; i++)
    {
      if(planningIndexes.length > 1)
      {
        let randomPlanningIndex = planningIndexes[this.getRandomInt(0, planningIndexes.length-1)];
        let randomPlanning = classroomPlanning[randomPlanningIndex];
        planningIndexes = planningIndexes.filter(elt => elt !== randomPlanningIndex);

        let randomTeachingUnitIndex = teachingUnitsIndexes[this.getRandomInt(0, teachingUnitsIndexes.length - 1)];
        let randomTeachingUnit = teachingUnits[randomTeachingUnitIndex];
        teachingUnitsIndexes = teachingUnitsIndexes.filter(elt => elt !== randomTeachingUnitIndex);

        let courseRepartition = coursesRepartition.find(elt => elt.ueId === randomTeachingUnit.id);

        let teachingUnit: Ue = teachingUnits[i];

        let othersPlanningsAtThisTime = othersPlannings.concat(classroomPlanning).filter(elt => {
          if(((elt.jourId !== null && elt.
            jourId === randomPlanning.jourId)))
          {
            return (this.timesAreConcurent(parameter.allPeriods, elt.periodeId, randomPlanning.periodeId));
          }
          else
          {
            return false;
          }
        });


        let teacher1Id: any = courseRepartition ? courseRepartition.enseignant1Id : null;
        let teacher2Id: any = courseRepartition ? courseRepartition.enseignant2Id : null;
        let teacher3Id: any = courseRepartition ? courseRepartition.enseignant3Id : null;
        let teacher4Id: any = courseRepartition ? courseRepartition.enseignant4Id : null;
        let teachingUnitId: any = randomTeachingUnit.id;
        let occupatedRoomsAtThisTime: any = othersPlanningsAtThisTime.map(elt => elt.salleId);
        let possiblesRooms = this.getPossiblesRoomsForAnEffective(rooms, occupatedRoomsAtThisTime, parameter.classroomStudentsNumber);
        let selectedRoomId: any = possiblesRooms.length > 0 ? possiblesRooms[0].id : null;

        if(possiblesRooms.length === 0)
        {
          coursesGroups.forEach((courseGroup) =>{
            console.log(randomPlanning)
            othersPlanningsAtThisTime = othersPlannings.concat(classroomPlanning).filter(elt => {
              if(((elt.jourId !== null && elt.
                jourId === randomPlanning.jourId)))
              {
                return (this.timesAreConcurent(parameter.allPeriods, elt.periodeId, randomPlanning.periodeId));
              }
              else
              {
                return false;
              }
            });
            occupatedRoomsAtThisTime = othersPlanningsAtThisTime.map(elt => elt.salleId);
            possiblesRooms = this.getPossiblesRoomsForAnEffective(rooms, occupatedRoomsAtThisTime, this.facultyService.getACourseGroupStudentsNumber(courseGroup));
            selectedRoomId = possiblesRooms.length > 0 ? possiblesRooms[0].id : null;
            let courseGroupId: any = courseGroup.id;

            randomPlanning.ueId = teachingUnitId;
            randomPlanning.enseignant1Id = teacher1Id;
            randomPlanning.enseignant2Id = teacher2Id;
            randomPlanning.enseignant3Id = teacher3Id;
            randomPlanning.enseignant4Id = teacher4Id;
            randomPlanning.salleId = selectedRoomId;
            randomPlanning.groupeCoursId = courseGroupId;

            randomPlanningIndex = planningIndexes[this.getRandomInt(0, planningIndexes.length-1)];
            randomPlanning = classroomPlanning[randomPlanningIndex];
            planningIndexes = planningIndexes.filter(elt => elt !== randomPlanningIndex);
          })
        }
        else{
          randomPlanning.ueId = teachingUnitId;
          randomPlanning.enseignant1Id = teacher1Id;
          randomPlanning.enseignant2Id = teacher2Id;
          randomPlanning.enseignant3Id = teacher3Id;
          randomPlanning.enseignant4Id = teacher4Id;
          randomPlanning.salleId = selectedRoomId;
        }
      }
      else{
        break;
      }

    }

    this.setAClassroomPlannings(classroomPlanning, classroom.id);
    return classroomPlanning;
  }

  generateAGroupOfClassroomsCoursesPlanning(parameters: GeneratePlanningParameter[])
  {
    parameters.forEach((elt) =>{
      this.generateAClassroomCoursesPlanning(elt);
    });
  }

  private getPossiblesRoomsForAnEffective(roomsList: Salle[], occupatedRooms: any, effective: number)
  {
    return roomsList.filter(elt => ((effective >= (elt.capacite * MAX_ROOM_CAPACITY_ACCURACY)) && (effective <= (elt.capacite  + (elt.capacite * 0.3))) && !occupatedRooms.includes(elt.id))).sort((a, b) => a.capacite - b.capacite);
  }

  getRandomInt(min: number, max: number, notConsidarate: any = null): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    let value = Math.floor(Math.random() * (max - min + 1)) + min;
    if(notConsidarate !== null && notConsidarate.includes(value))
    {
      return this.getRandomInt(min, max, notConsidarate);
    }
    else{
      return value;
    }

  }

  timesAreConcurent(allPeriods: Periode[], period1Id: any, period2Id: any)
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
        let period1 = allPeriods.find((elt: any) => elt.id === period1Id);
        let period2 = allPeriods.find((elt: any) => elt.id === period2Id);

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
}
