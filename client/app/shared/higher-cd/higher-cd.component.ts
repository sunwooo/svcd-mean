import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-higher-cd',
    templateUrl: './higher-cd.component.html',
    styleUrls: ['./higher-cd.component.scss']
})
export class HigherCdComponent implements OnInit {

    @Input() scope: string; //상위업무 전체 조회면 '*',
    @Input() initHigherCd: string = "*"; //초기 상세업무
    @Input() required: boolean = false;
    @Input() placeholder: string;
    @Input() company: string;
    @Input() type: string;
    @Output() outHigherCd = new EventEmitter<string>();

    public higherCd: any = {};
    public condition: any = {};
    public selecedIdx;

    constructor(private commonApi: CommonApiService) { }

    ngOnInit() {       
        //console.log("xxxxxxxxxxx this.initHigherCd ",this.initHigherCd);
        this.getHigherCd(this.company);
    }

    /**
     * 선택된 상위코드 전달
     * @param idx 
     */
    onSelect(idx){   
        if(idx != '-1'){
            if(idx == '0'){
                var higherCd: any = {'higher_cd':'*','higher_nm':'전체'};
                this.outHigherCd.emit(higherCd);
            }else{
                this.outHigherCd.emit(this.higherCd[idx]);
            }
        }        
    }

    /**
     * 상위코드 조회
     */
    getHigherCd(company_cd){
        this.condition.scope = this.scope;
        this.condition.company_cd = company_cd;

        this.commonApi.getHigher(this.condition).subscribe(
            (res) => {
                console.log('============= higher-cd.commonApi.getHigherCd(this.condition).subscribe ===============');
                console.log(res);
                console.log('===================================================================================');
                this.higherCd = res;
                if(this.type == "search") this.initHigherCd = "*";
            },
            (error: HttpErrorResponse) => {
                console.log('error : ',error);
            }
        );
    }
}
