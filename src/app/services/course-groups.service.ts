import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GroupeCours} from "../models/GroupeCours";
import {environment} from "../../environments/environment";

const COURSE_GROUPS_URL = environment.BACKEND_URL + "/groupesCours";

@Injectable({
  providedIn: 'root'
})
export class CourseGroupsService {

  constructor(private http: HttpClient) { }

  createCourseGroups(groupsDatas: GroupeCours[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(COURSE_GROUPS_URL, groupsDatas)
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          }
        })
    })
  }

  deleteGroupsForOneClassroom(classroomId: number)
  {
    return new Promise((resolve, reject) =>{
      this.http.delete(COURSE_GROUPS_URL+"/"+classroomId)
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          }
        })
    })
  }
}
