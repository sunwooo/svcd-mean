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
import { IncidentListComponent } from './pages/incident/incident-list/incident-list.component';
import { IncidentListMngComponent } from './pages/incident/incident-list-mng/incident-list-mng.component';
import { IncidentListAllComponent } from './pages/incident/incident-list-all/incident-list-all.component';
import { ComHigherComponent } from './pages/statistic/com-higher/com-higher.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'svcd', component: SvcdNavComponent,
        children: [
            { path: 'index', component: MainContentComponent },
            { path: 'content', component: AccountComponent },
            { path: 'incident', 
            children: [
                { path: 'new', component: IncidentNewComponent },
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
            ]}
        ]
    },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'account', component: AccountComponent },
    { path: 'notfound', component: NotFoundComponent },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    //imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class RoutingModule { }
