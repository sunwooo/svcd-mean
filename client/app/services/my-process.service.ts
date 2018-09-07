import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MyProcessService {

  constructor(private http: HttpClient) { }

    /**
     * 나의업무 Tree 조회
     * @param condition 조건
     */
    getMyProcessTree(condition): Observable<any> {
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/myProcess/myProcessTree', {params: httpParams});
    }

    /**
     * 나의업무 수정
     * @param form 
    */
    putMyProcess(form:NgForm): Observable<any> {
       return this.http.put<any>('/api/myProcess/update', form, {withCredentials:true});
    }

}
