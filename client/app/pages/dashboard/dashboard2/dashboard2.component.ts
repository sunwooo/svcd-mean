import { Component, OnInit } from '@angular/core';
import { Dashboard2Service } from '../../../services/dashboard2.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {
  public single = [];
  /** being chart setting */
  public view: any[] = [700, 300];

  public colorScheme = {
        //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
        domain: ['#01579b', '#7aa3e5', '#00bfa5', '#e1d248', '#b1b1b1' ,'#a8385d']
    };

  constructor(private dashboard2Service: Dashboard2Service
              ,private router: Router) { }

  ngOnInit() {

    this.getMaxHigherCnt();

    //single[]
    this.single = [
      {
        name: 'Germany',
        value: 40632
      },
      {
        name: 'United States',
        value: 49737
      },
      {
        name: 'France',
        value: 36745
      },
      {
        name: 'United Kingdom',
        value: 36240
      },
      {
        name: 'Spain',
        value: 33000
      },
      {
        name: 'Italy',
        value: 35800
      }
    ];

  }

  /**
   * 상위업무(1순위 요청) 조회
  **/

    getMaxHigherCnt() {
       console.log("getMaxHigherCnt function call!!!");
      //this.dashboard2Service.getMaxHigherCnt({ scope: "*" }).subscribe(
        this.dashboard2Service.getChart2({ company_cd : "*" }).subscribe(
         
          (res) => {
              
              //console.log("getCompany res ====>" , JSON.stringify(res));
              //console.log("getCompany res ====>" , JSON.stringify(res));
              /*
              this.companyObj = res;
              for (var i = 0; i < this.companyObj.length; i++) {

                  var text = { id: "" + this.companyObj[i].company_cd + "", itemName: "" + this.companyObj[i].company_nm + "" };
                  //console.log("text :" + text);
                  // {id:"7",itemName:"France"},

                  this.dropdownList.push(text);
              }
                */
          },
          (error: HttpErrorResponse) => {
          }
      );
    }

}
