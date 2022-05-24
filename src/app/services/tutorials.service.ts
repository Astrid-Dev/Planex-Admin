import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Td} from "../models/Td";
import {BACKEND_URL} from "../../environments/environment";

const TUTORIALS_URL = BACKEND_URL+"/tds";

@Injectable({
  providedIn: 'root'
})
export class TutorialsService {

  constructor(private http: HttpClient) { }

  createTutorials(turorialsDatas: Td[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(TUTORIALS_URL, turorialsDatas)
        .subscribe(
          res =>{
            resolve(res);
          },
          err =>{
            reject(err);
          }
        )
    })
  }
}
