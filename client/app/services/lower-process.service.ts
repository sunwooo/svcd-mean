import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LowerProcessService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    /**
     * 하위업무리스트 가져오기 
    */
    
    getLowerProcessList(condition): Observable<any> {
        console.log("===========================getLowerProcessList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/lowerProcess/list', {params: httpParams});
    }

    /**
     * 하위업무 수정
     * @param form 
    */
    
    putLowerProcess(form): Observable<any> {
        return this.http.put<any>('/api/lowerProcess/update', form, {withCredentials:true});
    }
    

    /**
     * 삭제하기
     * @param lowerProcessId
     */
    
    delete(lowerProcessId): Observable<any>{
        var body = {_id:lowerProcessId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/lowerProcess/delete', httpOptions);
    }
    

    /**
     * 상위업무 등록
     * @param higherProcess 
     */
    
    addLowerProcess(lowerProcess: NgForm): Observable<any> {
        return this.http.post<any>('/api/lowerProcess/new', lowerProcess, {withCredentials:true});
    }
    
}
