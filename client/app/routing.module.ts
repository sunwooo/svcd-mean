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
import { HigherProcessListComponent } from './pages/higherProcess/higher-process-list/higher-process-list.component';


const routes: Routes = [

    { path: '', component: LoginComponent },
    {
        path: 'svcd', component: SvcdNavComponent,
        children: [
            { path: '0001', component: MainContentComponent },
            { path: '0003', component: AccountComponent },
            { path: '1100', component: IncidentNewComponent },
            { path: '1200', component: IncidentListComponent },

            { path: '2100', component: IncidentNewMngComponent },
            { path: '2200', component: IncidentListMngComponent },

            { path: '3100', component: IncidentListAllComponent },
            { path: '3200', component: ComHigherComponent },
            
            { path: '4100', component: HigherProcessListComponent },
            { path: '4300', component: CompanyListComponent },
            { path: '4400', component: UsermanageListComponent },

            
        ]
    },

    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'notfound', component: NotFoundComponent },
    { path: '**', redirectTo: '/notfound' },

    /*
    { path: '', component: LoginComponent },
    {
        path: 'svcd', component: SvcdNavComponent,
        children: [
            { path: 'index', component: MainContentComponent },
            { path: 'content', component: AccountComponent },
            { path: 'incident', 
            children: [
                { path: 'new', component: IncidentNewComponent },
                { path: 'new-mng', component: IncidentNewMngComponent },
                { path: 'list', component: IncidentListComponent },
                { path: 'list-mng', component: IncidentListMngComponent },
                { path: 'list-all', component: IncidentListAllComponent }
            ]
            },
            { path: 'statistic',
              children: [
                  { path: 'com-higher', component: ComHigherComponent}
              ]},
            { path: 'company',
              children: [
                  { path: 'list', component: CompanyListComponent }
            ]},
            { path: 'usermanage',
              children: [
                  { path: 'list', component: UsermanageListComponent }
            ]},
            { path: 'higherProcess',
              children: [
                  { path: 'list', component: HigherProcessListComponent }
            ]},
        ]
    },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/:email/:password', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'account', component: AccountComponent },
    { path: 'notfound', component: NotFoundComponent },
    { path: '**', redirectTo: '/notfound' },
    */
];

@NgModule({
    //imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class RoutingModule { }
