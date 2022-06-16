import { Injectable } from '@angular/core';
import {BACKEND_URL} from "../../environments/environment";
import {PlanningCours, PlanningCoursCreation} from "../models/PlanningCours";
import {HttpClient} from "@angular/common/http";
import {Classe} from "../models/Classe";
import {Ue} from "../models/Ue";
import {Jour, Periode} from "../models/TypeHoraire";
import {Salle} from "../models/Salle";
import {GroupeCours} from "../models/GroupeCours";
import {Domaine} from "../models/Domaine";
import {Enseignant} from "../models/Enseignant";
import {GeneratePlanningParameter} from "../models/GeneratePlanningParameter";

const PLANNING_COURSES_URL = BACKEND_URL + "/planningCoursEtTds";

const MAX_ROOM_CAPACITY_ACCURACY = 0.59;

@Injectable({
  providedIn: 'root'
})
export class PlanningCoursesService {

  private plannings$: PlanningCours[] = [];
  private hasLoadedPlannings: boolean = false;

  constructor(private http: HttpClient) { }

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

  getPlanningOfOneSector(sectorClassrooms: (number | null)[])
  {
    return this.plannings$.filter(planning => sectorClassrooms.includes(planning.classeId));
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
    let teachingUnits = parameter.teachingUnits;
    let teachers = parameter.teachers;
    let teachersDomains = parameter.teachersDomains;
    let domains = parameter.domains;
    let rooms = parameter.rooms;
    let periods = parameter.periods;
    let days = parameter.days;
    let coursesGroups = parameter.coursesGroups;
    let academicYearId = parameter.academicYearId;
    let othersPlannings = this.plannings$.filter(elt => elt.classeId !== classroom?.id);

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
    // let teachingUnitsIndexes = teachingUnits.map((elt, index) => index);
    let teachersIndex;

    let usedIndexes: any = [];

    let total = 0;
    let pushed = [];

    for(let i = 0; i < teachingUnits.length; i++)
    {
      let teachingUnit: Ue = teachingUnits[i];

      let randomPlanningIndex = this.getRandomInt(0, planningIndexes.length - 1, usedIndexes.length > 0 ? usedIndexes : null);
      let randomPlanning = classroomPlanning[randomPlanningIndex];
      pushed.push(randomPlanning);
      usedIndexes.push(randomPlanningIndex);
      planningIndexes = planningIndexes.filter(elt => elt !== randomPlanningIndex);
      ++total;
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

      // let randomTeachingUnitIndex = this.getRandomInt(0, teachingUnitsIndexes.length-1);
      // let randomTeachingUnit = teachingUnits[randomTeachingUnitIndex];
      // console.log(teachingUnitsIndexes);
      // teachingUnitsIndexes = teachingUnitsIndexes.filter(elt => elt !== randomTeachingUnitIndex);
      // console.log(teachingUnitsIndexes);

      let occupatedTeachersIdAtThisTime: any = othersPlanningsAtThisTime.map(elt => elt.enseignant1Id);
      let occupatedRoomsAtThisTime: any = othersPlanningsAtThisTime.map(elt => elt.salleId);
      let teachersWithTwoTeachingUnit = classroomPlanning.map(elt => elt.enseignant1Id);
      let possiblesTeachersId = teachersDomains.filter((elt, index, array) => {
        return elt && (elt.domaineId === teachingUnit.domaineId && !occupatedTeachersIdAtThisTime.includes(elt.enseignantId) && array.indexOf(elt) === index)
      })
        .map(elt => elt.enseignantId);
      let teachersIdToSet: (number | null)[] = [];

      if(possiblesTeachersId.length > 0)
      {
        let usedTeachersId: any = [];
        for(let j = 0; j < possiblesTeachersId.length; j++)
        {
          if(j < 4)
          {

            let random = this.getRandomInt(0, possiblesTeachersId.length - 1, usedTeachersId.length > 0 ? usedTeachersId : null);
            // if(j === 0)
            // {
            //   random = this.getRandomInt(0, possibles)
            // }
            teachersIdToSet.push(possiblesTeachersId[random]);
            usedTeachersId.push(random);
          }
          else{
            break;
          }
        }
      }
      else{
        for(let j = possiblesTeachersId.length; j < 4; j++)
        {
          teachersIdToSet.push(null);
        }
      }
      if(classroom.est_divisee === 2)
      {
        coursesGroups.forEach((courseGroup) =>{
          let randomPlanningIndex2 = this.getRandomInt(0, planningIndexes.length - 1, usedIndexes.length > 0 ? usedIndexes : null);
          let randomPlanning2 = classroomPlanning[randomPlanningIndex2];
          pushed.push(randomPlanning2);
          usedIndexes.push(randomPlanningIndex2);
          planningIndexes = planningIndexes.filter(elt => elt !== randomPlanningIndex);
        })
      }
      else
      {
        let possiblesRooms = this.getPossiblesRoomsForAnEffective(rooms, occupatedRoomsAtThisTime, parameter.classroomStudentsNumber).sort((a, b) => a.capacite - b.capacite);
        let selectedRoomId: any = possiblesRooms.length > 0 ? possiblesRooms[0].id : null;
        let selectedTeachingUnitId: any = teachingUnit.id;
        randomPlanning.salleId = selectedRoomId;
        randomPlanning.ueId = selectedTeachingUnitId;
        randomPlanning.enseignant1Id = teachersIdToSet[0] ? teachersIdToSet[0] : null;
        randomPlanning.enseignant2Id = teachersIdToSet[1] ? teachersIdToSet[1] : null;
        // randomPlanning.enseignant3Id = teachersIdToSet[2];
        // randomPlanning.enseignant4Id = teachersIdToSet[3];
      }
      classroomPlanning[randomPlanningIndex] = randomPlanning;
    }

    console.log(classroomPlanning);
    console.log(total);
    console.log(pushed);
    this.setAClassroomPlannings(classroomPlanning, classroom.id);
    return classroomPlanning;
  }

  private getPossiblesRoomsForAnEffective(roomsList: Salle[], occupatedRooms: any, effective: number)
  {
    return roomsList.filter(elt => ((effective >= (elt.capacite * MAX_ROOM_CAPACITY_ACCURACY)) && (effective <= elt.capacite) && !occupatedRooms.includes(elt.id)));
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
