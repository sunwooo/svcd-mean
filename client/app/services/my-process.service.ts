import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MyProcessService {

    public headers:any;
    constructor(private auth: AuthService
              , private http: HttpClient  
    ){
        this.headers = new HttpHeaders().set('Authorization', this.auth.getToken());
    }

    /**
     * 나의업무 Tree 조회
     * @param condition 조건
     */
    getMyProcessTree(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/myProcess/myProcessTree', {headers: this.headers, params: httpParams});
    }

    /**
     * 나의업무 수정
     * @param form 
    */
    putMyProcess(form:NgForm): Observable<any> {
       return this.http.put<any>('/api/myProcess/update', form, {headers: this.headers, withCredentials:true});
    }

}
