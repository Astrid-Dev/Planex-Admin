import { Injectable } from '@angular/core';
import {Niveau} from "../models/Niveau";
import {Periode, TypeHoraire} from "../models/TypeHoraire";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const PERIODS_URL = environment.BACKEND_URL + "/types-horaires";
const TIMESRANGE_URL = environment.BACKEND_URL + "/typesHoraires";

@Injectable({
  providedIn: 'root'
})
export class TimesRangesService {

  constructor(private http: HttpClient) { }

  extractDataFromFile(buffer: string)
  {
    return new Promise<Periode[]>((resolve, reject) =>{
      const datas = buffer.split("\n");
      let result : Periode[] = [];
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

            const debut = line[j].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();
            const fin = line[j+1].replace("\r", "").replace("\"", "").replace("\t", "").replace("£", ",").trim();

            const newNiveau:Periode = {
              id: i,
              debut: this.getTimeInFrench(debut),
              fin: this.getTimeInFrench(fin),
              debut_en: this.getTimeInEnglish(debut),
              fin_en: this.getTimeInEnglish(fin)
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

  private getTimeInFrench(time: string)
  {
    const defaultTime = "00h00";
    let result = "";
    if(time === "")
    {
      result = defaultTime;
    }
    else{
      try{
        let hour: number | string = parseInt(time.split(":")[0]);
        let minute: number | string = parseInt(time.split(":")[1]);

        hour = (hour.toString().length === 1 ? ("0"+hour) : (hour));
        minute = (minute.toString().length === 1 ? ("0"+minute) : (minute));

        result = (hour + "h" + minute);
      } catch (e) {
        result = defaultTime;
      }
    }

    return result;
  }

  private getTimeInEnglish(time: string)
  {
    const defaultTime = "00:00 AM";
    let result = "";
    if(time === "")
    {
      result = defaultTime;
    }
    else{
      try{
        let hour: number | string = parseInt(time.split(":")[0]);
        let minute: number | string = parseInt(time.split(":")[1]);
        let timeDescrip: string =(hour > 12) ? "PM" : "AM";

        hour = (hour > 12) ? (hour - 12) : hour;

        hour = (hour.toString().length === 1 ? ("0"+hour) : (hour));
        minute = (minute.toString().length === 1 ? ("0"+minute) : (minute));

        result = (hour + ":" + minute+ " "+timeDescrip);
      } catch (e) {
        result = defaultTime;
      }
    }

    return result;
  }

  createTimeType(timeType: TypeHoraire)
  {
    return new Promise((resolve, reject) =>{
      this.http.post(TIMESRANGE_URL, timeType)
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
