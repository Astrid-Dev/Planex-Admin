import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxSmartModalComponent, NgxSmartModalService} from "ngx-smart-modal";
import {FacultyService} from "../../services/faculty.service";
import {SectorsService} from "../../services/sectors.service";
import {Filiere} from "../../models/Filiere";
import Swal from "sweetalert2";
import {TranslationService} from "../../services/translation.service";

const MODAL_ID = "timeTypeSelection";

@Component({
  selector: 'app-modal-sectior-time-selection',
  templateUrl: './modal-sectior-time-selection.component.html',
  styleUrls: ['./modal-sectior-time-selection.component.scss']
})
export class ModalSectiorTimeSelectionComponent implements OnInit, AfterViewInit {

  @Output("OnApplyModification") applyEvent : EventEmitter<any> = new EventEmitter();

  modal: any = null;
  selectedTimeType: number | null | string = null;
  isLoading: boolean = false;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private facultyService: FacultyService,
    private sectorsService: SectorsService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = this.ngxSmartModalService.getModal(MODAL_ID);
    this.modal.addCustomClass("nsm-centered");
    this.modal.onOpenFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.selectedTimeType = this.sector.typeHoraireId ? this.sector.typeHoraireId : null;
    });
    this.modal.onAnyCloseEventFinished.subscribe((mountModal: NgxSmartModalComponent) =>{
      this.selectedTimeType = null;
      this.isLoading = false;
      this.modal.removeData();
    });
  }

  get hasData()
  {
    return this.modal !== null && this.modal.hasData();
  }

  get sector()
  {
   return this.modal !== null ? this.modal.getData(): null;
  }

  get timesTypes()
  {
    return this.facultyService.facultyTimes;
  }

  getTimeTypeDescription(timeType: any)
  {
    let periods = timeType.periodes;
    let description = "";
    const length = 3
    for(let i = 0; i< length; i++)
    {
      description += periods[i].debut + " - " + periods[i].fin;
      if(i !== length - 1)
      {
        description += "  |  ";
      }
    }

    if(length !== periods.length)
    {
      description += " ...";
    }

    return description;
  }

  onChooseTimeType(evt: any)
  {
    console.log(evt);
  }

  close()
  {
    this.modal.close();
  }

  onApply()
  {
    if(this.selectedTimeType !== this.sector.typeHoraireId)
    {
      this.isLoading = true;
      let newSectorData: Filiere = {
        ...this.sector,
        typeHoraireId: this.selectedTimeType
      }
      let sectorId = this.sector.id;
      this.sectorsService.updateASector(sectorId, newSectorData)
        .then((res: any) =>{
          this.facultyService.updateOneSectorOnList(sectorId, res.filiere);
          this.isLoading = false;
          this.modal.close();
          Swal.fire({
            title: this.translationService.getValueOf("ALERT.SUCCESS"),
            text: this.translationService.getValueOf("CONFIGURATIONS.TIMES.SUCCESS1") + " "+ this.sector.code + " "+ this.translationService.getValueOf("CONFIGURATIONS.TIMES.SUCCESS2"),
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() =>{
            this.applyEvent.emit();
          });

        })
        .catch((err) =>{
          this.isLoading = false;
          console.error(err);
          Swal.fire({
            title: this.translationService.getValueOf("ALERT.ERROR"),
            text: this.translationService.getValueOf("CONFIGURATIONS.TIMES.ERROR1") + " ! "+ this.sector.code + " "+ this.translationService.getValueOf("CONFIGURATIONS.TIMES.ERROR2")+ " !",
            icon: 'error',
            confirmButtonText: 'OK'
          });
        })

    }
    else
    {
      this.close();
    }
  }

}
