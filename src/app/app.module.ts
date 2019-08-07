import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { HomeComponent } from './home/home.component';
import { NotificationComponent } from './notification/notification.component';
import { ProfilComponent } from './profil/profil.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';
import { ProblematiqueGeneraleComponent } from './problematique-generale/problematique-generale.component';
import { ProblematiqueDetailsComponent } from './problematique-details/problematique-details.component';
import { DownloadAndroidComponent } from './download-android/download-android.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthService} from './Services/auth.service';
import {HomeDesignService} from './Services/home.design.service';
import {AuthGuardService} from './Services/auth.guard.service';
import { NotFoundComponent } from './not-found/not-found.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MessagepublicService} from './Services/messagepublic.service';
import { InscriptFormComponent } from './inscript-form/inscript-form.component';
import { AddProfilPictureComponent } from './add-profil-picture/add-profil-picture.component';
import { WelcomeToWazzabyComponent } from './welcome-to-wazzaby/welcome-to-wazzaby.component';
import { ProblematiqueItemComponent } from './problematique-item/problematique-item.component';
import {ProblematiqueItemService} from './Services/problematique.item.service';
import {AddProfilPictureService} from './Services/add.profil.picture.service';

import {
    LyThemeModule,
    LY_THEME
} from '@alyle/ui';

import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyTypographyModule } from '@alyle/ui/typography';

/** Import theme */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import {NotificationService} from './Services/notification.service';
import {DeleteMessagepublicService} from './Services/delete.messagepublic.service';
import {UtilService} from './Services/util.service';
import {UpdateService} from './Services/update.service';




const appRoutes: Routes = [
    {path: 'about', component: AboutComponent},
    {path: 'settings', canActivate: [AuthGuardService], component: SettingsComponent},
    {path: 'profil', canActivate: [AuthGuardService], component: ProfilComponent},
    {path: 'problematique', canActivate: [AuthGuardService], component: ProblematiqueGeneraleComponent},
    {path: 'details', canActivate: [AuthGuardService], component: ProblematiqueDetailsComponent},
    {path: 'notification', canActivate: [AuthGuardService], component: NotificationComponent},
    {path: 'download', component: DownloadAndroidComponent},
    {path: 'home', canActivate: [AuthGuardService], component: HomeComponent},
    {path: 'public-convert-details', canActivate: [AuthGuardService], component: PublicconvertDetailsComponent},
    {path: 'inscript', component: InscriptFormComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'welcome', canActivate: [AuthGuardService], component: WelcomeToWazzabyComponent},
    {path: '', component: ConnexionComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    HomeComponent,
    NotificationComponent,
    ProfilComponent,
    SettingsComponent,
    AboutComponent,
    ProblematiqueGeneraleComponent,
    ProblematiqueDetailsComponent,
    DownloadAndroidComponent,
    NotFoundComponent,
    PublicconvertDetailsComponent,
    PublicconvertComponent,
    CommentsComponent,
    PrivaterecentconvertComponent,
    PrivateUserOnlineComponent,
    InscriptFormComponent,
    AddProfilPictureComponent,
    WelcomeToWazzabyComponent,
    ProblematiqueItemComponent,
    NotificationItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    LyThemeModule.setTheme('minima-dark'),
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyIconModule,
    LyTypographyModule,
    FlexLayoutModule
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
      MessagepublicService,
      ProblematiqueItemService,
      DeleteMessagepublicService,
      UtilService,
      UpdateService,
      AddProfilPictureService,
      NotificationService,
      {provide: LocationStrategy, useClass: HashLocationStrategy},
      { provide: LY_THEME, useClass: MinimaLight, multi: true },
      { provide: LY_THEME, useClass: MinimaDark, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
