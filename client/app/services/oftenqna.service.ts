import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class OftenqnaService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    /**
     * OftenqnaList 가져오기 
    */
    
    getOftenqnaList(condition): Observable<any> {
        console.log("===========================getOftenqnaList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/oftenqna/list', {params: httpParams});
    }

    /**
     * oftenqna 수정
     * @param form 
    */
    putOftenqna(form: NgForm): Observable<any> {
        console.log("putOftenqna form : " , form);
        return this.http.put<any>('/api/oftenqna/update', form, {withCredentials:true});
    }

    /**
     *oftenqna 삭제
     * @param oftenQnaId
     */
    delete(oftenQnaId): Observable<any>{
        var body = {id:oftenQnaId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/oftenqna/delete', httpOptions);
    }


}
