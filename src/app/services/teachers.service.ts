import { Injectable } from '@angular/core';
import { Enseignant } from '../models/Enseignant';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../environments/environment";

const TEACHERS_URL = BACKEND_URL+"/enseignants";

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string, facultyId: number = 1)
  {
    return new Promise<Enseignant[]>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : Enseignant[] = [];
      let i = 1;

      if(datas.length > 1)
      {
        const entete = datas[0];
        const numberOfLines = entete.split(",").length;
        if(numberOfLines !== 4 && numberOfLines !== 5)
        {
          reject("Fichier non conforme");
        }
        else
        {
          //the file doesn't contain the horodating column if number of lines = 4 and it contain the horodating column else

          while(i < datas.length)
          {
            const line = datas[i].split(",");

            let j = 0;

            if(numberOfLines === 5)
            {
              ++j;
            }

            const newEnseignant:Enseignant = {
              id: i,
              noms: line[j].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim().toUpperCase(),
              telephone: line[j+1].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim(),
              email: line[j+2].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim(),
              bureau: line[j+3].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim(),
              faculteId: facultyId
            }

            result.push(newEnseignant);
            ++i;
          }

          resolve(result);

        }
      }
      else
      {
        reject("Fichier vide")
      }

    });
  }

  createTeachers(teachersDatas: Enseignant[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(TEACHERS_URL, teachersDatas)
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
