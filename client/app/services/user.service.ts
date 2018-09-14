import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {


    }

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

        return this.http.post<any>('/api/user/addUser', user.value, { withCredentials: true });
    }


    /**
     * 그룹 사용자 정보 
     * @param user 
     */
    getGroupEmpInfo(email: string): Observable<any> {

        console.log("========getGroupEmpInfo(email : string): Observable<any>========");
        console.log("email : ", email);
        console.log("======================================================");

        var headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        //headers.set('Access-Control-Allow-Origin', '*');

        return this.http.get<any>('http://gw.isu.co.kr/COVIWeb/api/UserSimpleData.aspx?email=' + email, { headers });
    }


    /**
    * 
    * @param user 
    */
    getEmpInfo(email: string): Observable<any> {

        console.log("========getEmpInfo(email : string): Observable<any>========");
        console.log("email : ", email);
        console.log("======================================================");

        return this.http.get<any>('/api/user/empInfo', { params: new HttpParams().set('email', email) });
    }


    /**
     * 사용자 찾기
     * @param empName 
     */
    findEmp(empName: string): Observable<any> {
        return this.http.get<any>('/api/user/findEmp', { params: new HttpParams().set('empName', empName) });
    }

    /**
     * 사용자 리스트 조회
     * @param condition 
     */
    getUserList(condition): Observable<any> {

        //console.log("==================services getUsermanageList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/user/list', { params: httpParams });
    }

    /**
     * 미승인 사용자 리스트 조회
     * @param condition 
     */
    getAccessUserList(condition): Observable<any> {

        //console.log("==================services getUsermanageList", condition);
        var httpParams = new HttpParams({ fromObject: condition });
        return this.http.get<any>('/api/user/accessList', { params: httpParams });
    }

    /**
     * 사용자 수정
     * @param form 
     */
    putUser(form): Observable<any>{
        //console.log("=== user.services putUser form.value : ", form);
        return this.http.put<any>('/api/user/update', form, { withCredentials: true });
    }

    /**
 	 * 사용자 추가
     * @param form 
     */
    insertUser(form): Observable<any>{
        //console.log("=== user.services insertUser form.value : ", form);
        return this.http.post<any>('/api/user/insertUser', form, { withCredentials: true });
    }     
    
    /**
     * 사용자 삭제
     * @param userId
     */
    delete(userId): Observable<any>{
        //console.log("=== user.services delete userId : ", userId);

        var body = {_id:userId};
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: body
        };
        return this.http.delete<any>('/api/user/delete', httpOptions);
    }

    /**
     * 마이페이지 조회
     * @param form 
     */
    myPageList(form): Observable<any> {

        //console.log("==================services myPageList", form);
        var httpParams = new HttpParams({ fromObject: form });
        return this.http.get<any>('/api/user/myPage', { params: httpParams });
    }

    /**
     * 마이페이지 수정
     * @param form 
     */
    putMyPage(form): Observable<any>{
        //console.log("=== user.services putUser form.value : ", form);
        return this.http.put<any>('/api/user/myPageUpdate', form, { withCredentials: true });
    }
}
