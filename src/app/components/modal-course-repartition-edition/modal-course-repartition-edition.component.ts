import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {Classe} from "../../models/Classe";
import {Ue} from "../../models/Ue";

const MODAL_ID = "courseRepartitionEditionModal";

@Component({
  selector: 'app-modal-course-repartition-edition',
  templateUrl: './modal-course-repartition-edition.component.html',
  styleUrls: ['./modal-course-repartition-edition.component.scss']
})
export class ModalCourseRepartitionEditionComponent implements OnInit {

  modal: any = null;

  editcourseRepartionForm !: UntypedFormGroup;
  isSubmitted: boolean = false;

  classrooms: Classe[] = [];
  possiblesTeachingUnits: Ue[] = [];

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private formBuilder: UntypedFormBuilder
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) => {
      this.classrooms = this.classroomsList;
      console.log(this.classrooms);
      let classroomId: number | null = this.currentClassroomId ? this.currentClassroomId : null;
      this.editcourseRepartionForm = this.formBuilder.group({
        classroom: [classroomId ? classroomId : '', [Validators.required]],
        teaching_unit: [this.data.ueId ? this.data.ueId : '', [Validators.required]],
        teacher1: [this.data.enseignant1Id ? this.data.enseignant1Id : '', [Validators.required]],
        teacher2: [this.data.enseignant2Id ? this.data.enseignant2Id : ''],
        teacher3: [this.data.enseignant3Id ? this.data.enseignant3Id : ''],
        teacher4: [this.data.enseignant4Id ? this.data.enseignant4Id : ''],
      });
      console.log(this.editcourseRepartionForm)
      this.possiblesTeachingUnits = this.possiblesTeachingUnitsList;
      this.editcourseRepartionForm.get("classroom")?.valueChanges.subscribe((value) =>{
        console.log(value);
        this.editcourseRepartionForm.get("teaching_unit")?.setValue('');
        this.possiblesTeachingUnits = this.possiblesTeachingUnitsList;
      });
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) => {
      // this.divideClassroom = "no";
      this.modal.removeData();
    });
  }

  get currentClassroomId()
  {
    let temp = this.teachingUnits.find(elt => elt.id === this.data.ueId);
    return temp ? temp.classeId : null;
  }

  get teachingUnits()
  {
    return this.facultyService.facultyTeachingUnits;
  }

  get possiblesTeachingUnitsList()
  {
    if(this.editcourseRepartionForm)
    {
      let temp = this.editcourseRepartionForm.value.classroom;
      let classroom = this.classrooms.find(elt => elt.id?.toString() === temp);
      if(classroom)
      {
        let result = this.teachingUnits.filter(elt => elt.classeId === classroom?.id);
        return result;
      }
      else{
        return [];
      }
    }
    else{
      return [];
    }
  }

  get teachers()
  {
    return this.facultyService.facultyTeachers;
  }

  possiblesTeachers(teacherNumber: number)
  {
    let temp1 = [this.data.enseignant2Id, this.data.enseignant3Id, this.data.enseignant4Id];
    let temp2 = [this.data.enseignant1Id, this.data.enseignant3Id, this.data.enseignant4Id];
    let temp3 = [this.data.enseignant2Id, this.data.enseignant1Id, this.data.enseignant4Id];
    let temp4 = [this.data.enseignant1Id, this.data.enseignant3Id, this.data.enseignant2Id];

    if(teacherNumber === 1)
    {
      return this.teachers.filter(elt => !temp1.includes(elt.id));
    }
    else if(teacherNumber === 2)
    {
      return this.teachers.filter(elt => !temp2.includes(elt.id));
    }
    else if(teacherNumber === 3)
    {
      return this.teachers.filter(elt => !temp3.includes(elt.id));
    }
    else if(teacherNumber === 4)
    {
      return this.teachers.filter(elt => !temp4.includes(elt.id));
    }
    else return [];
  }

  get classroomsList()
  {
    return this.facultyService.facultyClassrooms;
  }

  get hasData()
  {
    return this.modal !== null && this.modal.hasData();
  }

  get data()
  {
    return this.hasData ? this.modal.getData() : null;
  }

  get errorControl()
  {
    return this.editcourseRepartionForm.controls;
  }

  onApply()
  {
    this.isSubmitted = true;
  }

  close()
  {
    this.modal.close();
  }

}
