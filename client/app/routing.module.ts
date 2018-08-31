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
import { UsermanageListComponent } from './pages/usermanage/usermanage-list/usermanage-list.component';
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

const routes: Routes = [

    { path: '', component: LoginComponent },
    {
        path: 'svcd', component: SvcdNavComponent,
        children: [
            { path: '0001', component: MainContentComponent },
            { path: '0003', component: AccountComponent },
            
            { path: '1100', component: IncidentNewComponent },
            { path: '1200', component: IncidentListComponent },
            { path: '1300', component: QnaListComponent },

            { path: '2100', component: IncidentNewMngComponent },
            { path: '2200', component: IncidentListMngComponent },
            { path: '2300', component: MyProcessComponent },
            { path: '2400', component: ManagerDashboardComponent },

            { path: '3100', component: IncidentListAllComponent },
            { path: '3200', component: ComHigherComponent },
            
            { path: '4100', component: HigherProcessComponent },
            { path: '4200', component: LowerProcessComponent },
            { path: '4300', component: CompanyListComponent },
            { path: '4400', component: UsermanageListComponent },
            { path: '4500', component: UserAccessComponent },
            { path: '4600', component: CompanyProcessComponent },
            { path: '4700', component: ProcessGubunCodeComponent },
            { path: '4800', component: QnaMngComponent},
            { path: '4900', component: QnaNewComponent},

            { path: '9100', component: DashboardMainComponent}
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
