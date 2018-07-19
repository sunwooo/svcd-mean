import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-higher-cd',
    templateUrl: './higher-cd.component.html',
    styleUrls: ['./higher-cd.component.scss']
})
export class HigherCdComponent implements OnInit {

    @Input() condition: string;
    @Input() required: boolean = false;
    @Input() placeholder: string;
    @Output() outHigherCd = new EventEmitter<string>();

    public higherCd: any;

    constructor(private commonApi: CommonApiService) { }

    ngOnInit() {

        this.commonApi.getHigherCd(this.condition).subscribe(
            (res) => {
                //console.log('============= higher-cd.commonApi.getHigherCd(this.condition).subscribe ===============');
                //console.log(res);
                //console.log('===================================================================================');
                this.higherCd = res;
            },
            (error: HttpErrorResponse) => {
                console.log('error : ',error);
            }
        );
    }

    onSelect(higherCd:string){
        this.outHigherCd.emit(higherCd);
    }
}
