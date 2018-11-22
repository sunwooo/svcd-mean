import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SvcdNavComponent } from './pages/svcd-nav/svcd-nav.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AccountComponent } from './pages/account/account.component';
import { MainContentComponent } from './pages/main-content/main-content.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { IncidentNewComponent } from './pages/incident/incident-new/incident-new.component';
import { IncidentNewMngComponent } from './pages/incident/incident-new-mng/incident-new-mng.component';
import { IncidentListComponent } from './pages/incident/incident-list/incident-list.component';
import { IncidentListMngComponent } from './pages/incident/incident-list-mng/incident-list-mng.component';
import { IncidentListAllComponent } from './pages/incident/incident-list-all/incident-list-all.component';

import { ComHigherComponent } from './pages/statistic/com-higher/com-higher.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { MyProcessComponent } from './pages/process/my-process/my-process.component';
import { LowerProcessComponent } from './pages/process/lower-process/lower-process.component';
import { HigherProcessComponent } from './pages/process/higher-process/higher-process.component';
import { UserAccessComponent } from './pages/user/user-access/user-access.component';
import { CompanyProcessComponent } from './pages/process/company-process/company-process.component';
import { ProcessGubunCodeComponent } from './pages/process/process-gubun-code/process-gubun-code.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { ManagerDashboardComponent } from './pages/dashboard/manager-dashboard/manager-dashboard.component';
import { QnaMngComponent } from './pages/qna/qna-mng/qna-mng.component';
import { QnaListComponent } from './pages/qna/qna-list/qna-list.component';
import { QnaNewComponent } from './pages/qna/qna-new/qna-new.component';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { IncidentListCompleteComponent } from './pages/incident/incident-list-complete/incident-list-complete.component';
import { UserNewComponent } from './pages/user/user-new/user-new.component';
import { UserMyInfoComponent } from './pages/user/user-my-info/user-my-info.component';
import { CompanyNewComponent } from './pages/company/company-new/company-new.component';
import { HigherProcessNewComponent } from  './pages/process/higher-process-new/higher-process-new.component';
import { LowerProcessNewComponent } from './pages/process/lower-process-new/lower-process-new.component';
import { ProcessGubunCodeNewComponent } from './pages/process/process-gubun-code-new/process-gubun-code-new.component';
import { Dashboard1Component } from './pages/dashboard/dashboard1/dashboard1.component';
import { Dashboard2Component } from './pages/dashboard/dashboard2/dashboard2.component';
import { UserProcessComponent } from './pages/process/user-process/user-process.component';
import { MainUserContentComponent } from './pages/main-user-content/main-user-content.component';
import { MainCompanyContentComponent } from './pages/main-company-content/main-company-content.component';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { HigherLowerComponent } from './pages/statistic/higher-lower/higher-lower.component';
import { HigherLowerDeptComponent } from './pages/statistic/higher-lower-dept/higher-lower-dept.component';

const routes: Routes = [

    { path: '', component: LoginComponent },
    {
        path: 'svcd', component: SvcdNavComponent,
        children: [
            { path: '0001', component: MainContentComponent, canActivate: [AuthGuardLogin] },
            { path: '0001C', component: MainCompanyContentComponent, canActivate: [AuthGuardLogin] },
            { path: '0001U', component: MainUserContentComponent, canActivate: [AuthGuardLogin] },
            { path: '0003', component: AccountComponent, canActivate: [AuthGuardLogin] },
            { path: '0005', component: UserMyInfoComponent, canActivate: [AuthGuardLogin] },
            
            { path: '1100', component: IncidentNewComponent, canActivate: [AuthGuardLogin] },
            { path: '1200', component: IncidentListComponent, canActivate: [AuthGuardLogin] },
            { path: '1300', component: QnaListComponent, canActivate: [AuthGuardLogin] },
            { path: '1400', component: IncidentListCompleteComponent, canActivate: [AuthGuardLogin] },

            { path: '2100', component: IncidentNewMngComponent, canActivate: [AuthGuardLogin] },
            { path: '2200', component: IncidentListMngComponent, canActivate: [AuthGuardLogin] },
            { path: '2300', component: MyProcessComponent, canActivate: [AuthGuardLogin] },
            { path: '2400', component: ManagerDashboardComponent, canActivate: [AuthGuardLogin] },

            { path: '3100', component: IncidentListAllComponent, canActivate: [AuthGuardLogin] },
            { path: '3200', component: ComHigherComponent, canActivate: [AuthGuardLogin] },
            { path: '3300', component: HigherLowerComponent, canActivate: [AuthGuardLogin] },
            { path: '3400', component: HigherLowerDeptComponent, canActivate: [AuthGuardLogin] },
            
            { path: '4100', component: HigherProcessComponent, canActivate: [AuthGuardLogin] },
            { path: '4150', component: HigherProcessNewComponent, canActivate: [AuthGuardLogin] },
            { path: '4200', component: LowerProcessComponent, canActivate: [AuthGuardLogin] },
            { path: '4250', component: LowerProcessNewComponent, canActivate: [AuthGuardLogin] },
            { path: '4300', component: CompanyListComponent, canActivate: [AuthGuardLogin] },
            { path: '4350', component: CompanyNewComponent, canActivate: [AuthGuardLogin] },
            { path: '4400', component: UserListComponent, canActivate: [AuthGuardLogin] },
            { path: '4450', component: UserNewComponent, canActivate: [AuthGuardLogin] },
            { path: '4500', component: UserAccessComponent, canActivate: [AuthGuardLogin] },
            { path: '4600', component: CompanyProcessComponent, canActivate: [AuthGuardLogin] },
            { path: '4610', component: UserProcessComponent, canActivate: [AuthGuardLogin] },
            { path: '4700', component: ProcessGubunCodeComponent, canActivate: [AuthGuardLogin] },
            { path: '4750', component: ProcessGubunCodeNewComponent, canActivate: [AuthGuardLogin] },
            { path: '4800', component: QnaMngComponent, canActivate: [AuthGuardLogin] },
            { path: '4900', component: QnaNewComponent, canActivate: [AuthGuardLogin] },

            { path: '9100', component: DashboardMainComponent, canActivate: [AuthGuardLogin] },
        ]
    },

    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'notfound', component: NotFoundComponent },
    { path: '**', redirectTo: '/notfound' }

];

@NgModule({
    //imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class RoutingModule { }
