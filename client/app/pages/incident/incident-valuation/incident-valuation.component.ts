import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-incident-valuation',
    templateUrl: './incident-valuation.component.html',
    styleUrls: ['./incident-valuation.component.scss']
})
export class IncidentValuationComponent implements OnInit {

    @Input() incident_id_valuation:any;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Output() outputStatusCd = new EventEmitter<string>(); //부모에게 이벤트 전달용

    private status_cd : string = "4"; //진행상태 처리완료

    constructor(private incidentService: IncidentService

    ) { }

    ngOnInit() {
    }

    putValuation(formData: NgForm) {

        //console.log("===============================");
        //console.log(formData.value);
        //console.log("===============================");
        
        formData.value.incident.id = this.incident_id_valuation;
        
        this.incidentService.putValuation(formData).subscribe(
            (res) => {
                //업데이트가 성공하면 진행 상태값 변경
                if(res.success){
                    this.outputStatusCd.emit(this.status_cd);
                }
            },
            (error: HttpErrorResponse) => {
                console.log('error : ');
            },
            () =>{
                this.cValues('Close click');
            }
        );

    }
}
