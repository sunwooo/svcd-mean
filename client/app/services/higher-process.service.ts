import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class HigherProcessService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 상위업무리스트 가져오기 
    */
    
    getHigherProcessList(condition): Observable<any> {
        //console.log("===========================getHigherProcessList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/higherProcess/list', {headers: this.headers, params: httpParams});
    }

    /**
     * 상위업무 수정
     * @param form 
    */
    putHigherProcess(form): Observable<any> {
        return this.http.put<any>('/api/higherProcess/update', form, {headers: this.headers, withCredentials:true});
    }

    /**
     * 삭제하기
     * @param higherProcessId
     */
    delete(higherProcessId): Observable<any>{
        var body = {_id:higherProcessId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/higherProcess/delete', httpOptions);
    }

    /**
     * 상위업무 등록
     * @param higherProcess 
     */
    addHigherProcess(higherProcess: NgForm): Observable<any> {
        return this.http.post<any>('/api/higherProcess/new', higherProcess, {headers: this.headers, withCredentials:true});
    }
}
