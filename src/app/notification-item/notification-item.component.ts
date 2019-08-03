import {Component, Input, OnInit} from '@angular/core';

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
    @Input() notification_id: number;
    @Input() expediteur_id: string;

  constructor() { }

  ngOnInit() {
  }

}
