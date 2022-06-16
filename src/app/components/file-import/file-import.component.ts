import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileUploadService} from "../../services/file-upload.service";
import Swal from "sweetalert2";
import {TranslationService} from "../../services/translation.service";

@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit {

  @Output("onExtract") resultString: EventEmitter<string> = new EventEmitter();
  @Input() isImporting !: boolean;

  files: any[] = [];
  url = "";

  hasUploadedFile: boolean = false;
  isReadingFile: boolean = false;
  isAnalysingUrl: boolean = false;

  currentTab: number = 1;

  constructor(private fileUploadService: FileUploadService, private translationService: TranslationService) { }

  ngOnInit(): void {
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(evt: any) {
    const files = evt.target.files;
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;

            if(this.files[index].progress === 100)
            {
              this.hasUploadedFile = true;
            }
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    this.hasUploadedFile = false;
    const lastFile = this?.files[0];
    const item = files[0];
    if(item.type === "text/csv" || item.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || item.type === ".csv" || item.type === "application/vnd.ms-excel")
    {
      item.progress = 0;
      this.files[0] = item;
    }
    else
    {
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.INFO"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.INVALIDFILE"),
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
    if(lastFile !== this.files[0])
    {
      this.uploadFilesSimulator(0);
    }
  }

  formatBytes(bytes: number, decimals: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  readFileContent()
  {
    this.isReadingFile = true;

    this.fileUploadService.getFileContent(this.files[0])
      .then((res) =>{
        this.resultString.emit(res);
        this.isReadingFile = false;
      })
      .catch((error) =>{
        console.error(error);
        this.isReadingFile = false;
        Swal.fire({
          title: this.translationService.getValueOf("ALERT.ERROR"),
          text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.READINGFILEERROR"),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }

  analyseUrl()
  {
    if(!this.fileUploadService.isValidUrl(this.url))
    {
      Swal.fire({
        title: this.translationService.getValueOf("ALERT.ERROR"),
        text: this.translationService.getValueOf("FILESINPUT.FILEIMPORT.INVALIDURL"),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    else{
      this.isAnalysingUrl = true;
      this.fileUploadService.getSpreedSheetContent(this.url)
        .then((res) =>{
          console.log(res);
          this.isAnalysingUrl = false;
        })
        .catch((err) =>{
          console.error(err);
          this.isAnalysingUrl = false;
        })
    }
  }

  setCurrentTab(tab: number)
  {
    this.currentTab = tab;
  }

  getTabClassName(tab: number)
  {
    if(tab === this.currentTab)
    {
      return "tab-pane fade active in";
    }
    else {
      return "tab-pane fade";
    }
  }

  getTabLinkClassName(tab: number)
  {
    if(tab === this.currentTab)
    {
      return "nav-link active";
    }
    else {
      return "nav-link";
    }
  }

}
