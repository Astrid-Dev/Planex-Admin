import { Injectable } from '@angular/core';
import { Supervisor } from '../models/Supervisor';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const SUPERVISOR_URL = environment.BACKEND_URL+"/surveillants";


@Injectable({
  providedIn: 'root'
})
export class SupervisorsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string, facultyId: number = 1)
  {
    return new Promise<Supervisor[]>((resolve, reject) =>{
      const datas = buffer.split("\n").filter(elt => {
        return elt.split(",").length > 1;
      });
      let result : Supervisor[] = [];
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
            const noms = line[j].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim().toUpperCase();
            const telephone = line[j+1].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const email = line[j+2].replace("\r", "").replace("\t", "").replace("\"", "").replace("£", ",").trim();
            const bureau = line[j+3]?.replace("\r", "")?.replace("\t", "")?.replace("\"", "")?.replace("£", ",")?.trim();


            const newSupervisor:Supervisor = {
              id: i,
              noms: noms,
              telephone: telephone,
              email: email,
              bureau: bureau,
              faculteId: facultyId
            }

            result.push(newSupervisor);
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

  createSupervisors(surpervisorsDatas: Supervisor[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(SUPERVISOR_URL, surpervisorsDatas)
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
