import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonApiService } from '../../../services/common-api.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-user-my-info',
    templateUrl: './user-my-info.component.html',
    styleUrls: ['./user-my-info.component.css']
})
export class UserMyInfoComponent implements OnInit {

    @Input() myPageDetail: any; //조회 user
    @Output() openerReload = new EventEmitter<any>(); //삭제 후 다시 조회를 위한 이벤트

    public companyObj: any = [];                //회사리스트 Object
    public selectedComIdx = 0;                  //회사리스트 Object내 회사  index
    private formData: any = {};                 //전송용 formData
    public userCompany_nm: string;
    public company_cd: string;
    public company_nm: string;
    public email: string;
    public sabun: string;
    public password: string;
    public employee_nm: string;
    public dept_nm: string;
    public position_nm: string;
    public jikchk_nm: string;
    public hp_telno: string;
    public office_tel_no: string;
    public id: string;

    public user_flag = '9';
    public group_flag = 'out';

    public userFlagObj: { name: string; value: string; }[] = [
        { name: '그룹관리자', value: '1' },
        { name: '업무관리자(팀장)', value: '3' },
        { name: '업무담당자', value: '4' },
        { name: '고객사관리자', value: '5' },
        { name: '일반사용자', value: '9' }
    ];
    public groupFlagObj: { name: string; value: string; }[] = [
        { name: '외부고객사', value: 'out' },
        { name: '그룹사', value: 'in' }
    ];
    public emailSendYnObj: { name: string; value: string; }[] = [
        { name: '사용', value: 'Y' },
        { name: '미사용', value: 'N' }
    ];
    public accessYnObj: { name: string; value: string; }[] = [
        { name: '승인', value: 'Y' },
        { name: '미승인', value: 'N' }
    ];
    public usingYnObj: { name: string; value: string; }[] = [
        { name: '사용', value: 'Y' },
        { name: '미사용', value: 'N' }
    ];

    constructor(private auth: AuthService
        , private userService: UserService
        , private commonApi: CommonApiService
        , private toast: ToastComponent
        , private router: Router) { }

    ngOnInit() {

        this.user_flag = this.auth.user_flag;
        this.group_flag = this.auth.group_flag;        

        this.getMyPage();
        this.getCompanyList();
    }

    /**
     * 회사리스트 조회
     */
    getCompanyList() {
        this.commonApi.getCompany(this.myPageDetail).subscribe(
            (res) => {
                //console.log("getCompanyList res : ", res);
                this.companyObj = res;

                //idx를 찾아서 조회시 초기값 세팅
                var tmpIdx = 0;
                this.companyObj.forEach(element => {
                    if (element.company_cd == this.company_cd) {
                        this.selectedComIdx = tmpIdx;
                    }
                    tmpIdx++;
                });
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 회사리스트 선택후 company_cd, compant_nm 세팅
     */
    setCompany(idx) {
        this.company_cd = this.companyObj[idx].company_cd;
        this.company_nm = this.companyObj[idx].company_nm;
    }

    /**
    * 마이페이지 조회
    */
    getMyPage() {
        //console.log("getMyPage start!!!");

        this.userService.myPageList(this.formData).subscribe(
            (res) => {
                //console.log("res >>> ", res);
                //console.log("res.email >>> ", res.email);
                
                this.userCompany_nm = res.userCompany_nm;
                this.company_cd = res.company_cd;
                this.company_nm = res.company_nm;
                this.email = res.email;
                this.sabun = res.sabun;
                this.password = res.password;
                this.employee_nm = res.employee_nm;
                this.dept_nm = res.dept_nm;
                this.position_nm = res.position_nm;
                this.jikchk_nm = res.jikchk_nm;
                this.hp_telno = res.hp_telno;
                this.office_tel_no = res.office_tel_no;
                this.id = res._id;

                //this.userObj = res.user;
            },
            (error: HttpErrorResponse) => {
                console.log("getMyPage error : ", error);
            },
        );
    }


    /**
     * 사원정보 수정
     * @param form 
     */
    myPageUpdate(form: NgForm) {
        //console.log("this.id > ", this.id);

        form.value.user.id = this.id;

        //console.log('======= save(form : NgForm) =======');
        //console.log("form.value > ", form.value);
        //console.log("form > ", form);
        //console.log("myPageDetail > ", this.myPageDetail);
        //console.log('===================================');

        this.userService.putMyPage(form.value).subscribe(
            (res) => {
                if (res.success) {
                    this.toast.open('수정되었습니다.', 'success');
                    this.openerReload.emit();

                    this.goList();
                }
            },
            (error: HttpErrorResponse) => {
                this.toast.open('오류입니다. ' + error.message, 'danger');
            }
        );
    }

    goList() {
        if(this.user_flag == '9'){
            this.router.navigate(['/svcd/0001U']); //일반사용자
        }else if(this.user_flag == '5'){
            this.router.navigate(['/svcd/0001C']); //회사별담당자
        }else{
            this.router.navigate(['/svcd/0001']);  
        }
    }

}
