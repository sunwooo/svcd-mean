import { Component, OnInit, ViewChild } from '@angular/core';
import { StatisticService } from '../../../services/statistic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
  selector: 'app-higher-lower-dept',
  templateUrl: './higher-lower-dept.component.html',
  styleUrls: ['./higher-lower-dept.component.css']
})
export class HigherLowerDeptComponent implements OnInit {

    @ViewChild('myTable') table: any;

    public isLoading = true;
    public sData = null;

    public today = new Date();
    private formData: any = {};                 //전송용 formData
    public user_flag: string = "user";           //사용자 구분
    public dept_cd: string = "*";             //부서코드
    public higher_cd: string = "*";              //상위코드
    public higher_nm = "전체";
    public yyyy: string ="";           //검색년도
    public mm: string = "*";            //검색월


    public deptObj: any = [];                //부서리스트
    public yyyyObj: any = [];           //문의년도 리스트
    public mmObj: { name: string; value: string; }[] = [ //문의월 리스트
        { name: '전체', value: '*' },
        { name: '1', value: '01' },{ name: '2', value: '02' },{ name: '3', value: '03' },{ name: '4', value: '04' },
        { name: '5', value: '05' },{ name: '6', value: '06' },{ name: '7', value: '07' },{ name: '8', value: '08' },
        { name: '9', value: '09' },{ name: '10', value: '10' },{ name: '11', value: '11' },{ name: '12', value: '12' }
    ];

    public mmInit = 0;
    public mmDesc = "전체";


    funder = [];
    calculated = [];
    pending = [];
    groups = [];
  
    editing = {};  
    rows = [];


    tempData = [
        {
            "exppayyes": 1,
            "exppayno": 0,
            "exppaypending": 0,
            "source": "Funder",
            "name": "Ethel Price",
            "gender": "female",
            "company": "Johnson, Johnson and Partners, LLC CMP DDC",
            "age": 22,
            "comment": "test1",
            "groupcomment": "group comment test  with multiple lines of text. group comment test  with multiple lines of text."
        },
        {
            "exppayyes": 0,
            "exppayno": 1,
            "exppaypending": 0,
            "source": "Calculated",
            "name": "Wilder Gonzales",
            "gender": "male",
            "company": "Geekko",
            "age": 22,
            "comment": "test2",
            "groupcomment": "group comment test  with multiple lines of text. group comment test  with multiple lines of text."
        },
        {
            "exppayyes": 0,
            "exppayno": 0,
            "exppaypending": 1,
            "source": "Manual",
            "name": "Georgina Schultz",
            "gender": "female",
            "company": "Suretech",
            "age": 22,
            "comment": "test3",
            "groupcomment": "group comment test  with multiple lines of text. group comment test  with multiple lines of text."
        },
        {
            "exppayyes": 0,
            "exppayno": 0,
            "exppaypending": 0,
            "source": "Manual",
            "name": "Carroll Buchanan",
            "gender": "male",
            "company": "Ecosys",
            "age": 22,
            "comment": "test4",
            "groupcomment": "group comment test  with multiple lines of text. group comment test  with multiple lines of text."
        },    
        {
            "exppayyes": 0,
            "exppayno": 0,
            "exppaypending": 0,
            "source": "Funder",
            "name": "Claudine Neal",
            "startdate": "01/01/2017",
            "enddate": "14/01/2017",
            "gender": "female",
            "company": "Sealoud",
            "age": 55,
            "groupcomment": "group comment test 2",
            "groupstatus" : ""
        },
        {
            "name": "Beryl Rice",
            "gender": "female",
            "company": "Velity",
            "age": 67
        },    
        {
            "exppayyes": 0,
            "exppayno": 0,
            "exppaypending": 0,
            "source": "Calculated",
            "name": "Valarie Atkinson",
            "startdate": "01/01/2017",
            "enddate": "14/01/2017",        
            "gender": "female",
            "company": "Hopeli",
            "age": 55,
            "groupcomment": "group comment test 2",
            "groupstatus" : ""
        },
        {
            "name": "Schroeder Mathews",
            "gender": "male",
            "company": "Polarium",
            "age": 67
        },
        {
            "name": "Lynda Mendoza",
            "gender": "female",
            "company": "Dogspa",
            "age": 10
        },
        {
            "name": "Sarah Massey",
            "gender": "female",
            "company": "Bisba",
            "age": 10
        },
        {
            "name": "Robles Boyle",
            "gender": "male",
            "company": "Comtract",
            "age": 11
        },
        {
            "name": "Evans Hickman",
            "gender": "male",
            "company": "Parleynet"
            ,
            "age": 11
        },
        {
            "name": "Robles Boyle",
            "gender": "male",
            "company": "Comtract",
            "age": 50
        },
        {
            "name": "Evans Hickman",
            "gender": "male",
            "company": "Parleynet"
            ,
            "age": 50
        },
        {
            "name": "Robles Boyle",
            "gender": "male",
            "company": "Comtract",
            "age": 51
        },
        {
            "name": "Evans Hickman",
            "gender": "male",
            "company": "Parleynet"
            ,
            "age": 51
        },    
        {
            "name": "Robles Boyle",
            "gender": "male",
            "company": "Comtract",
            "age": 52,
            "groupcomment": "group comment test  with multiple lines of text. group comment test  with multiple lines of text."        
        },
        {
            "name": "Evans Hickman",
            "gender": "male",
            "company": "Parleynet",
            "age": 52,
            "groupcomment": "group comment test  with multiple lines of text. group comment test  with multiple lines of text."        
        },        
        {
            "name": "Dawson Barber",
            "gender": "male",
            "company": "Dymi",
            "age": 12,
            "groupcomment": "group comment test  with multiple lines of text. group comment test  with multiple lines of text."                
        },
        {
            "name": "Robles Boyle",
            "gender": "male",
            "company": "Comtract",
            "age": 53,
            "groupcomment": "group comment test  with multiple lines of text."
        },
        {
            "name": "Evans Hickman",
            "gender": "male",
            "company": "Parleynet",
            "age": 53,
            "groupcomment": "group comment test  with multiple lines of text."        
        },        
        {
            "name": "Robles Boyle",
            "gender": "male",
            "company": "Comtract",
            "age": 54
        },
        {
            "name": "Evans Hickman",
            "gender": "male",
            "company": "Parleynet"
            ,
            "age": 54
        },        
        {
            "name": "Robles Boyle",
            "gender": "male",
            "company": "Comtract",
            "age": 56
        },
        {
            "name": "Evans Hickman",
            "gender": "male",
            "company": "Parleynet",
            "age": 56
        },        
        {
            "name": "Bruce Strong",
            "gender": "male",
            "company": "Xyqag",
            "age": 12
        },        
        {
            "name": "No Group1",
            "gender": "male",
            "company": "Xyqag",
            "age": null
        },
        {
            "name": "No Group2",
            "gender": "male",
            "company": "Xyqag",
            "age": null
        },
        {
            "name": "No Group3",
            "gender": "male",
            "company": "Xyqag",
            "age": null
        },
        {
            "name": "No Group4",
            "gender": "male",
            "company": "Xyqag",
            "age": null
        }
        
    ];


    constructor(private auth: AuthService,
        private toast: ToastComponent,
        private statisticService: StatisticService,
        private commonApi: CommonApiService,
    ) { 
    }

    ngOnInit() {
        this.isLoading = false;
        this.yyyy = this.today.getFullYear().toString();

        if(this.auth.user_flag == "1"){ //SD 전체관리자
            this.user_flag = "*";
        }else if(this.auth.user_flag == "5"){//고객사 담당자
            this.user_flag = "dept";
        }

        this.getRegisterYyyy();
        this.getDeptList();
        this.getData();

        this.fetch((data) => {
            this.rows = data;
          });

    }

    /**
     * 등록요청 년도 조회
     */
    getRegisterYyyy() {
        this.commonApi.getRegisterYyyy().subscribe(
            (res) => {
                this.yyyyObj = res;
                this.rows = this.tempData;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 부서리스트 조회
     */
    getDeptList() {

        this.setTransForm();

        this.commonApi.getDept(this.formData).subscribe(
            (res) => {
                this.deptObj = res;
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 부서별 상위업무 집계 조회
     */
    getData() {

        this.setTransForm();

        this.statisticService.getHigherLowerDept(this.formData).subscribe(
            (res) => {
                this.sData = res;
                
                console.log("=============== getHigherLowerDept ===============");
                console.log("sData : ", this.sData);
                console.log("sData.length : ", this.sData.length);
                console.log("====================================================");
                
            },
            (error: HttpErrorResponse) => {
            }
        );
    }

    /**
     * 상위업무 선택 시 처리 
     */
    setHigher(higher) {
        this.higher_cd = higher.higher_cd;
        //this.lower_cd = "*";
        //this.child.getLowerCd(this.higher_cd);
        this.getData();
    }


    /**
     * 전송용 폼 세팅
     */
    setTransForm(){
        this.formData.dept_cd = this.dept_cd;
        this.formData.higher_cd = this.higher_cd;
        this.formData.yyyy = this.yyyy;
        this.formData.mm = this.mm;
    }

    /**
     * 년도 선택 시 처리
     */
    setYyyy(yyyy){
        this.yyyy = yyyy;
        this.getData();
    }

    /**
     * 월 선택 시 처리
     */
    setMm(index){
        this.mm = this.mmObj[index].value;
        this.mmDesc = this.mmObj[index].name;
        this.getData();
    }






    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', '/assets/aaa.json');
        //cb(this.tempData);
        req.onload = () => {

            console.log("XXXXXXXXXXXXXXXXXXXXXXX req,response : ", req.response);

            cb(JSON.parse(req.response));
          };
        req.send();
      }


      getGroupRowHeight(group, rowHeight) {
        let style = {};
    
        style = {
          height: (group.length * 40) + 'px',
          width: '100%'
        };
    
        return style;
      }
    
      checkGroup(event, row, rowIndex, group) {
        let groupStatus: string = 'Pending';
        let expectedPaymentDealtWith: boolean = true;
    
        row.exppayyes = 0;
        row.exppayno = 0;
        row.exppaypending = 0;
          
        if (event.target.checked)
          if (event.target.value === '0') { // expected payment yes selected
            row.exppayyes = 1;
          } else if (event.target.value === '1') { // expected payment yes selected
            row.exppayno = 1;
          } else if (event.target.value === '2') { // expected payment yes selected
            row.exppaypending = 1;
          }
    
        if (group.length === 2) { // There are only 2 lines in a group
          // tslint:disable-next-line:max-line-length
          if (['Calculated', 'Funder'].indexOf(group[0].source) > -1 && ['Calculated', 'Funder'].indexOf(group[1].source) > -1) { // Sources are funder and calculated
            // tslint:disable-next-line:max-line-length
            if (group[0].startdate === group[1].startdate && group[0].enddate === group[1].enddate) { // Start dates and end dates match
              for (let index = 0; index < group.length; index++) {
                if (group[index].source !== row.source) {
                  if (event.target.value === '0') { // expected payment yes selected
                    group[index].exppayyes = 0;
                    group[index].exppaypending = 0;
                    group[index].exppayno = 1;
                  }
                }
    
                if (group[index].exppayyes === 0 && group[index].exppayno === 0 && group[index].exppaypending === 0) {
                  expectedPaymentDealtWith = false;
                }
                console.log('expectedPaymentDealtWith', expectedPaymentDealtWith);
              }
            }
          }
        } else {
          for (let index = 0; index < group.length; index++) {
            if (group[index].exppayyes === 0 && group[index].exppayno === 0 && group[index].exppaypending === 0) {
              expectedPaymentDealtWith = false;
            }
            console.log('expectedPaymentDealtWith', expectedPaymentDealtWith);
          }      
        }
    
        // check if there is a pending selected payment or a row that does not have any expected payment selected
        if (group.filter(rowFilter => rowFilter.exppaypending === 1).length === 0 
          && group.filter(rowFilter => rowFilter.exppaypending === 0 
                          && rowFilter.exppayyes === 0 
                          && rowFilter.exppayno === 0).length === 0) {
          console.log('expected payment dealt with');
          
          // check if can set the group status
          const numberOfExpPayYes = group.filter(rowFilter => rowFilter.exppayyes === 1).length;
          const numberOfSourceFunder = group.filter(
              rowFilter => rowFilter.exppayyes === 1 && rowFilter.source === 'Funder').length;
          const numberOfSourceCalculated = group.filter(
              rowFilter => rowFilter.exppayyes === 1 && rowFilter.source === 'Calculated').length;
          const numberOfSourceManual = group.filter(
              rowFilter => rowFilter.exppayyes === 1 && rowFilter.source === 'Manual').length;
    
          console.log('numberOfExpPayYes', numberOfExpPayYes);
          console.log('numberOfSourceFunder', numberOfSourceFunder);
          console.log('numberOfSourceCalculated', numberOfSourceCalculated);
          console.log('numberOfSourceManual', numberOfSourceManual);
    
          if (numberOfExpPayYes > 0){
            if (numberOfExpPayYes === numberOfSourceFunder){
              groupStatus = 'Funder Selected';
            } else if (numberOfExpPayYes === numberOfSourceCalculated){
              groupStatus = 'Calculated Selected';
            } else if (numberOfExpPayYes === numberOfSourceManual) {
              groupStatus = 'Manual Selected';
            } else {
              groupStatus = 'Hybrid Selected';
            }
          }
            
        }
    
        group[0].groupstatus = groupStatus;    
      }
    
      updateValue(event, cell, rowIndex) {
        this.editing[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = event.target.value;
        this.rows = [...this.rows];
      }
    
      toggleExpandGroup(group) {
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
      }  
    
      onDetailToggle(event) {
        console.log('Detail Toggled', event);
      }


}
