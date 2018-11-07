
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class Dashboard0Service {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient 
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 년도별 월별 업무별  (요청자/접수자) 건수
     * @param condition
     */
    getIncidentCntChart(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart0_1', {headers: this.headers, params: httpParams});
    }

    /**
     * 년도별 월별 업무별 (요청자/접수자) 만족도별 건수
     * @param condition 
     */
    getValuationChart(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart0_2', {headers: this.headers, params: httpParams});
    }

    /**
     * 년도별 월별 업무별 (요청자/접수자) 만족도 평균
     * @param condition 
     */
    getAvgChart(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart0_3', {headers: this.headers, params: httpParams});
    }

}
