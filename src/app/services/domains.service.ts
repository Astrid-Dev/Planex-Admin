import { Injectable } from '@angular/core';
import {Domaine} from "../models/Domaine";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const DOMAINS_URL = environment.BACKEND_URL + "/domaines";

@Injectable({
  providedIn: 'root'
})
export class DomainsService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string, facultyId: number = 1)
  {
    return new Promise<Domaine[]>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : Domaine[] = [];
      let i = 1;

      if(datas.length > 1)
      {
        const entete = datas[0];
        const numberOfLines = entete.split(",").length;
        if(numberOfLines !== 2 && numberOfLines !== 3)
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

            if(numberOfLines === 3)
            {
              ++j;
            }

            const nom = line[j].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const nom_en = line[j+1].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();

            const newDomaine:Domaine = {
              id: i,
              nom: nom,
              nom_en: nom_en,
              faculteId: facultyId
            }

            result.push(newDomaine);
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

  createDomains(domainsDatas: Domaine[])
  {
    return new Promise((resolve, reject) =>{
      this.http.post(DOMAINS_URL, domainsDatas)
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
