import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LowerCdComponent } from '../../../shared/lower-cd/lower-cd.component';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-incident-receipt',
  templateUrl: './incident-receipt.component.html',
  styleUrls: ['./incident-receipt.component.css']
})
export class IncidentReceiptComponent implements OnInit {

    @Input() incidentDetail: any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() output = new EventEmitter<boolean>(); //부모에게 이벤트 전달용

    private status_cd: string = "2"; //진행상태 접수대기
    private status_nm: string = "처리중"; //진행상태명 접수대기
    private lower: any = {}; //하위업무

    public receipt_content: string = "문의하신 내용이 접수되었습니다.";

    public today = new Date();
    public minDate = new Date(2015, 0, 1);
    public maxDate = new Date(2030, 0, 1);
    public events: string[] = [];
    public complete_reserve_date;

    public init_hh: string = "18"; //시
    public hhObj: { name: string; value: string; }[] = [
        { name: '00', value: '00' },{ name: '01', value: '01' },{ name: '02', value: '02' },{ name: '03', value: '03' },{ name: '04', value: '04' },
        { name: '05', value: '05' },{ name: '06', value: '06' },{ name: '07', value: '07' },{ name: '08', value: '08' },{ name: '09', value: '09' },
        { name: '10', value: '10' },{ name: '11', value: '11' },{ name: '12', value: '12' },{ name: '13', value: '13' },{ name: '14', value: '14' },
        { name: '15', value: '15' },{ name: '16', value: '16' },{ name: '17', value: '17' },{ name: '18', value: '18' },{ name: '19', value: '19' },
        { name: '20', value: '20' },{ name: '21', value: '21' },{ name: '22', value: '22' },{ name: '23', value: '23' },{ name: '24', value: '24' }
    ];

    public init_mi: string = "00"; //분
    public miObj: { name: string; value: string; }[] = [
        { name: '00', value: '00' },
        { name: '10', value: '10' },
        { name: '20', value: '20' },
        { name: '30', value: '30' },
        { name: '40', value: '40' },
        { name: '50', value: '50' }
    ];        

    public bLevel: string = "A"; //난이도
    public bLevelObj: { name: string; value: string; }[] = [
        { name: 'A', value: 'A' },
        { name: 'B', value: 'B' },
        { name: 'C', value: 'C' },
        { name: 'D', value: 'D' },
        { name: 'E', value: 'E' }];

    constructor(private incidentService: IncidentService,
        public toast: ToastComponent,
    ) { }

    ngOnInit() {

        //this.today.setDate(this.today.getDate() + 3);
        this.today.setDate(this.today.getDate());
        this.complete_reserve_date = new FormControl(this.today);

    }

    /**
     * 접수
     */
    receipt(formData: NgForm) {

        if(!this.lower.lower_cd){
            this.toast.open('하위업무를 선택하세요. ', 'danger');
            return;
        }

        formData.value.incident.id = this.incidentDetail._id;
        formData.value.incident.lower_cd = this.lower.lower_cd;
        formData.value.incident.lower_nm = this.lower.lower_nm;

        this.incidentService.setReceipt(formData).subscribe(
            (res) => {
                //업데이트가 성공하면 진행 상태값 변경
                if (res.success) {
                    this.incidentDetail.lower_cd = this.lower.lower_cd;
                    this.incidentDetail.lower_nm = this.lower.lower_nm;
                    this.incidentDetail.status_cd = this.status_cd;
                    this.incidentDetail.status_nm = this.status_nm;
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
     * 하위업무 선택 시 처리
     */
    setLower(lower) {
        this.lower = lower;
    }

    /**
     * Datepicker 이벤트 발생 시
     * @param type
     * @param event 
     */
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        //this.events.push(`${type}: ${event.value}`);
        console.log("========== addEvent ============");
        console.log("type : ", type, "event : ", event.value);
        console.log("================================");
    }

    /**
     * 모달 닫기
    */
    closeModal($event) {
        this.cValues('Close click');
    }
    
}