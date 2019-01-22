import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MyProcessService } from '../../../services/my-process.service';

@Component({
    selector: 'app-my-process',
    templateUrl: './my-process.component.html',
    styleUrls: ['./my-process.component.css']
})
export class MyProcessComponent implements OnInit {

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

    public higher_cd = "*"; //상위업무코드
    public formData: any = {}; //전송용 폼
    private msg_lock = false;

    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private myProcessService: MyProcessService) { 
    }

    ngOnInit() {
        //this.items = this.service.getBooks();
        this.getHigherTree();
        this.isLoading = false;
    }

    /**
     * 업무 선택 변경 시
     * @param process 
     */
    onSelectedChange(process) {

        this.values = process;
        this.formData.higher_cd = this.higher_cd;
        this.formData.myProcess = process;
        this.myProcessService.putMyProcess(this.formData).subscribe(
            (res) => {
                if(this.msg_lock == true){
                    if(res.success){
                        this.toast.open('수정되었습니다.', 'success');
                    }else{
                        this.toast.open(JSON.stringify(res.message), 'danger');
                    }
                }
                this.msg_lock = true;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 상위업무 조건 변경 시
     * @param higher 
     */
    setHigher(higher){
        this.msg_lock = false;
        this.higher_cd = higher.higher_cd;
        this.getHigherTree();
    }

    /**
     * 필터 변경 시 
     * @param value
     */
    onFilterChange(value: string) {
        //console.log('filter:', value);
    }

    /**
     * 나의 업무 조회
     */
    getHigherTree(){
        this.formData.higher_cd = this.higher_cd;
        this.myProcessService.getMyProcessTree(this.formData).subscribe(
            (res) => {
                var tmpArr = [];
                if (res) {
                    res.forEach(higherTree => {
                        var higher = new TreeviewItem({
                            text: higherTree.text,
                            value: higherTree.value,
                            collapsed: true,
                            children: higherTree.lower
                        });
                        tmpArr.push(higher);
                    });
                }
                this.items = tmpArr;
            },
            (error: HttpErrorResponse) => {
            }
        ); 
    }

}

