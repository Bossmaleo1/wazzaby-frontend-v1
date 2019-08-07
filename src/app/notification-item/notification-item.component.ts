import {Component, Input, OnInit} from '@angular/core';
import {PublicCommentsServices} from '../Services/public.comments.services';
import {NotificationService} from '../Services/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {

    @Input() index: number;
    @Input() nom: string;
    @Input() prenom: string;
    @Input() photo: string;
    @Input() libelle: string;
    @Input() updated: string;
    @Input() etat: number;
    @Input() id_type: string;
    @Input() id_libelle: number;
    @Input() notification_id: number;
    @Input() expediteur_id: string;
    @Input() hide_done_icon: boolean;

  constructor(private publiccommentsservice: PublicCommentsServices
              , private  router: Router
              , private notificationService: NotificationService) { }

  ngOnInit() {
  }

  RootTo() {
      this.publiccommentsservice.id = this.notificationService.notifications[this.index].id_messagepublic;
      this.publiccommentsservice.name = this.notificationService.notifications[this.index].name_messagepublic;
      this.publiccommentsservice.updated = this.notificationService.notifications[this.index].updated_messagepublic;
      this.publiccommentsservice.user_photo = this.notificationService.notifications[this.index].user_photo_messagepublic;
      this.publiccommentsservice.status_photo = this.notificationService.notifications[this.index].status_photo_messagepublic;
      this.publiccommentsservice.status_text_content = this.notificationService.notifications[this.index].status_text_content_messagepublic;
      this.publiccommentsservice.etat_photo_status = this.notificationService.notifications[this.index].etat_photo_status_messagepublic;
      this.router.navigate(['public-convert-details']);
  }

}
