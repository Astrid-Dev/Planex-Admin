import { Injectable } from '@angular/core';
import {Ue} from "../models/Ue";
import {Td} from "../models/Td";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../environments/environment";

export interface TeachingUnitResult{
  teachingUnits: Ue[],
  tutorials: Td[]
}

const TEACHING_UNITS_URL = BACKEND_URL+"/ues"

@Injectable({
  providedIn: 'root'
})
export class TeachingUnitsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string)
  {
    return new Promise<TeachingUnitResult>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : TeachingUnitResult = {teachingUnits:[], tutorials:[]};
      let i = 1;

      if(datas.length > 1)
      {
        const entete = datas[0];
        const numberOfLines = entete.split(",").length;
        if(numberOfLines !== 7 && numberOfLines !== 8)
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

            if(numberOfLines === 8)
            {
              ++j;
            }

            const code = line[j].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const intitule = line[j+1].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const intitule_en = line[j+2].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const est_optionnelle = line[j+3].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const possede_td = line[j+4].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const classe = line[j+5].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const semestre = line[j+6].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();

            const newUe:Ue = {
              id: i,
              code: code,
              intitule: intitule ,
              intitule_en: intitule_en !== "" ? intitule_en : intitule,
              est_optionnelle: est_optionnelle === "Oui",
              semestre: semestre !== "" ? parseInt(semestre) : 1,
              classe: classe,
              possede_td: possede_td === "Oui"
            }

            if(possede_td === "Oui")
            {
              const newTd: Td = {
                id: result.tutorials.length+1,
                code: "TD "+newUe.code,
                est_divise: false,
                ue: newUe.code
              }

              result.tutorials.push(newTd);
            }

            result.teachingUnits.push(newUe);
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

  createTeachingUnits(teachingUnitsDatas: Ue[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(TEACHING_UNITS_URL, teachingUnitsDatas)
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
