import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FacultyService} from "../../services/faculty.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {Domaine} from "../../models/Domaine";

const MODAL_ID = "teacherEditionModal";

@Component({
  selector: 'app-modal-teacher-edition',
  templateUrl: './modal-teacher-edition.component.html',
  styleUrls: ['./modal-teacher-edition.component.scss']
})
export class ModalTeacherEditionComponent implements OnInit, AfterViewInit {

  modal: any = null;

  editTeacherForm !: FormGroup;
  selectedDomains: Domaine[] = [];
  dropdownSettings = {};
  domainsList: Domaine[] = [];

  isSubmitted: boolean = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private translationService: TranslationService,
    private facultyService: FacultyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.editTeacherForm = this.formBuilder.group({
        names: [this.data.noms, [Validators.required]],
        sex: [this.data.sexe, [Validators.required]],
        phoneNumber: [this.data.telephone, [Validators.required]],
        email: [this.data.email, [Validators.required, Validators.email]],
        office: [this.data.office],
        grade: [this.data.grade],
        establishment: [this.data.etablissement],
        position: [this.data.position]
      });
      this.domainsList = this.facultyService.facultyDomains;
      let temp = this.facultyService.getATeacherDomains(this.data.id);
      let temp2 = temp.map(elt => elt.domaineId);
      this.selectedDomains = this.domainsList.filter(elt => elt.id && temp2.includes(elt.id));
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: this.translationService.getCurrentLang() === "fr" ? "nom" : "nom_en",
        selectAllText: this.translationService.getCurrentLang() === "fr" ? "Tout sélectionner" : "Select all",
        unSelectAllText: this.translationService.getCurrentLang() === "fr" ? "Tout désélectionner" : "Unselect all",
        itemsShowLimit: 4,
        allowSearchFilter: true
      };
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
    return this.editTeacherForm.controls;
  }

  onDomainSelect(item: any) {
    console.log(item);
  }

  onSelectAllDomains(items: any) {
    console.log(items);
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
