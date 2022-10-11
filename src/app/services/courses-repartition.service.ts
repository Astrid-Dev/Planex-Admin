import { Injectable } from '@angular/core';
import {RepartitionCours} from "../models/RepartitionCours";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const COURSES_REPARTITION_URL = environment.BACKEND_URL + "/repartitionCours";

@Injectable({
  providedIn: 'root'
})
export class CoursesRepartitionService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string, academicYearId: any)
  {
    return new Promise<RepartitionCours[]>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : RepartitionCours[] = [];
      let i = 1;

      if(datas.length > 1)
      {
        const entete = datas[0];
        const numberOfLines = entete.split(",").length;
        if(numberOfLines !== 6 && numberOfLines !== 7)
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

            if(numberOfLines === 7)
            {
              ++j;
            }

            const classe = line[j].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const ue = line[j+1].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const enseignant1 = line[j+2].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const enseignant2 = line[j+3].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const enseignant3 = line[j+4].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const enseignant4 = line[j+5].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();

            const newRepartitionCours:RepartitionCours = {
              id: i,
              anneeScolaireId: academicYearId,
              enseignant1: enseignant1,
              enseignant2: enseignant2,
              enseignant3: enseignant3,
              enseignant4: enseignant4,
              ue: ue,
              classe: classe
            }

            result.push(newRepartitionCours);
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

  createCoursesRepartition(coursesRepartitionDatas: RepartitionCours[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(COURSES_REPARTITION_URL, coursesRepartitionDatas)
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
