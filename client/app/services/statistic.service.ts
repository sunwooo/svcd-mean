import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class StatisticService {

    public statusCntData;
    public statusChart1 = [{"name":"접수대기", "value":0},{"name":"처리중", "value":0}];
    public statusChart2 = [{"name":"미평가", "value":0},{"name":"평가완료", "value":0}];

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { 
        

        //상태별 건수
        this.getStatusCdCnt().subscribe(
            (res) => {  
                this.statusCntData = res;
            },
            (error: HttpErrorResponse) => {
            },() => {
                this.statusCntData.forEach((val, idx) => {
                    if(val._id.status_cd == "1"){
                        this.statusChart1[0].value = val.count;
                    }
                    if(val._id.status_cd == "2"){
                        this.statusChart1[1].value = val.count;
                    }
                    if(val._id.status_cd == "3"){
                        this.statusChart2[0].value = val.count;
                    }
                    if(val._id.status_cd == "4"){
                        this.statusChart2[1].value = val.count;
                    }
                });
            }
        );
        
        //월별 건수
        /*        this.monthlyCnt().subscribe(
            (res) => {  
                this.statusCntData = res;
            },
            (error: HttpErrorResponse) => {
            },() => {
                
            }
        );
        */

    }

    /**
     * 
     * @param  
     */
    getComHigher(): Observable<any> {

        //console.log("========addIncident(incident: NgForm): Observable<any>========");
        //console.log("incident : ", incident);
        //console.log("==============================================================");
        
        //var params = new HttpParams().set("yyyy","2018").set("company_cd","ISU_ST").set("mm","*").set("higher_cd","*");
        return this.http.get<any>('/api/statistic/comHigher?yyyy=2018&company_cd=ISU_ST&mm=*&higher_cd=*');
    }

    /**
     * 상태별 건수
     */
    getStatusCdCnt(): Observable<any>{
        return this.http.get<any>('/api/statistic/statusCdCnt');
    }

    /**
     * 만족도 현황
     */
    valuationCnt(): Observable<any>{
        return this.http.get<any>('/api/statistic/valuationCnt');
    }

    /**
     * 월별 건수
     */
    monthlyCnt(): Observable<any>{
        return this.http.get<any>('/api/statistic/monthlyCnt');
    }
    
    /**
     * 신청건수 상위 업무
     */
    higherCnt(): Observable<any>{
        return this.http.get<any>('/api/statistic/higherCnt');
    }

    
}
