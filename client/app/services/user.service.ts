import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    login(credentials): Observable<any> {

        console.log("========user.login()========");
        console.log("credentials : ", credentials);
        console.log("============================");

        return this.http.post<any>('/api/login', credentials, { withCredentials: true });
    }


    /**
     * 
     * @param user 
     */
    addUser(user: NgForm): Observable<any> {

        console.log("========addUser(user: NgForm): Observable<any>========");
        console.log("user : ", user.value);
        console.log("======================================================");

        return this.http.post<any>('/api/addUser', user.value, { withCredentials: true });
    }


    /**
     * 그룹 직원정보 
     * @param user 
     */
    getGroupEmpInfo(email: string): Observable<any> {

        console.log("========getGroupEmpInfo(email : string): Observable<any>========");
        console.log("email : ", email);
        console.log("======================================================");

        var headers = new HttpHeaders();            
        headers.set('Content-Type', 'application/json');
        //headers.set('Access-Control-Allow-Origin', '*');

        return this.http.get<any>('http://gw.isu.co.kr/COVIWeb/api/UserSimpleData.aspx?email='+email, {headers} );
    }


    /**
    * 
    * @param user 
    */
    getEmpInfo(email: string): Observable < any > {

        console.log("========getEmpInfo(email : string): Observable<any>========");
        console.log("email : ", email);
        console.log("======================================================");

        return this.http.get<any>('/api/empInfo', { params: new HttpParams().set('email', email) });
    }


    /*
    getUser(user: User): Observable<User> {
      return this.http.get<User>(`/api/user/${user._id}`);
    }
    */

}
