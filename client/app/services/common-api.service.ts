
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class CommonApiService {

    constructor(private http: HttpClient) { }

    /**
     * 상위업무 JSON 조회
     * @param condition 조건
     */
    getHigher(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/higherProcess', {params: httpParams});
    }

    /**
     * 하위업무 JSON 조회
     * @param condition 조건
     */
    getLower(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/lowerProcess', {params: httpParams});
    }

    /**
     * 본인업무 JSON 조회
     * @param condition 조건
     */
    myProcess(): Observable<any> {
        var httpParams = new HttpParams({ fromObject: {}});
        return this.http.get<any>('/api/myProcess', {params: httpParams});
    }

    /**
     * 등록요청 년도 조회
     */
    getRegisterYyyy(): Observable<any> {
        var httpParams = new HttpParams({ fromObject: {}});
        return this.http.get<any>('/api/registerYyyy', {params: httpParams});
    }

    /**
     * 회사리스트 JSON 조회
     * @param condition 조건
     */
    getCompany(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/company', {params: httpParams});
    }

    /**
     * 진행상태 JSON 조회
     * @param condition 조건
     */
    getProcessStatus(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/processStatus', {params: httpParams});
    }

    /**
     * 진행상태 JSON 조회
     * @param condition 조건
     */
    getProcessGubun(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/processGubun', {params: httpParams});
    }
}
