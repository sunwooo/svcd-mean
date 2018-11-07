import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable()
export class LowerProcessService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 하위업무리스트 가져오기 
    */
    
    getLowerProcessList(condition): Observable<any> {
        //console.log("===========================getLowerProcessList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/lowerProcess/list', {headers: this.headers, params: httpParams});
    }

    /**
     * 하위업무 수정
     * @param form 
    */
    
    putLowerProcess(form): Observable<any> {
        return this.http.put<any>('/api/lowerProcess/update', form, {headers: this.headers, withCredentials:true});
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
        return this.http.post<any>('/api/lowerProcess/new', lowerProcess, {headers: this.headers, withCredentials:true});
    }
    
}
