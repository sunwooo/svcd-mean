import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-lower-cd',
    templateUrl: './lower-cd.component.html',
    styleUrls: ['./lower-cd.component.css']
})
export class LowerCdComponent implements OnInit {

    @Input() higher_cd: string;
    @Input() required: boolean = false;
    @Input() placeholder: string;
    @Output() outLowerCd = new EventEmitter<string>();

    public lowerCd: any;
    public condition: any = {};

    constructor(private commonApi: CommonApiService) { }

    ngOnInit() {
        this.getLowerCd(this.higher_cd);
    }

    /**
     * 선택된 하위코드 전달
     * @param idx 
     */
    onSelect(idx) {
        this.outLowerCd.emit(this.lowerCd[idx]);
    }

    /**
     * 하위코드 조회
     */
    getLowerCd(higher_cd) {
        this.condition.higher_cd = higher_cd;
        this.commonApi.getLower(this.condition).subscribe(
            (res) => {
                this.lowerCd = res;
            },
            (error: HttpErrorResponse) => {
                console.log('error : ', error);
            }
        );
    }
}
