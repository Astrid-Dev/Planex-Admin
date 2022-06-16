import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
import {FilesInputComponent} from "./pages/files-input/files-input.component";
import {FileInputTeachersComponent} from "./pages/file-input-teachers/file-input-teachers.component";
import {FileInputSectorsComponent} from "./pages/file-input-sectors/file-input-sectors.component";
import {FileInputLevelsComponent} from "./pages/file-input-levels/file-input-levels.component";
import {FileInputRoomsComponent} from "./pages/file-input-rooms/file-input-rooms.component";
import {FileInputClassroomsComponent} from "./pages/file-input-classrooms/file-input-classrooms.component";
import {FileInputStudentsComponent} from "./pages/file-input-students/file-input-students.component";
import {FileInputTeachingUnitsComponent} from "./pages/file-input-teaching-units/file-input-teaching-units.component";
import {ConfigurationTimesComponent} from "./pages/configuration-times/configuration-times.component";
import {ConfigurationCoursesGroupsComponent} from "./pages/configuration-courses-groups/configuration-courses-groups.component";
import {ConfigurationsComponent} from "./pages/configurations/configurations.component";
import {PlanningCoursesComponent} from "./pages/planning-courses/planning-courses.component";
import {PlanningsComponent} from "./pages/plannings/plannings.component";
import {FileInputTimesRangesComponent} from "./pages/file-input-times-ranges/file-input-times-ranges.component";
import {FileInputDomainsComponent} from "./pages/file-input-domains/file-input-domains.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home"
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "page-not-found",
    component: PageNotFoundComponent,
  },
  {
    path: "files-input",
    children: [
      {
        path: "",
        component: FilesInputComponent,
      },
      {
        path: "teachers",
        component: FileInputTeachersComponent
      },
      {
        path: "sectors",
        component: FileInputSectorsComponent
      },
      {
        path: "levels",
        component: FileInputLevelsComponent
      },
      {
        path: "rooms",
        component: FileInputRoomsComponent,
      },
      {
        path: "classrooms",
        component: FileInputClassroomsComponent
      },
      {
        path: "students",
        component: FileInputStudentsComponent
      },
      {
        path: "teaching-units",
        component: FileInputTeachingUnitsComponent
      },
      {
        path: "times-ranges",
        component: FileInputTimesRangesComponent
      },
      {
        path: "domains",
        component: FileInputDomainsComponent
      },
      {
        path: "**",
        redirectTo: "page-not-found"
      }
    ]
  },
  {
    path: "configurations",
    children : [
      {
        path: "",
        component: ConfigurationsComponent
      },
      {
        path: 'times',
        component: ConfigurationTimesComponent
      },
      {
        path: 'courses-groups',
        component: ConfigurationCoursesGroupsComponent
      },
      {
        path: "**",
        redirectTo: "page-not-found"
      }
    ]
  },
  {
    path: "plannings",
    children : [
      {
        path: "",
        component: PlanningsComponent
      },
      {
        path: 'courses',
        component: PlanningCoursesComponent
      },
      {
        path: "**",
        redirectTo: "page-not-found"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "page-not-found"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
