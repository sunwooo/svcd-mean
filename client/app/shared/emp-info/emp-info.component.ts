import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-emp-info',
    templateUrl: './emp-info.component.html',
    styleUrls: ['./emp-info.component.scss']
})
export class EmpInfoComponent {

    @Input() email : string;
    @Input() cValues;  //모달창 닫기용
    @Input() dValues;  //모달창 무시용
    
    public isLoading = true;
    public userInfo = null;

    constructor(private auth: AuthService,
        private userService: UserService,
    ) { }

    ngOnInit() {
        if(this.email != ""){
            this.getEmpInfo(this.email);
        }
        this.isLoading = false;
    }

    /**
     * email을 이용한 인적정보 조회
     * @param email 
     */
    getEmpInfo(email: string) {
        this.getSvcEmpInfo(email);
    }

    /**
     * 그룹웨어 email 정보 조회
     * @param email 
     */
    getGroupEmpInfo(email: string) {
        this.userService.getGroupEmpInfo(email).subscribe(
            (res) => {
                console.log("gw ",res);
                if(res.exist){
                    this.userInfo = res;
                }
            },
            (error: HttpErrorResponse) => {
                console.log('error : ', error);
            },
            ()=>{
                this.isLoading = false;
            }
        );
    }

    /**
     * 서비스데스크 email 정보 조회
     * @param email 
     */
    getSvcEmpInfo(email: string) {
        this.userService.getEmpInfo(email).subscribe(
            (res) => {
                if(res.length > 0){
                    this.userInfo = res[0];
                    this.isLoading = false;
                }
            },
            (error: HttpErrorResponse) => {
            },
            () => { //complete 시 처리
                if (this.userInfo == null || this.userInfo.group_flag == "in") { //그룹웨서 사용자로 미존재 시 서비스데스크 사용자 조회
                    this.getGroupEmpInfo(email);
                }
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

