import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  private letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  constructor() { }

  get uniqueKey()
  {
    return `${ Math.random() }_${ new Date().getTime() }`;
  }

  get lowerCasesLetters()
  {
    return this.letters.join(",").toLowerCase().split(",");
  }
  get upperCasesLetters()
  {
    return this.letters.join(",").toUpperCase().split(",");
  }
}
