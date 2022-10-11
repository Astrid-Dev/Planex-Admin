import { Injectable } from '@angular/core';
import { Enseignant } from '../models/Enseignant';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const TEACHERS_URL = environment.BACKEND_URL+"/enseignants";

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
        if(numberOfLines !== 9 && numberOfLines !== 10)
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

            if(numberOfLines === 10)
            {
              ++j;
            }

            const MEN = ["HOMME", "MAN", "MASCULIN", "MALE", "GARCON", "BOY"];
            const WOMEN = ["FEMME", "WOMAN", "FEMININ", "FEMALE", "FILLE", "GIRL"];

            const noms = line[j].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim().toUpperCase();
            const sexe = line[j+1].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim().toUpperCase();
            const telephone = line[j+2].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const email = line[j+3].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const bureau = line[j+4].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const domaines = line[j+5].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim().split(",");
            const grade = line[j+6].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const etablissement = line[j+7].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const position = line[j+8].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();

            let dataToSave: string[] = [];
            domaines.forEach((elt, index, array) =>{
              if(elt.includes("£"))
              {
                elt.split("£").forEach((temp) =>{
                  dataToSave.push(temp.replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim())
                });
              }
              else{
               dataToSave.push(elt.replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim());
              }
            });

            const newEnseignant:Enseignant = {
              id: i,
              noms: noms,
              sexe: MEN.includes(sexe) ? 1 : WOMEN.includes(sexe) ? 2 : 1,
              telephone: telephone,
              email: email,
              bureau: bureau,
              nomsDomaines: dataToSave,
              grade: grade,
              etablissement: etablissement,
              position: position,
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
