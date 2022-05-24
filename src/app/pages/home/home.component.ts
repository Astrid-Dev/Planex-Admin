import { Component, OnInit } from '@angular/core';
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pageTitle = "";

  constructor(private translationService: TranslationService) {
  }

  ngOnInit(): void {
    this.pageTitle = "HOME.TITLE";
  }

}
