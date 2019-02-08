import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { HomeComponent } from './home/home.component';
import { NotificationComponent } from './notification/notification.component';
import { ProfilComponent } from './profil/profil.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { ProblematiqueGeneraleComponent } from './problematique-generale/problematique-generale.component';
import { ProblematiqueDetailsComponent } from './problematique-details/problematique-details.component';
import { Inscription1Component } from './inscription1/inscription1.component';
import { Inscription2Component } from './inscription2/inscription2.component';
import { Inscription3Component } from './inscription3/inscription3.component';
import { DownloadAndroidComponent } from './download-android/download-android.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthService} from './Services/auth.service';
import {HomeDesignService} from './Services/home.design.service';
import {AuthGuardService} from './Services/auth.guard.service';
import { NotFoundComponent } from './not-found/not-found.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';
import { PublicconvertDetailsComponent } from './publicconvert-details/publicconvert-details.component';
import {PublicConvertServices} from './Services/public.convert.services';
import { PublicconvertComponent } from './publicconvert/publicconvert.component';
import {Help1Services} from './Services/help1.services';
import { CommentsComponent } from './comments/comments.component';
import {PublicCommentsServices} from './Services/public.comments.services';
import { PrivaterecentconvertComponent } from './privaterecentconvert/privaterecentconvert.component';
import { PrivateUserOnlineComponent } from './private-user-online/private-user-online.component';
import {PrivateUseronlineServices} from './Services/private.useronline.services';
import {PrivateRecentconvertServices} from './Services/private.recentconvert.services';
import {ConstanceService} from './Services/Constance.service';
import {HttpClientModule} from '@angular/common/http';
import {FileSelectDirective} from 'ng2-file-upload';
import {WebcamModule} from 'ngx-webcam';
import {MessagepublicService} from './Services/messagepublic.service';
import { InscriptForm1Component } from './inscript-form1/inscript-form1.component';
import { InscriptForm2Component } from './inscript-form2/inscript-form2.component';
import { InscriptForm3Component } from './inscript-form3/inscript-form3.component';
import { InscriptForm4Component } from './inscript-form4/inscript-form4.component';
import { InscriptForm5Component } from './inscript-form5/inscript-form5.component';



const appRoutes: Routes = [
    {path: 'about', component: AboutComponent},
    {path: 'settings', canActivate: [AuthGuardService], component: SettingsComponent},
    {path: 'profil', canActivate: [AuthGuardService], component: ProfilComponent},
    {path: 'inscription3', component: Inscription3Component},
    {path: 'inscription2', component: Inscription2Component},
    {path: 'inscription1', component: Inscription1Component},
    {path: 'problematique', canActivate: [AuthGuardService], component: ProblematiqueGeneraleComponent},
    {path: 'details', canActivate: [AuthGuardService], component: ProblematiqueDetailsComponent},
    {path: 'notification', canActivate: [AuthGuardService], component: NotificationComponent},
    {path: 'download', component: DownloadAndroidComponent},
    {path: 'home', canActivate: [AuthGuardService], component: HomeComponent},
    {path: 'home/:id', canActivate: [AuthGuardService], component: PublicconvertDetailsComponent},
    {path: 'inscript1', component: InscriptForm1Component},
    {path: 'inscript2', component: InscriptForm2Component},
    {path: 'inscript3', component: InscriptForm3Component},
    {path: 'inscript4', component: InscriptForm4Component},
    {path: 'inscript5', component: InscriptForm5Component},
    {path: '', component: ConnexionComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  declarations: [
    AppComponent,
    FileSelectDirective,
    ConnexionComponent,
    HomeComponent,
    NotificationComponent,
    ProfilComponent,
    SettingsComponent,
    AboutComponent,
    ProblematiqueGeneraleComponent,
    ProblematiqueDetailsComponent,
    Inscription1Component,
    Inscription2Component,
    Inscription3Component,
    DownloadAndroidComponent,
    NotFoundComponent,
    PublicconvertDetailsComponent,
    PublicconvertComponent,
    CommentsComponent,
    PrivaterecentconvertComponent,
    PrivateUserOnlineComponent,
    InscriptForm1Component,
    InscriptForm2Component,
    InscriptForm3Component,
    InscriptForm4Component,
    InscriptForm5Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    NgMatSearchBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    WebcamModule
  ],
  providers: [
      AuthService,
      HomeDesignService,
      PublicConvertServices,
      AuthGuardService,
      Help1Services,
      PublicCommentsServices,
      PrivateUseronlineServices,
      PrivateRecentconvertServices,
      ConstanceService,
      MessagepublicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
