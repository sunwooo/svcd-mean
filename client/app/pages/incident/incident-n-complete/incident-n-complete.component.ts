import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LowerCdComponent } from '../../../shared/lower-cd/lower-cd.component';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { MatDatepickerInputEvent } from '@angular/material';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-incident-n-complete',
  templateUrl: './incident-n-complete.component.html',
  styleUrls: ['./incident-n-complete.component.css']
})
export class IncidentNCompleteComponent implements OnInit {

    @Input() incidentDetail: any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() output = new EventEmitter<boolean>(); //부모에게 이벤트 전달용

    private status_cd: string = "9"; //진행상태 미처리
    private status_nm: string = "미처리"; //진행상태명 미처리

    constructor(private auth: AuthService,
        private incidentService: IncidentService,
        public toast: ToastComponent,
    ) { }

    ngOnInit() {
    }

    /**
     * 미처리
     */
    nComplete(formData: NgForm) {

        formData.value.incident.id = this.incidentDetail._id;

        this.incidentService.setNComplete(formData).subscribe(
            (res) => {
                //업데이트가 성공하면 진행 상태값 변경
                if (res.success) {
                    //this.incidentDetail.status_cd = this.status_cd;
                    //this.incidentDetail.status_nm = this.status_nm;
                    //this.incidentDetail.nc_content = this.nc_content;
                    this.output.emit(true);
                }
            },
            (error: HttpErrorResponse) => {
                console.log('error : ');
            },
            () => {
                this.cValues('Close click');
            }
        );

    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }
    
}