import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  private convertFileToUrl(file: File)
  {
    return new Promise<string|ArrayBuffer>((resolve, reject) =>{
      const reader = new FileReader();
      reader.onloadend = function () {
        const url = reader.result;
        if(url === null)
        {
          reject(reader.error)
        }
        else{
          resolve(url);
        }
      };

      reader.onerror = function(){
        reject(reader.error);
      }
      reader.readAsDataURL(file);

    });
  }

  private readFileFromUrlAsText(url: string)
  {
    return new Promise<string>((resolve, reject) =>
      this.http.get(url, {responseType: 'text'}).subscribe(
        (response) =>{
          resolve(response);
        },
        (error) =>{
          console.error(error);
          reject(error);
        }
      )
    );
  }

  getFileContent(file: File)
  {
    return new Promise<string>((resolve, reject) =>{
      this.convertFileToUrl(file)
        .then((res) =>{
          if(typeof res === "string")
          {
            const url = res;
            this.readFileFromUrlAsText(url)
              .then((res) =>{
                let result = res.split("\n");

                for(let i = 0; i < result.length; i++)
                {
                  let tab = result[i].split(",");
                  let new_tab: string[] = [];
                  for(let j = 0; j < tab.length; j++)
                  {
                    let str = tab[j];
                    if(tab[j].includes("\""))
                    {
                      for(let k = j+1; k < tab.length; k++)
                      {
                        str += "£"+tab[k];
                        if(tab[k].includes("\""))
                        {
                          j += k-j;
                          break;
                        }
                      }
                    }
                    new_tab.push(str.replace('"', ""));
                  }
                  result[i] = new_tab.join(",");
                }
                resolve(result.join("\n"));
              })
              .catch((error) =>{
                reject(error);
              });
          }
          else{
            reject(":: Erreur :: Impossible de lire le fichier !!!");
          }
        })
        .catch((error) =>{
          reject(error);
        });
    });
  }

  getSpreedSheetContent(url: string)
  {
    return new Promise((resolve, reject) =>{
      this.http.get(url, {responseType: "text"})
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

  isValidUrl(url: string)
  {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(url);
  }

}
