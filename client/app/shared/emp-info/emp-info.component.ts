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
    
    public userInfo = null;

    constructor(private auth: AuthService,
        private userService: UserService,
    ) { }

    ngOnInit() {

        if(this.email != ""){
            this.getEmpInfo(this.email);
        }else{
    
        }
    }

    /**
     * email을 이용한 인적정보 조회
     * @param email 
     */
    getEmpInfo(email: string) {
        this.getGroupEmpInfo(email);
    }

    /**
     * 그룹웨어 email 정보 조회
     * @param email 
     */
    getGroupEmpInfo(email: string) {
        this.userService.getGroupEmpInfo(email).subscribe(
            (res) => {
                this.userInfo = res;
            },
            (error: HttpErrorResponse) => {
                console.log('error : ', error);
            },
            () => { //complete 시 처리

                if (!this.userInfo.exist) { //그룹웨서 사용자로 미존재 시 서비스데스크 사용자 조회
                    this.getSvcEmpInfo(email);
                }
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
                this.userInfo = res;
                
            },
            (error: HttpErrorResponse) => {
            }
        );
    }
}

