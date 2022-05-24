import { Injectable } from '@angular/core';
import {BACKEND_URL} from "../../environments/environment";
import {PlanningCours, PlanningCoursCreation} from "../models/PlanningCours";
import {HttpClient} from "@angular/common/http";

const PLANNING_COURSES_URL = BACKEND_URL + "/planningCoursEtTds";

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
}
