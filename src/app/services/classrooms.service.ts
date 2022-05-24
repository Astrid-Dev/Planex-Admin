import { Injectable } from '@angular/core';
import {Classe} from "../models/Classe";
import {BACKEND_URL} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

const CLASSROOMS_URL = BACKEND_URL + "/classes";

@Injectable({
  providedIn: 'root'
})
export class ClassroomsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string)
  {
    return new Promise<Classe[]>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : Classe[] = [];
      let i = 1;

      if(datas.length > 1)
      {
        const entete = datas[0];
        const numberOfLines = entete.split(",").length;
        if(numberOfLines !== 5 && numberOfLines !== 6)
        {
          reject("Fichier non conforme");
        }
        else
        {
          //the file doesn't contain the horodating column if number of lines = 5 and it contain the horodating column else

          while(i < datas.length)
          {
            const line = datas[i].split(",");

            let j = 0;

            if(numberOfLines === 6)
            {
              ++j;
            }

            const code = line[j].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const intitule = line[j+1].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const intitule_en = line[j+2].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const filiere = line[j+3].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const niveau = line[j+4].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();

            const newClasse:Classe = {
              id: i,
              code: code,
              intitule: intitule,
              intitule_en: intitule_en !== "" ? intitule_en : intitule,
              filiere: filiere,
              niveau: niveau,
              est_divisee: 0
            }

            result.push(newClasse);
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

  createClassrooms(classroomsDatas: Classe[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(CLASSROOMS_URL, classroomsDatas)
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

  updateAClassroom(newDatas: any, classroomId: number)
  {
    return new Promise((resolve, reject) =>{
      this.http.put(CLASSROOMS_URL+"/"+classroomId, newDatas)
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
