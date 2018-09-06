import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class QnaService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    /**
     * qnaList 가져오기 
    */
    
    getQnaList(condition): Observable<any> {
        console.log("===========================getqnaList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/qna/list', {params: httpParams});
    }

    /**
     * User qnaList() 가져오기
     */
    getUserQnaList(condition): Observable<any> {
        console.log("===========================getUserQnaList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/qna/userlist', {params: httpParams});
    }


    /**
     * qna 수정
     * @param form 
    */
    putQna(form): Observable<any> {
        console.log("putQna form : " , form);
        return this.http.put<any>('/api/qna/update', form, {withCredentials:true});
    }

    /**
     *qna 삭제
     * @param qnaId
     */
    delete(qnaId): Observable<any>{
        var body = {_id:qnaId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/qna/delete', httpOptions);
    }

    
    
    /**
     * qna 등록
     * @param qna 
     */
    addQna(qna: NgForm): Observable<any> {
        return this.http.post<any>('/api/qna/new', qna, {withCredentials:true});
    }

}
