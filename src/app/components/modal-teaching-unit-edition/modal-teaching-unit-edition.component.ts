import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";
import {Domaine} from "../../models/Domaine";

const MODAL_ID = "teachingUnitEditionModal";

@Component({
  selector: 'app-modal-teaching-unit-edition',
  templateUrl: './modal-teaching-unit-edition.component.html',
  styleUrls: ['./modal-teaching-unit-edition.component.scss']
})
export class ModalTeachingUnitEditionComponent implements OnInit {

  modal: any = null;

  editTeachingUnitForm !: FormGroup;
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
      this.editTeachingUnitForm = this.formBuilder.group({
        code: [this.data.code, [Validators.required]],
        entitled: [this.data.intitule, [Validators.required]],
        entitled_en: [this.data.intitule_en, [Validators.required]],
        classroom: [this.classrooms.find(c => c.id === this.data.classeId)?.id, [Validators.required]],
        semester: [this.data.semestre, [Validators.required]],
        domain: [this.domains.find(d => d.id === this.data.domaineId)?.id, [Validators.required]],
        hours: [this.data.quota_horaire, [Validators.required, Validators.min(1), Validators.max(100)]],
        optional: [this.data?.est_optionnelle?.toString()],
      });
    });

    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      // this.divideClassroom = "no";
      this.modal.removeData();
    });
  }

  getDomaineName(domain: Domaine)
  {
    return this.translationService.getCurrentLang() === "fr" ? domain.nom : domain.nom_en;
  }

  get domains()
  {
    return this.facultyService.facultyDomains;
  }

  get classrooms()
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
    return this.editTeachingUnitForm.controls;
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
