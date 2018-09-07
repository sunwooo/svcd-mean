import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CompanyProcessService } from '../../../services/company-process.service';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
    selector: 'app-company-process',
    templateUrl: './company-process.component.html',
    styleUrls: ['./company-process.component.css']
})
export class CompanyProcessComponent implements OnInit {

    public isLoading = true;

    public dropdownEnabled = true;
    public items: TreeviewItem[];
    public values: number[];
    public config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    });

    public companyObj: any = [];                //회사리스트
    public company_cd: string = "*";            //회사코드
    public formData: any = {}; //전송용 폼
    private msg_lock = false;

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private commonApi: CommonApiService,
        private companyProcessService: CompanyProcessService) { 
    }

    ngOnInit() {
        //this.items = this.service.getBooks();
        this.getCompanyList();
        this.isLoading = false;
    }

    /**
     * 업무 선택 변경 시
     * @param process 
     */
    onSelectedChange(process) {

        this.values = process;
        this.formData.company_cd = this.company_cd;
        this.formData.companyProcess = process;
        this.companyProcessService.putCompanyProcess(this.formData).subscribe(
            (res) => {
                if(this.msg_lock == true){
                    if(res.success){
                        this.toast.open('수정되었습니다.', 'success');
                    }else{
                        this.toast.open(res.message, 'danger');
                    }
                }
                this.msg_lock = true;
            },
            (error: HttpErrorResponse) => {
            }
        );

    }

    /**
     * 회사 조건 변경 시
     * @param company_cd 
     */
    setCompany(company_cd){
        this.msg_lock = false;
        this.company_cd = company_cd;
        this.getCompanyProcessTree();
    }

    /**
     * 필터 변경 시 
     * @param value
     */
    onFilterChange(value: string) {
        //console.log('filter:', value);
    }

    /**
     * 회사 업무 조회
     */
    getCompanyProcessTree() {
        this.formData.company_cd = this.company_cd;
        this.companyProcessService.getCompanyProcessTree(this.formData).subscribe(
            (res) => {
                if (res) {
                    var tmpArr = [];
                    var higher = new TreeviewItem({
                        text: '업무지정',
                        value: '*',
                        collapsed: false,
                        children: res
                    });
                    tmpArr.push(higher);
                    this.items = tmpArr;
                }
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 회사리스트 조회
     */
    getCompanyList() {
        this.formData.company_cd = this.company_cd;
        this.commonApi.getCompany(this.formData).subscribe(
            (res) => {
                this.companyObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

}

