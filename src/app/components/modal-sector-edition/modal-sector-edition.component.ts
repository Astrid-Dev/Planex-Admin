import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {Departement} from "../../models/Departement";

const MODAL_ID = "sectorEditionModal";

@Component({
  selector: 'app-modal-sector-edition',
  templateUrl: './modal-sector-edition.component.html',
  styleUrls: ['./modal-sector-edition.component.scss']
})
export class ModalSectorEditionComponent implements OnInit {

  modal: any = null;

  editSectorForm !: FormGroup;
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
      this.editSectorForm = this.formBuilder.group({
        code: [this.data.code, [Validators.required]],
        entitled: [this.data.intitule, [Validators.required]],
        entitled_en: [this.data.intitule_en, [Validators.required]],
        department: [this.departments.find(c => c.id === this.data.departementId)?.id, [Validators.required]],
      });
    });

    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      // this.divideClassroom = "no";
      this.modal.removeData();
    });
  }

  get departments()
  {
    return this.facultyService.facultyDepartments;
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
    return this.editSectorForm.controls;
  }

  onApply()
  {
    this.isSubmitted = true;
  }

  close()
  {
    this.modal.close();
  }

  departementName(dept: Departement){
    return this.translationService.getCurrentLang() === "fr" ? dept.nom : dept.nom_en;
  }

}
