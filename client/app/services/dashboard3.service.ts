
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class Dashboard3Service {

    constructor(private http: HttpClient) { }

    /**
     * 년도별 요청자/담당자 수
     * @param condition
     */
    getChart3(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3', {params: httpParams});
    }

    /**
     * 년도별 요청자 상위5
     * @param condition 
     */
    getChart3_1(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_1', {params: httpParams});
    }

    /**
     * 년도별 접수자 상위5
     * @param condition 
     */
    getChart3_2(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_2', {params: httpParams});
    }

    /**
     * 년도별 만족도 상위5
     * @param condition 
     */
    getChart3_3(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_3', {params: httpParams});
    }

    /**
     * 년도별 요청자 하위5
     * @param condition 
     */
    getChart3_4(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_4', {params: httpParams});
    }

    /**
     * 업무별 요청자/담당자 수
     */
    getChart3_5(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/dashboard/chart3_5', {params: httpParams});
    }

}
