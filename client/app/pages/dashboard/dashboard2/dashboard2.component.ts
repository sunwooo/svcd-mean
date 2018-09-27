import { Component, OnInit } from '@angular/core';
import { Dashboard2Service } from '../../../services/dashboard2.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Input, Output } from "@angular/core";

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {
  @Input() searchYyyy;
  @Input() searchMm;
  @Input() searhHigherCd;
  @Input() searchCompany;

  private formData: any = {}; //전송용 formData

  public bubble = [];
  /** being chart setting */
  public view: any[] = [700, 300];

  public colorScheme = {
    //domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5', '#ffbb00', '#99e000']
    domain: ['#01579b', '#7aa3e5', '#00bfa5', '#e1d248', '#b1b1b1', '#a8385d']
  };

  constructor(private dashboard2Service: Dashboard2Service
    , private router: Router) { }

  ngOnInit() {

    this.getMaxHigherCnt();

    //single[]
    this.bubble = [
  {
    "name": "Germany",
    "series": [
      {
        "name": "2010",
        "x": "2009-12-31T15:00:00.000Z",
        "y": 80.3,
        "r": 80.4
      },
      {
        "name": "2000",
        "x": "1999-12-31T15:00:00.000Z",
        "y": 80.3,
        "r": 78
      },
      {
        "name": "1990",
        "x": "1989-12-31T15:00:00.000Z",
        "y": 75.4,
        "r": 79
      }
    ]
  },
  {
    "name": "United States",
    "series": [
      {
        "name": "2010",
        "x": "2009-12-31T15:00:00.000Z",
        "y": 78.8,
        "r": 310
      },
      {
        "name": "2000",
        "x": "1999-12-31T15:00:00.000Z",
        "y": 76.9,
        "r": 283
      },
      {
        "name": "1990",
        "x": "1989-12-31T15:00:00.000Z",
        "y": 75.4,
        "r": 253
      }
    ]
  },
  {
    "name": "France",
    "series": [
      {
        "name": "2010",
        "x": "2009-12-31T15:00:00.000Z",
        "y": 81.4,
        "r": 63
      },
      {
        "name": "2000",
        "x": "1999-12-31T15:00:00.000Z",
        "y": 79.1,
        "r": 59.4
      },
      {
        "name": "1990",
        "x": "1989-12-31T15:00:00.000Z",
        "y": 77.2,
        "r": 56.9
      }
    ]
  },
  {
    "name": "United Kingdom",
    "series": [
      {
        "name": "2010",
        "x": "2009-12-31T15:00:00.000Z",
        "y": 80.2,
        "r": 62.7
      },
      {
        "name": "2000",
        "x": "1999-12-31T15:00:00.000Z",
        "y": 77.8,
        "r": 58.9
      },
      {
        "name": "1990",
        "x": "1989-12-31T15:00:00.000Z",
        "y": 75.7,
        "r": 57.1
      }
    ]
  }
];

  }

  /**
   * 상위업무(1순위 요청) 조회
  **/

  getMaxHigherCnt() {
    console.log("getMaxHigherCnt function call!!!");
    /*
    this.formData.yyyy = this.searchYyyy;
    this.formData.mm = this.searchMm;
    this.formData.higher_cd = this.searhHigherCd;
    this.formData.company_cd = this.searchCompany;
    */
    //this.formData.yyyy = "2018";
    //this.formData.mm = "*";
    this.formData.higher_cd = "*";
    this.formData.company_cd = "*";
    //this.dashboard2Service.getMaxHigherCnt({ scope: "*" }).subscribe(
    this.dashboard2Service.getChart2(this.formData).subscribe(

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
