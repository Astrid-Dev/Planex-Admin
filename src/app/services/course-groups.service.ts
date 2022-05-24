import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../environments/environment";
import {GroupeCours} from "../models/GroupeCours";

const COURSE_GROUPS_URL = BACKEND_URL + "/groupesCours";

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
