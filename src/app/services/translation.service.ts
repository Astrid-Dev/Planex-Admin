import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

const LANGUAGE_KEY = "LANGUAGE";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private currentLang !: string;
  private langsList = ["fr", "en"];

  constructor(private translate: TranslateService) {
    translate.addLangs(this.langsList);

    setTimeout(() =>{
      const lang = localStorage.getItem(LANGUAGE_KEY);
      console.log(lang);
      if(lang)
      {
        translate.setDefaultLang(JSON.parse(lang));
        this.currentLang = JSON.parse(lang);
      }
      else
      {
        this.currentLang = this.langsList[0];
        translate.setDefaultLang(this.currentLang);
      }
    }, 200)
  }

  changeLanguage(newLang: string)
  {
    if(this.currentLang !== newLang && this.translate.getLangs().includes(newLang))
    {
      this.translate.use(newLang);
      this.currentLang = newLang;
      localStorage.setItem(LANGUAGE_KEY, JSON.stringify(newLang));
    }
  }

  getCurrentLang()
  {
    return this.currentLang;
  }

  getValueOf(key: string)
  {
    return this.translate.instant(key);
  }

}
