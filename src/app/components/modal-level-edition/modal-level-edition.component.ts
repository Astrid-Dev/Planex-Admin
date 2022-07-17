import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";

const MODAL_ID = "levelEditionModal";

@Component({
  selector: 'app-modal-level-edition',
  templateUrl: './modal-level-edition.component.html',
  styleUrls: ['./modal-level-edition.component.scss']
})
export class ModalLevelEditionComponent implements OnInit {

  modal: any = null;

  editLevelForm !: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.editLevelForm = this.formBuilder.group({
        code: [this.data.code, [Validators.required]],
        entitled: [this.data.intitule, [Validators.required]],
        entitled_en: [this.data.intitule_en, [Validators.required]]
      });
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      // this.divideClassroom = "no";
      this.modal.removeData();
    });
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
    return this.editLevelForm.controls;
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
