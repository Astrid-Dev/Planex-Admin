import { Injectable } from '@angular/core';
import {Salle} from "../models/Salle";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const ROOMS_URL = environment.BACKEND_URL + "/salles";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string, facultyId: number = 1)
  {
    return new Promise<Salle[]>((resolve, reject) =>{
      const datas = buffer.split("\n").filter(elt => {
        console.log(elt);
        
        return elt.split(",").length > 1;
      });
      let result : Salle[] = [];
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
          //the file doesn't contain the horodating column if number of lines = 4 and it contain the horodating column else

          while(i < datas.length)
          {
            const line = datas[i].split(",");

            let j = 0;

            if(numberOfLines === 8)
            {
              ++j;
            }


            const code = line[j].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim().toUpperCase();
            const intitule = line[j+1].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const intitule_en = line[j+2].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const capacite = parseInt(line[j+3].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim());
            const capacite_barr = parseInt(line[j+4].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim());
            const capacite_exam = parseInt(line[j+5].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim());
            const etat = line[j+6].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();

            const newSalle:Salle = {
              id: i,
              code: code,
              intitule: intitule,
              intitule_en: intitule_en !== "" ? intitule_en : intitule,
              capacite: capacite,
              capacite_barr: capacite_barr,
              capacite_exam: capacite_exam,
              faculteId: facultyId,
              etat: etat
            }

            result.push(newSalle);
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

  createRooms(roomsDatas: Salle[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(ROOMS_URL, roomsDatas)
        .subscribe({
          next: res => {
            resolve(res);
          },
          error: err => {
            reject(err);
          }
        })
    })
  }
}
