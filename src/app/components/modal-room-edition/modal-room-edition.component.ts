import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {TranslationService} from "../../services/translation.service";
import {FacultyService} from "../../services/faculty.service";

const MODAL_ID = "roomEditionModal";

@Component({
  selector: 'app-modal-room-edition',
  templateUrl: './modal-room-edition.component.html',
  styleUrls: ['./modal-room-edition.component.scss']
})
export class ModalRoomEditionComponent implements OnInit, AfterViewInit {

  modal: any = null;

  editRoomForm !: UntypedFormGroup;
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
      this.editRoomForm = this.formBuilder.group({
        code: [this.data.code, [Validators.required]],
        capacity: [this.data.capacite, [Validators.required]],
        capacity_barr: [this.data.capacite_barr, [Validators.required]],
        capacity_exam: [this.data.capacite_exam, [Validators.required]]
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
    return this.editRoomForm.controls;
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
