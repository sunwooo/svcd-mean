
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class Dashboard0Service {

    constructor(private http: HttpClient) { }

    /**
     * 년도별 월별 업무별  (요청자/접수자) 건수
     * @param condition
     */
    getIncidentCntChart(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart0_1', {params: httpParams});
    }

    /**
     * 년도별 월별 업무별 (요청자/접수자) 만족도별 건수
     * @param condition 
     */
    getValuationChart(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart0_2', {params: httpParams});
    }

    /**
     * 년도별 월별 업무별 (요청자/접수자) 만족도 평균
     * @param condition 
     */
    getAvgChart(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart0_3', {params: httpParams});
    }

}
