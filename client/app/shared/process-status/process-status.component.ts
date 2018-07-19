import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'app-process-status',
    templateUrl: './process-status.component.html',
    styleUrls: ['./process-status.component.scss']
  })
  export class ProcessStatusComponent implements OnInit {

    @Input() condition: string;
    @Input() required: boolean = false;
    @Input() placeholder: string;
    @Output() outProcessStatus = new EventEmitter<string>();

    public processStatus: any;

    constructor(private commonApi: CommonApiService) { }

    ngOnInit() {

        this.commonApi.getProcessStatus(this.condition).subscribe(
            (res) => {
                
                //console.log('============= processStatus.commonApi.getProcessStatus(this.condition).subscribe ===============');
                //console.log(res);
                //console.log('================================================================================================');
                
                this.processStatus = res;
            },
            (error: HttpErrorResponse) => {
                console.log('error : ',error);
            }
        );

    }

    onSelect(processStatus:string){
        this.outProcessStatus.emit(processStatus);
    }
}

