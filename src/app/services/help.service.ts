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

  getLettersInInterval(letter1: string, letter2: string, firstInside: boolean = false, lastInside: boolean = false)
  {
    let init = this.getLetterIndex(letter1) + 1;
    let end = this.getLetterIndex(letter2);

    if(firstInside)
    {
      --init;
    }

    if(lastInside)
    {
      ++end;
    }

    let result: any = [];

    for(let i = init; i < end; i++)
    {
      result.push(this.letters[i]);
    }

    return result;
  }

  getLetterIndex(letter: string)
  {
    return this.letters.indexOf(letter);
  }
}
