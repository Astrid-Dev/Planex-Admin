import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";

const MODAL_ID = "classroomEditionModal";

@Component({
  selector: 'app-modal-classroom-edition',
  templateUrl: './modal-classroom-edition.component.html',
  styleUrls: ['./modal-classroom-edition.component.scss']
})
export class ModalClassroomEditionComponent implements OnInit, AfterViewInit {


  modal: any = null;

  editClassroomForm !: UntypedFormGroup;
  isSubmitted: boolean = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.editClassroomForm = this.formBuilder.group({
        code: [this.data.code, [Validators.required]],
        entitled: [this.data.intitule, [Validators.required]],
        entitled_en: [this.data.intitule_en, [Validators.required]],
        sector: [this.sectors.find(s => s.id === this.data.filiereId)?.id, [Validators.required]],
        level: [this.levels.find(l => l.id === this.data.niveauId)?.id, [Validators.required]]
      });
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.modal.removeData();
    });
  }

  get sectors(){
    return this.facultyService.facultySectors;
  }

  get levels()
  {
    return this.facultyService.facultyLevels;
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
    return this.editClassroomForm.controls;
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
