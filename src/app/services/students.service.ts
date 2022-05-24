import { Injectable } from '@angular/core';
import {Etudiant} from "../models/Etudiant";
import {BACKEND_URL} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

const STUDENTS_URL = BACKEND_URL+"/etudiants"

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string)
  {
    return new Promise<Etudiant[]>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : Etudiant[] = [];
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
          //the file doesn't contain the horodating column if number of lines = 5 and it contain the horodating column else

          while(i < datas.length)
          {
            const line = datas[i].split(",");

            let j = 0;

            if(numberOfLines === 5)
            {
              ++j;
            }

            const noms = line[j].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const matricule = line[j+1].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();
            const email = line[j+2].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const classe = line[j+3].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim().toUpperCase();

            const newEtudiant:Etudiant = {
              id: i,
              matricule: matricule,
              noms: noms ,
              email: email,
              classe: classe,
            }


            result.push(newEtudiant);
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

  createStudents(studentsDatas: Etudiant[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(STUDENTS_URL, studentsDatas)
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
