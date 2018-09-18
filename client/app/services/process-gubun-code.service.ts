import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ProcessGubunCodeService {

    constructor(private http: HttpClient,
        private cookieService: CookieService
    ) { }

    /**
     * 처리구분코드리스트 가져오기 
    */
    
    getProcessGubunCodeList(condition): Observable<any> {
        //console.log("===========================getProcessGubunCodeList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/processGubun/list', {params: httpParams});
    }

    /**
     * 처리구분코드 수정
     * @param form 
    */
    putProcessGubunCode(form): Observable<any> {
        return this.http.put<any>('/api/processGubun/update', form, {withCredentials:true});
    }

    /**
     * 삭제하기
     * @param processGubunCodeId
     */
    delete(processGubunCodeId): Observable<any>{
        var body = {_id:processGubunCodeId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/processGubun/delete', httpOptions);
    }

    /**
     * 처리구분코드 등록
     * @param processGubunCode 
     */
    addProcessGubunCode(processGubunCode: NgForm): Observable<any> {
        return this.http.post<any>('/api/processGubun/new', processGubunCode, {withCredentials:true});
    }
}
