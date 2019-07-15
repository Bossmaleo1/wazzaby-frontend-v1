import {Component, Input, OnInit} from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ConstanceService} from '../Services/Constance.service';
import {Router} from '@angular/router';
import {PublicCommentsServices} from '../Services/public.comments.services';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../Services/auth.service';

@Component({
  selector: 'app-publicconvert',
  templateUrl: './publicconvert.component.html',
  styleUrls: ['./publicconvert.component.scss']
})
export class PublicconvertComponent implements OnInit {

    @Input() id: number;
    @Input() name: string;
    @Input() updated: string;
    @Input() user_photo: string;
    @Input() status_text_content: string;
    @Input() etat_photo: string;
    @Input() etat_photo_status: string;
    @Input() status_photo: string;
    @Input() countcomment: string;
    @Input() indexOfConvert: number;
    @Input() jaime: number;
    @Input() jaimepas: number;
    @Input() checkmention: number;
    @Input() id_checkmention: number;
    photo: string;
    booljaime: boolean;
    booljaimepas: boolean;


  constructor(private publicconvert: PublicConvertServices
              , private constance: ConstanceService
              , private publiccommentsservice: PublicCommentsServices
              , private authService: AuthService
              , public snackBar: MatSnackBar
              , private httpClient: HttpClient
              , private  router: Router) {

  }

  ngOnInit() {
      this.photo = this.constance.dns.concat('/uploads/photo_de_profil/').concat(this.user_photo);
      this.booljaime = false;
      this.booljaimepas = false;
      if (this.checkmention === 1) {
          this.booljaime = true;
      } else if (this.checkmention === 2) {
          this.booljaimepas = true;
      } else if (this.checkmention === 0) {
          this.booljaime = false;
          this.booljaimepas = false;
      }
  }

  openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
  }

  OnLaunchIntervention() {
        this.publiccommentsservice.id = this.id;
        this.publiccommentsservice.name = this.name;
        this.publiccommentsservice.updated = this.updated;
        this.publiccommentsservice.user_photo = this.user_photo;
        this.publiccommentsservice.status_photo = this.status_photo;
        this.publiccommentsservice.status_text_content = this.status_text_content;
        this.publiccommentsservice.etat_photo_status = this.etat_photo_status;
        this.router.navigate(['public-convert-details']);
  }

  Onjaime() {
      if (this.checkmention === 1 ) {
          const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=0')
              .concat('&id_mention=').concat(this.id_checkmention);
          this.connexionToServer(url);
          this.booljaime = false;
          this.jaime--;
          console.log)
      } else if (this.checkmention === 0) {
          //on test si l'utilisateur a deja reagit a cette publication
          if (this.id_checkmention === 0) {
              const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=1')
                  .concat('&id_mention=').concat(this.id_checkmention);
              this.connexionToServer(url);
          } else {
              const url = this.constance.dns.concat('/WazzabyApi/public/api/Mentions?id_user=').concat(this.authService.sessions.id)
                  .concat('&id_libelle=').concat(this.publicconvert.getPublicConversById(this.indexOfConvert).id).concat('&id_etat=1')
                  .concat('&mention=1');
              this.connexionToServer(url);
          }
          this.booljaime = true;
          this.booljaimepas = false;
      } else if (this.checkmention === 2) {
          const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=1')
              .concat('&id_mention=').concat(String(this.id_checkmention));
          this.connexionToServer(url);
          this.booljaime = true;
          this.booljaimepas = false;
      }
  }

  Onjaimepas() {
      if (this.checkmention === 2) {
          const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=0')
              .concat('&id_mention=').concat(String(this.id_checkmention));
          this.connexionToServer(url);
          this.booljaimepas = false;
      } else if (this.checkmention === 0) {
          if (this.id_checkmention === 0) {
              const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=2')
                  .concat('&id_mention=').concat(String(this.id_checkmention));
              this.connexionToServer(url);
          } else {
              const url = this.constance.dns.concat('/WazzabyApi/public/api/Mentions?id_user=').concat(this.authService.sessions.id)
                  .concat('&id_libelle=').concat(this.publicconvert.getPublicConversById(this.indexOfConvert).id).concat('&id_etat=2')
                  .concat('&mention=2');
              this.connexionToServer(url);
          }
          this.booljaimepas = true;
          this.booljaime = false;
      } else if (this.id_checkmention === 1) {
          const url = this.constance.dns.concat('/WazzabyApi/public/api/MentionsUpdate?id_etat=2')
              .concat('&id_mention=').concat(String(this.id_checkmention));
          this.connexionToServer(url);
          this.booljaimepas = true;
          this.booljaime = false;
      }
  }

  getColor(etat: boolean) {
        if (etat) {
            return '#64B5F6';
        } else {
            return '#757575';
        }
  }

  connexionToServer(url: string) {
        this.httpClient
            .get(url)
            .subscribe(
                (response) => {
                    //this.openSnackBar("Votre mention vient d'etre prise en compte !!", "succes");
                    return response;
                },
                (error) => {
                    this.openSnackBar("Une erreur serveur vient de se produire", "erreur");
                }
            );
  }

}
