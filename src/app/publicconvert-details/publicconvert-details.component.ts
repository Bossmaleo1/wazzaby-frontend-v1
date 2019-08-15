import { Component, OnInit } from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {PublicCommentsServices} from '../Services/public.comments.services';
import {ConstanceService} from '../Services/Constance.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Location} from '@angular/common';
import {NotificationService} from '../Services/notification.service';

@Component({
    selector: 'app-publicconvert-details',
    templateUrl: './publicconvert-details.component.html',
    styleUrls: ['./publicconvert-details.component.scss']
})
export class PublicconvertDetailsComponent implements OnInit {

    id: number;
    name: string;
    updated: string;
    user_photo: string;
    status_photo: string;
    status_text_content: string;
    etat_photo_status: string;
    comments: any;
    libelle_comment = '';
    testevent = 1;
    jaime: number;
    jaimepas: number;
    checkmention: number;
    id_checkmention: number;
    photo: string;
    booljaime: boolean;
    booljaimepas: boolean;
    display_progressbar: boolean = false;
    error_message: string;
    display_error_message: boolean;
    icon: string;
    temp_id_checkmention: number;


    constructor(private publicconvert: PublicConvertServices
        , private route: ActivatedRoute
        , private  router: Router
        , private httpClient: HttpClient
        , private authService: AuthService
        , private _location: Location
        , public snackBar: MatSnackBar
        , private constance: ConstanceService
        , private notificationService: NotificationService
        , private publiccomments: PublicCommentsServices) { }

    ngOnInit() {

        this.display_progressbar = false;
        this.display_error_message = false;
        this.booljaime = false;
        this.booljaimepas = false;
        this.id = this.publiccomments.id;
        this.name = this.publiccomments.name;
        this.updated = this.publiccomments.updated;
        this.user_photo = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.publiccomments.user_photo);
        this.status_photo = this.publiccomments.status_photo;
        this.status_text_content = this.publiccomments.status_text_content;
        this.etat_photo_status = this.publiccomments.etat_photo_status;
        this.jaime = this.publiccomments.jaime;
        this.jaimepas = this.publiccomments.jaimepas;
        this.checkmention = this.publiccomments.checkmention;
        this.id_checkmention = this.publiccomments.id_checkmention;
        const url = this.constance.dns.concat('/WazzabyApi/public/api/displayComment?id_messagepublic=').concat(this.publiccomments.id);
        this.connexionToServer2(url);

        if (this.checkmention === 1) {
            this.booljaime = true;
        } else if (this.checkmention === 2) {
            this.booljaimepas = true;
        } else if (this.checkmention === 0) {
            this.booljaime = false;
            this.booljaimepas = false;
        }
        //on marque la notification comme lu
        if (this.publiccomments.notification_marqueur) {
             const urlmarquernotification = this.constance.dns.concat('/WazzabyApi/public/api/MarquerNotificationCommeLu?id_notification=')
                 .concat(String(this.notificationService.id_notification));
            this.httpClient
                .get(urlmarquernotification)
                .subscribe(
                    (response) => {
                        return response;
                    },
                    (error) => {
                    }
                );
        }
    }

    onSendComment() {
        this.addComment();
    }


    OnBack() {
        this._location.back();
    }


    connexionToServer(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response) => {
                    return response;
                },
                (error) => {
                    this.openSnackBar('Une erreur inconnue vient de se produire suite a votre insertion !', 'erreur');
                }
            );
    }

    connexionToServer2(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response2) => {
                    this.publiccomments.Comments = response2;
                    this.comments = this.publiccomments.Comments;
                    this.display_progressbar = true;
                    if (this.publiccomments.Comments.length === 0) {
                        this.error_message = "Aucun message public";
                        this.icon = 'add_comment';
                        this.display_error_message = true;
                    }
                    return response2;
                },
                (error) => {
                    this.openSnackBar('Une erreur serveur vient de se produire !', 'erreur');
                    this.error_message = "Erreur reseau sur le chargement de message publique";
                    this.icon = 'block';
                    this.display_error_message = true;
                }
            );
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    addComment() {
        const nom_du_user = ''.concat(this.authService.sessions.prenom).concat(' ').concat(this.authService.sessions.nom);
        let maleosama = new Object();
        maleosama['id'] = 1;
        maleosama['name'] = nom_du_user;
        maleosama['updated'] = "A l'instant";
        maleosama['user_photo'] = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.authService.sessions.photo);
        maleosama['status_text_content'] = this.libelle_comment;
        this.publiccomments.Comments.unshift(maleosama);
        this.comments = this.publiccomments.Comments;
        this.display_error_message = false;
        const url = this.constance.dns.concat('/WazzabyApi/public/api/addComment?id_messagepublic=').concat(this.publiccomments.id).concat('&libelle_comment=').concat(this.libelle_comment).concat('&id_user=').concat(this.authService.sessions.id);
        this.libelle_comment = '';
        this.connexionToServer(url);

        if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
            let message = "Votre message public vient d'etre commenter par "
                .concat(this.authService.getSessions().prenom)
                .concat(' ')
                .concat(this.authService.getSessions().nom);
            const url_notification = this.constance.dns.concat('/WazzabyApi/public/api/InsertNotification?users_id=')
                .concat(this.authService.sessions.id)
                .concat('&libelle=').concat(message)
                .concat('&id_type=').concat(this.publiccomments.id)
                .concat('&etat=0')
                .concat('&id_recepteur=').concat(String(this.publiccomments.id_recepteur));
            this.recordNotification(url_notification);
        }
    }

    Onjaime() {
        let message = "Votre message public vient de faire reagir "
            .concat(this.authService.getSessions().prenom)
            .concat(' ')
            .concat(this.authService.getSessions().nom);
        //we build the url of the like mention notification
        const url_notification = this.constance.dns.concat('/WazzabyApi/public/api/InsertNotification?users_id=')
            .concat(this.authService.sessions.id)
            .concat('&libelle=').concat(message)
            .concat('&id_type=').concat(this.publiccomments.id)
            .concat('&etat=0')
            .concat('&id_recepteur=').concat(String(this.publiccomments.id_recepteur));
        if (this.checkmention === 1 ) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=0')
                .concat('&id_mention=')
                .concat(String(this.publiccomments.id_checkmention));
            this.connexionToServer(url);
            this.booljaime = false;
            this.jaime--;
            this.publiccomments.checkmention = 0;
        } else if (this.checkmention === 0 && this.id_checkmention != 0) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=1')
                .concat('&id_mention=').concat(String(this.id_checkmention));
            this.connexionToServer(url);
            this.booljaime = true;
            this.booljaimepas = false;
            this.jaime++;
            this.publiccomments.checkmention = 1;
            if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
                this.recordNotification(url_notification);
            }
        }  else if (this.id_checkmention === 0 && this.checkmention === 0) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/Mentions?id_user=')
                .concat(this.authService.sessions.id).concat('&id_libelle=').concat(String(this.id))
                .concat('&id_etat=1').concat('&mention=1');
            this.connexionToServer(url);
            this.booljaime = true;
            this.booljaimepas = false;
            this.jaime++;
            this.publiccomments.checkmention = 1;
            this.publiccomments.id_checkmention = this.temp_id_checkmention;
            if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
                this.recordNotification(url_notification);
            }
        } else if (this.checkmention === 2) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=1')
                .concat('&id_mention=')
                .concat(String(this.publiccomments.id_checkmention));
            this.connexionToServer(url);
            this.booljaimepas = false;
            this.booljaime = true;
            this.jaime++;
            this.jaimepas--;
            this.publiccomments.checkmention = 1;
            this.publiccomments.id_checkmention = this.temp_id_checkmention;
            if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
                this.recordNotification(url_notification);
            }
        }
    }

    Onjaimepas() {
        /* console.log(" id_recepteur : "+this.publiccomments.id_recepteur);
       console.log("user_id : "+this.authService.getSessions().id);*/
        let message = "Votre message public vient de faire reagir "
            .concat(this.authService.getSessions().prenom)
            .concat(' ')
            .concat(this.authService.getSessions().nom);
        //we build the url of the like mention notification
        const url_notification = this.constance.dns.concat('/WazzabyApi/public/api/InsertNotification?users_id=')
            .concat(this.authService.sessions.id)
            .concat('&libelle=').concat(message)
            .concat('&id_type=').concat(this.publiccomments.id)
            .concat('&etat=0')
            .concat('id_recepteur=').concat(String(this.publiccomments.id_recepteur));
        if (this.checkmention === 2) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=0')
                .concat('&id_mention=').concat(String(this.publiccomments.id_checkmention));
            this.connexionToServer(url);
            this.booljaimepas = false;
            this.jaimepas--;
            this.publiccomments.checkmention = 0;
        } else if (this.checkmention === 0 && this.id_checkmention != 0) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=2')
                .concat('&id_mention=').concat(String(this.id_checkmention));
            this.connexionToServer(url);
            this.booljaime = false;
            this.booljaimepas = true;
            this.jaimepas++;
            this.publiccomments.checkmention = 2;
            if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
                this.recordNotification(url_notification);
            }
        } else if (this.id_checkmention === 0 && this.checkmention === 0) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/Mentions?id_user=')
                .concat(this.authService.sessions.id).concat('&id_libelle=').concat(String(this.id))
                .concat('&id_etat=2').concat('&mention=2');
            this.connexionToServer(url);
            this.booljaime = false;
            this.booljaimepas = true;
            this.jaimepas++;
            this.publiccomments.checkmention = 2;
            this.publiccomments.id_checkmention = this.temp_id_checkmention;
            if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
                this.recordNotification(url_notification);
            }
        } else if (this.checkmention === 1) {
            const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=2')
                .concat('&id_mention=')
                .concat(String(this.publiccomments.id_checkmention));
            this.connexionToServer(url);
            this.booljaime = false;
            this.booljaimepas = true;
            this.jaime--;
            this.jaimepas++;
            this.publiccomments.checkmention = 2;
            this.publiccomments.id_checkmention = this.temp_id_checkmention;
            if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
                this.recordNotification(url_notification);
            }
        }
    }

    getColor(etat: boolean) {
        if (etat) {
            return '#64B5F6';
        } else {
            return '#757575';
        }
    }

    recordNotification(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response) => {
                    return response;
                },
                (error) => {

                }
            );
    }


}
