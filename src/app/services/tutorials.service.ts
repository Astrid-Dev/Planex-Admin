import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Td} from "../models/Td";
import {environment} from "../../environments/environment";

const TUTORIALS_URL = environment.BACKEND_URL+"/tds";

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
