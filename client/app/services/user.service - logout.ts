import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {
    }

    /**
     * 로그인
     * @param credentials
     */
    login(credentials): Observable<any> {
        return this.http.post<any>('/api/login', credentials, { withCredentials: true });
    }

    /**
     * 로그아웃
     */
    logout(): Observable<any> {
        return this.http.post<any>('/api/logout', { withCredentials: true });
    }


    /**
     * 
     * @param user 
     */
    addUser(user: NgForm): Observable<any> {
        return this.http.post<any>('/api/addUser', user.value, { withCredentials: true });
    }


    /**
     * 그룹 사용자 정보 
     * @param user 
     */
    getGroupEmpInfo(email: string): Observable<any> {

        var headers = new HttpHeaders();            
        headers.set('Content-Type', 'application/json');
        //headers.set('Access-Control-Allow-Origin', '*');
        return this.http.get<any>('http://gw.isu.co.kr/COVIWeb/api/UserSimpleData.aspx?email='+email, {headers} );
    }


    /**
    * 
    * @param user 
    */
    getEmpInfo(email: string): Observable <any> {
        return this.http.get<any>('/api/empInfo', { params: new HttpParams().set('email', email) });
    }


    /**
     * 사용자 찾기
     * @param empName 
     */
    findEmp(empName: string): Observable<any> {
        return this.http.get<any>('/api/findEmp', { params: new HttpParams().set('empName', empName) });
    }
    

}
