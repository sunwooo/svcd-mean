import { Component, OnInit, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { IncidentService } from '../../../services/incident.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmpInfoComponent } from '../../../shared/emp-info/emp-info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-incident-list-modal',
    templateUrl: './incident-list-modal.component.html',
    styleUrls: ['./incident-list-modal.component.css']
})
export class IncidentListModalComponent implements OnInit {

    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    @Input() selectedItem: any; //조회용 아이템
    @Input() searchYyyy;
    @Input() searchMm;
    @Input() searhHigherCd;
    @Input() searchCompany;

    constructor(private auth: AuthService,
        private modalService: NgbModal,
        private router: Router) { }

    ngOnInit() {
        /*
        console.log("====================================");
        console.log("selectedItem : ",this.selectedItem);
        console.log("searchYyyy : ",this.searchYyyy);
        console.log("searchMm : ",this.searchMm);
        console.log("searhHigherCd : ",this.searhHigherCd);
        console.log("searchCompany : ",this.searchCompany);
        console.log("====================================");
        */
    }

    /**
     * 모달 닫기
    */
    closeModal($event){
        this.cValues('Close click');
    }
}
