import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule  } from 'ng2-truncate'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

/** Modules */
import { MaterialModule } from './material/material.module';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { SideNavMenuModule } from './side-nav-menu/module';

/** pipe */
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

/** Components */
import { AppComponent } from './app.component';
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
import { ProcessStatusComponent } from './shared/process-status/process-status.component';
import { EmpInfoComponent } from './shared/emp-info/emp-info.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { CompanyDetailAComponent } from './pages/company/company-detail-a/company-detail-a.component';
import { UsermanageListComponent } from './pages/usermanage/usermanage-list/usermanage-list.component';
import { IncidentDetailMComponent } from './pages/incident/incident-detail-m/incident-detail-m.component';
import { HigherCdComponent } from './shared/higher-cd/higher-cd.component';
import { UserG1Component } from './shared/user-nav/user-g1/user-g1.component';
import { UserG2Component } from './shared/user-nav/user-g2/user-g2.component';
import { UserG3Component } from './shared/user-nav/user-g3/user-g3.component';
import { UserG4Component } from './shared/user-nav/user-g4/user-g4.component';
import { UserG5Component } from './shared/user-nav/user-g5/user-g5.component';
import { UserG9Component } from './shared/user-nav/user-g9/user-g9.component';
import { IncidentValuationComponent } from './pages/incident/incident-valuation/incident-valuation.component';
import { IncidentNewMngComponent } from './pages/incident/incident-new-mng/incident-new-mng.component';
import { ComHigherComponent } from './pages/statistic/com-higher/com-higher.component';
import { LowerCdComponent } from './shared/lower-cd/lower-cd.component';
import { IncidentHigherChangeComponent } from './pages/incident/incident-higher-change/incident-higher-change.component';
import { IncidentNCompleteComponent } from './pages/incident/incident-n-complete/incident-n-complete.component';
import { IncidentReceiptComponent } from './pages/incident/incident-receipt/incident-receipt.component';

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
        HigherCdComponent,
        UserG1Component,
        UserG2Component,
        UserG3Component,
        UserG4Component,
        UserG5Component,
        UserG9Component,
        ProcessStatusComponent,
        IncidentValuationComponent,
        EmpInfoComponent,
        ComHigherComponent,
        UsermanageListComponent,
        CompanyDetailAComponent,
        CompanyListComponent,
        IncidentNewMngComponent,
        MatchCharCssPipe,
        IncidentDetailMComponent,
        LowerCdComponent,
        IncidentHigherChangeComponent,
        IncidentNCompleteComponent,
        IncidentReceiptComponent
    ],
    imports: [
        BrowserModule,
        RoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        MaterialModule,
        SideNavMenuModule,
        FroalaEditorModule.forRoot(), 
        FroalaViewModule.forRoot(), 
        NgbModule.forRoot(),
        FileUploadModule,
        TruncateModule,
        NgxChartsModule 
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
        UsermanageService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})

export class AppModule { }
