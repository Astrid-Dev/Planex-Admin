import { Injectable } from '@angular/core';
import {Filiere} from "../models/Filiere";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const SECTORS_URL = environment.BACKEND_URL + "/filieres";

@Injectable({
  providedIn: 'root'
})
export class SectorsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string)
  {
    return new Promise<Filiere[]>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : Filiere[] = [];
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

            const code = line[j].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim().toUpperCase();
            const intitule = line[j+1].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const intitule_en = line[j+2].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const department = line[j+3].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();

            const newFiliere:Filiere = {
              id: i,
              code: code,
              intitule: intitule,
              intitule_en: intitule_en !== "" ? intitule_en : intitule,
              departement: department
            }

            result.push(newFiliere);
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

  createSectors(sectorsDatas: Filiere[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(SECTORS_URL, sectorsDatas)
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

  updateASector(sectorId: number, newSectorData: Filiere)
  {
    return new Promise((resolve, reject) =>{
      this.http.put(SECTORS_URL+"/"+sectorId, newSectorData)
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          }
        })
    });
  }
}
