import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LowerCdComponent } from '../../../shared/lower-cd/lower-cd.component';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
    selector: 'app-incident-higher-change',
    templateUrl: './incident-higher-change.component.html',
    styleUrls: ['./incident-higher-change.component.css']
})
export class IncidentHigherChangeComponent implements OnInit {

    @ViewChild(LowerCdComponent) child: LowerCdComponent;

    @Input() incidentDetail: any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() output = new EventEmitter<boolean>(); //부모에게 이벤트 전달용

    private status_cd: string = "1"; //진행상태 접수대기
    private status_nm: string = "접수대기"; //진행상태명 접수대기
    private higher: any = {}; //상위업무
    private lower: any = {}; //하위업무

    constructor(private incidentService: IncidentService,
        public toast: ToastComponent,
    ) { }

    ngOnInit() {
    }

    /**
     * 상위업무 변경
     */
    changeHigher(formData: NgForm) {

        if(!this.higher.higher_cd){
            this.toast.open('상위업무를 선택하세요. ', 'danger');
            return;
        }

        //if(!this.lower.lower_cd){
        //    this.toast.open('하위업무를 선택하세요. ', 'danger');
        //    return;
        //}

        formData.value.incident.id = this.incidentDetail._id;
        formData.value.incident.higher_cd = this.higher.higher_cd;
        formData.value.incident.higher_nm = this.higher.higher_nm;
        formData.value.incident.lower_cd = this.lower.lower_cd;
        formData.value.incident.lower_nm = this.lower.lower_nm;

        this.incidentService.setChangeHigher(formData).subscribe(
            (res) => {
                //업데이트가 성공하면 진행 상태값 변경
                if (res.success) {
                    //this.incidentDetail.higher_cd = this.higher.higher_cd;
                    //this.incidentDetail.higher_nm = this.higher.higher_nm;
                    //this.incidentDetail.lower_cd = this.lower.lower_cd;
                    //this.incidentDetail.lower_nm = this.lower.lower_nm;
                    //this.incidentDetail.status_cd = this.status_cd;
                    //this.incidentDetail.status_nm = this.status_nm;
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
     * 상위업무 선택 시 처리 
     */
    setHigher(higher) {
        this.higher = higher;
        this.child.getLowerCd(this.higher.higher_cd);
    }

    /**
     * 하위업무 선택 시 처리
     */
    setLower(lower) {
        this.lower = lower;
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }
    
}
