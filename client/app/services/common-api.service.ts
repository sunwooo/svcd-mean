
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class CommonApiService {

    constructor(private http: HttpClient) { }

    /**
     * 상위업무 JSON 조회
     * @param condition 조건
     */
    getHigherCd(condition): Observable<any> {
        return this.http.get<any>('/api/higherProcess', condition);
    }

    /**
     * 진행상태 JSON 조회
     * @param condition 조건
     */
    getProcessStatus(condition): Observable<any> {
        return this.http.get<any>('/api/processStatus', condition);
    }
}
