import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FacultyService} from "../../services/faculty.service";
import {TranslationService} from "../../services/translation.service";
import {Filiere} from "../../models/Filiere";

@Component({
  selector: 'app-sectors-list',
  templateUrl: './sectors-list.component.html',
  styleUrls: ['./sectors-list.component.scss']
})
export class SectorsListComponent implements OnInit {

  @Output("onSelectSector") selectedSector: EventEmitter<{sector: Filiere, searchText: string | null}> = new EventEmitter();
  @Input("preferredSector") preferredSector: string | null = null;
  hasLoadedDatas: boolean | null = null;
  searchText: string = "";
  sectorsList: Filiere[] = [];

  constructor(private facultyService: FacultyService, private translationService: TranslationService) { }

  ngOnInit(): void {
    this.searchText = this.preferredSector !== null ? this.preferredSector : "";
    this.loadSectors();
  }

  loadSectors()
  {
    this.hasLoadedDatas = null;
    if(!this.facultyService.hasLoaded)
    {
      this.facultyService.findOneFacultyWithSubsDatas(1)
        .then((res) =>{
          this.sectorsList = this.sectors;
          this.filter();
          this.hasLoadedDatas = true;
        })
        .catch((err) =>{
          console.error(err);
          this.hasLoadedDatas = false;
        });
    }
    else
    {
      this.sectorsList = this.sectors
      this.filter();
      this.hasLoadedDatas = true;
    }
  }

  get sectors()
  {
    return this.facultyService.facultySectors;
  }

  getSectorEntitled(sector: Filiere)
  {
    if(this.translationService.getCurrentLang() === "en")
    {
      return sector.intitule_en;
    }
    else
    {
      return sector.intitule;
    }
  }

  filter()
  {
    this.sectorsList = this.sectors.filter((sector) =>{
      if(this.searchText === "")
      {
        return true;
      }
      else{
        return (
          (sector.code.includes(this.searchText.toUpperCase())) ||
          (sector.intitule && sector.intitule.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (sector.intitule_en && sector.intitule_en.toLowerCase().includes(this.searchText.toLowerCase()))
        );
      }
    })
  }

  onChooseSector(sector: Filiere)
  {
    this.selectedSector.emit({sector: sector, searchText: this.searchText});
  }

  getTimeTypeDescription(timeTypeId: number|null|undefined)
  {
    if(timeTypeId === null || typeof timeTypeId === "undefined"){
      return this.translationService.getValueOf("SECTORSLIST.UNDEFINEDTIME");
    }
    else{
      let timeType: any = this.facultyService.facultyTimes.find(time => time.id === timeTypeId);
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

  }

}
