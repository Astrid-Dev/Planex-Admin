import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PageHeaderRowComponent } from './components/page-header-row/page-header-row.component';
import { FileImportComponent } from './components/file-import/file-import.component';
import { FileInputTeachersComponent } from './pages/file-input-teachers/file-input-teachers.component';
import { FileInputSectorsComponent } from './pages/file-input-sectors/file-input-sectors.component';
import { FileInputTeachingUnitsComponent } from './pages/file-input-teaching-units/file-input-teaching-units.component';
import { FileInputRoomsComponent } from './pages/file-input-rooms/file-input-rooms.component';
import { FileInputClassroomsComponent } from './pages/file-input-classrooms/file-input-classrooms.component';
import { FileInputStudentsComponent } from './pages/file-input-students/file-input-students.component';
import { FilesInputComponent } from './pages/files-input/files-input.component';
import { FileInputLevelsComponent } from './pages/file-input-levels/file-input-levels.component';
import {FormsModule} from "@angular/forms";
import { DndDirective } from './directives/dnd.directive';
import { ProgressComponent } from './components/progress/progress.component';
import { ConfigurationTimesComponent } from './pages/configuration-times/configuration-times.component';
import { ConfigurationCoursesGroupsComponent } from './pages/configuration-courses-groups/configuration-courses-groups.component';
import { SectorsListComponent } from './components/sectors-list/sectors-list.component';
import { ClassroomsListComponent } from './components/classrooms-list/classrooms-list.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { ModalSectiorTimeSelectionComponent } from './components/modal-sectior-time-selection/modal-sectior-time-selection.component';
import { ModalCourseGroupsConfigurationComponent } from './components/modal-course-groups-configuration/modal-course-groups-configuration.component';
import { PlanningsComponent } from './pages/plannings/plannings.component';
import { PlanningCoursesComponent } from './pages/planning-courses/planning-courses.component';
import { CoursesTimeTableComponent } from './components/courses-time-table/courses-time-table.component';
import { ModalUpdatingCoursesPlanningComponent } from './components/modal-updating-courses-planning/modal-updating-courses-planning.component';
import { MultiCoursesTimeTableComponent } from './components/multi-courses-time-table/multi-courses-time-table.component';

// Factory function required during AOT compilation
export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SidemenuComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    PageHeaderRowComponent,
    FileImportComponent,
    FileInputTeachersComponent,
    FileInputSectorsComponent,
    FileInputTeachingUnitsComponent,
    FileInputRoomsComponent,
    FileInputClassroomsComponent,
    FileInputStudentsComponent,
    FilesInputComponent,
    FileInputLevelsComponent,
    DndDirective,
    ProgressComponent,
    ConfigurationTimesComponent,
    ConfigurationCoursesGroupsComponent,
    SectorsListComponent,
    ClassroomsListComponent,
    ConfigurationsComponent,
    ModalSectiorTimeSelectionComponent,
    ModalCourseGroupsConfigurationComponent,
    PlanningsComponent,
    PlanningCoursesComponent,
    CoursesTimeTableComponent,
    ModalUpdatingCoursesPlanningComponent,
    MultiCoursesTimeTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forChild(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    NgxSmartModalModule.forRoot(),
    AutocompleteLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }