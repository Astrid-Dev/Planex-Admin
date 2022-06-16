import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {max} from "rxjs/operators";

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  current_menu = -1;

  constructor(private router: Router) {

    router.events
      .subscribe(event =>
      {
        if(event instanceof NavigationEnd)
        {
          const url = event.url;
          switch (url) {
            case "/home" :{
              this.current_menu = 0;
              break;
            }
            case "/files-input" :{
              this.current_menu = 1;
              break;
            }
            case "/files-input/domains" :{
              this.current_menu = 2;
              break;
            }
            case "/files-input/times-ranges" :{
              this.current_menu = 3;
              break;
            }
            case "/files-input/teachers" :{
              this.current_menu = 4;
              break;
            }
            case "/files-input/rooms" :{
              this.current_menu = 5;
              break;
            }
            case "/files-input/sectors" :{
              this.current_menu = 6;
              break;
            }
            case "/files-input/levels" :{
              this.current_menu = 7;
              break;
            }
            case "/files-input/classrooms" :{
              this.current_menu = 8;
              break;
            }
            case "/files-input/teaching-units" :{
              this.current_menu = 9;
              break;
            }
            case "/files-input/students" :{
              this.current_menu = 10;
              break;
            }
            case "/configurations" :{
              this.current_menu = 11;
              break;
            }
            case "/configurations/times" :{
              this.current_menu = 12;
              break;
            }
            case "/configurations/courses-groups" :{
              this.current_menu = 13;
              break;
            }
            case "/plannings" :{
              this.current_menu = 14;
              break;
            }
            case "/plannings/courses" :{
              this.current_menu = 15;
              break;
            }
            case "/plannings/tutorials" :{
              this.current_menu = 16;
              break;
            }

          }

          if(url.includes("/plannings/courses"))
          {
            this.current_menu = 15;
          }

          if(url.includes("/plannings/tutorials"))
          {
            this.current_menu = 16;
          }
        }
      });

  }

  ngOnInit(): void {

  }

  getNavClassName(preferMenu: number, minMenu: number=-1, maxMenu: number=-1)
  {
    if(minMenu !== -1 && maxMenu !== -1)
    {
      if(this.current_menu === preferMenu)
      {
        return "nav-item has-sub active";
      }
      else if(this.current_menu >= minMenu && this.current_menu <= maxMenu)
      {
        return "nav-item has-sub open";
      }
      else
      {
        return "nav-item has-sub";
      }
    }
    else
    {
      if(this.current_menu === preferMenu)
      {
        return "active";
      }
      else
      {
        return "";
      }
    }
  }

}
