import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LowerCdComponent } from '../../../shared/lower-cd/lower-cd.component';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { MatDatepickerInputEvent } from '@angular/material';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-incident-hold',
  templateUrl: './incident-hold.component.html',
  styleUrls: ['./incident-hold.component.css']
})
export class IncidentHoldComponent implements OnInit {

    @Input() incidentDetail: any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() output = new EventEmitter<boolean>(); //부모에게 이벤트 전달용

    private status_cd: string = "5"; //진행상태 협의필요
    private status_nm: string = "협의필요"; //진행상태명 협의필요

    constructor(private auth: AuthService,
        private incidentService: IncidentService,
        public toast: ToastComponent,
    ) { }

    ngOnInit() {
    }

    /**
     * 협의필요
     */
    hold(formData: NgForm) {

        formData.value.incident.id = this.incidentDetail._id;

        this.incidentService.setHold(formData).subscribe(
            (res) => {
                //업데이트가 성공하면 진행 상태값 변경
                if (res.success) {
                    //this.incidentDetail.status_cd = this.status_cd;
                    //this.incidentDetail.status_nm = this.status_nm;
                    //this.incidentDetail.hold_content = this.hold_content;
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