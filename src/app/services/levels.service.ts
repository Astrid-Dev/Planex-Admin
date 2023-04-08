import { Injectable } from '@angular/core';
import {Niveau} from "../models/Niveau";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const LEVELS_URL = environment.BACKEND_URL + "/niveaux";

@Injectable({
  providedIn: 'root'
})
export class LevelsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string, facultyId: number = 1)
  {
    return new Promise<Niveau[]>((resolve, reject) =>{
      const datas = buffer.split("\n").filter(elt => {
        return elt.split(",").length > 1;
      });
      let result : Niveau[] = [];
      let i = 1;

      if(datas.length > 1)
      {
        const entete = datas[0];
        const numberOfLines = entete.split(",").length;
        if(numberOfLines !== 3 && numberOfLines !== 4)
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

            if(numberOfLines === 4)
            {
              ++j;
            }

            const code = line[j].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const intitule = line[j+1].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const intitule_en = line[j+2].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();

            const newNiveau:Niveau = {
              id: i,
              code: code,
              intitule: intitule,
              intitule_en: intitule_en !== "" ? intitule_en : intitule,
              faculteId: facultyId
            }

            result.push(newNiveau);
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

  createLevels(levelsDatas: Niveau[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(LEVELS_URL, levelsDatas)
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
