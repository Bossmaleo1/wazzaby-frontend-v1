import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {NotificationService} from '../Services/notification.service';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private  router: Router
              , private authService: AuthService
              , private notificationService: NotificationService
              , private constance: ConstanceService
              , private httpClient: HttpClient) { }

  ngOnInit() {
      const url = this.constance.dns
          .concat('/WazzabyApi/public/api/displayNotification?id_recepteur=')
          .concat(this.authService.getSessions().id);
      this.httpClient
          .get(url)
          .subscribe(
              (response) => {
                  this.notificationService.notifications = response;
                  this.notificationService.progressbarnotification = false;
                  return response;
              },
              (error) => {
              });
  }

  OnBack() {
      this.router.navigate(['home']);
  }

    OnDeconnect() {
        this.authService.signOut();
        this.router.navigate(['connexion']);
    }

}
