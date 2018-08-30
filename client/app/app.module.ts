import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule  } from 'ng2-truncate'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Nl2BrPipeModule} from 'nl2br-pipe';

/** Modules */
import { MaterialModule } from './material/material.module';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { SideNavMenuModule } from './side-nav-menu/module';

/**pipe */
import { MatchCharCssPipe } from './match-char-css.pipe';

/** Services */
import { UserService } from './services/user.service';
import { IncidentService } from './services/incident.service';
import { CommonApiService } from './services/common-api.service';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { StatisticService } from './services/statistic.service';
import { CompanyService } from './services/company.service';
import { UsermanageService } from './services/usermanage.service';
import { HigherProcessService } from './services/higherProcess.service';
import { OftenqnaService } from './services/oftenqna.service';

/** Components */
import { AppComponent } from './app.component';
import { HigherCdComponent } from './shared/higher-cd/higher-cd.component';
import { UserG1Component } from './shared/user-nav/user-g1/user-g1.component';
import { UserG2Component } from './shared/user-nav/user-g2/user-g2.component';
import { UserG3Component } from './shared/user-nav/user-g3/user-g3.component';
import { UserG4Component } from './shared/user-nav/user-g4/user-g4.component';
import { UserG5Component } from './shared/user-nav/user-g5/user-g5.component';
import { UserG9Component } from './shared/user-nav/user-g9/user-g9.component';
import { ProcessStatusComponent } from './shared/process-status/process-status.component';
import { EmpInfoComponent } from './shared/emp-info/emp-info.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AccountComponent } from './pages/account/account.component';
import { SvcdNavComponent } from './pages/svcd-nav/svcd-nav.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainContentComponent } from './pages/main-content/main-content.component';
import { IncidentNewComponent } from './pages/incident/incident-new/incident-new.component';
import { IncidentListComponent } from './pages/incident/incident-list/incident-list.component';
import { IncidentListAllComponent } from './pages/incident/incident-list-all/incident-list-all.component';
import { IncidentListMngComponent } from './pages/incident/incident-list-mng/incident-list-mng.component';
import { IncidentConditionComponent } from './pages/incident/incident-condition/incident-condition.component';
import { IncidentDetailAComponent } from './pages/incident/incident-detail-a/incident-detail-a.component';
import { IncidentValuationComponent } from './pages/incident/incident-valuation/incident-valuation.component';
import { IncidentNewMngComponent } from './pages/incident/incident-new-mng/incident-new-mng.component';
import { IncidentDetailMComponent } from './pages/incident/incident-detail-m/incident-detail-m.component';
import { IncidentHigherChangeComponent } from './pages/incident/incident-higher-change/incident-higher-change.component';
import { IncidentReceiptComponent } from './pages/incident/incident-receipt/incident-receipt.component';
import { IncidentNCompleteComponent } from './pages/incident/incident-n-complete/incident-n-complete.component';
import { IncidentCompleteComponent } from './pages/incident/incident-complete/incident-complete.component';
import { IncidentHoldComponent } from './pages/incident/incident-hold/incident-hold.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { CompanyDetailAComponent } from './pages/company/company-detail-a/company-detail-a.component';
import { UsermanageListComponent } from './pages/usermanage/usermanage-list/usermanage-list.component';
import { ComHigherComponent } from './pages/statistic/com-higher/com-higher.component';
import { LowerCdComponent } from './shared/lower-cd/lower-cd.component';
import { PageInfoComponent } from './pages/page-info/page-info.component';
import { HigherProcessListComponent } from './pages/higherProcess/higher-process-list/higher-process-list.component';
import { HigherProcessDetailComponent } from './pages/higherProcess/higher-process-detail/higher-process-detail.component';
import { ExcelService } from './services/excel.service';
import { OftenqnaListComponent } from './pages/oftenqna/oftenqna-list/oftenqna-list.component';
import { OftenqnaDetailComponent } from './pages/oftenqna/oftenqna-detail/oftenqna-detail.component';
import { MyProcessComponent } from './pages/process/my-process/my-process.component';
import { IncidentUserCompleteComponent } from './pages/incident/incident-user-complete/incident-user-complete.component';
import { HigherProcessComponent } from './pages/process/higher-process/higher-process.component';
import { LowerProcessComponent } from './pages/process/lower-process/lower-process.component';
import { OftenQnaComponent } from './pages/qna/often-qna/often-qna.component';
import { QnaMngComponent } from './pages/qna/qna-mng/qna-mng.component';
import { QnaListComponent } from './pages/qna/qna-list/qna-list.component';
import { QnaDetailComponent } from './pages/qna/qna-detail/qna-detail.component';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { UserAccessComponent } from './pages/user/user-access/user-access.component';
import { CompanyProcessComponent } from './pages/process/company-process/company-process.component';
import { ProcessGubunCodeComponent } from './pages/process/process-gubun-code/process-gubun-code.component';
import { ProcessGubunCodeDetailComponent } from './pages/process/process-gubun-code-detail/process-gubun-code-detail.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { ManagerDashboardComponent } from './pages/dashboard/manager-dashboard/manager-dashboard.component';

const PAGES = [
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    NotFoundComponent
];

@NgModule({
    declarations: [
        AppComponent,
        ...PAGES,
        SvcdNavComponent,
        MainContentComponent,
        IncidentNewComponent,
        IncidentListComponent,
        IncidentListAllComponent,
        IncidentListMngComponent,
        IncidentConditionComponent,
        IncidentDetailAComponent,
        IncidentDetailMComponent,
        IncidentNewMngComponent,        
        IncidentHigherChangeComponent,
        IncidentReceiptComponent,
        IncidentNCompleteComponent,
        IncidentValuationComponent,
        IncidentCompleteComponent,
        IncidentHoldComponent,
        HigherCdComponent,
        LowerCdComponent,
        UserG1Component,
        UserG2Component,
        UserG3Component,
        UserG4Component,
        UserG5Component,
        UserG9Component,
        ProcessStatusComponent,
        EmpInfoComponent,
        ComHigherComponent,
        UsermanageListComponent,
        CompanyDetailAComponent,
        CompanyListComponent,
        MatchCharCssPipe,
        PageInfoComponent,
        HigherProcessListComponent,
        OftenqnaListComponent,
        OftenqnaDetailComponent,
        MyProcessComponent,
        IncidentUserCompleteComponent,
        HigherProcessComponent,
        LowerProcessComponent,
        OftenQnaComponent,
        QnaMngComponent,
        QnaListComponent,
        QnaDetailComponent,
        UserListComponent,
        UserAccessComponent,
        CompanyProcessComponent,
        ProcessGubunCodeComponent,
        ProcessGubunCodeDetailComponent,
        DashboardMainComponent,
        ManagerDashboardComponent,
        HigherProcessDetailComponent
    ],
    imports: [
        BrowserModule,
        RoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        MaterialModule,
        SideNavMenuModule,
        NgbModule.forRoot(),
        FileUploadModule,
        TruncateModule,
        NgxChartsModule,
        Nl2BrPipeModule
    ],
    providers: [
        AuthService,
        UserService,
        IncidentService,
        CommonApiService,
        CookieService,
        EmpInfoComponent,
        StatisticService,
        CompanyService,
        UsermanageService,
        HigherProcessService,
        ExcelService,
        OftenqnaService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})

export class AppModule { }
