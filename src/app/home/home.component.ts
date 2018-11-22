import {Component, Inject, OnInit, Output} from '@angular/core';
import {HomeDesignService} from '../Services/home.design.service';
import {MatTabChangeEvent} from '@angular/material';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {Help1Services} from '../Services/help1.services';
import {PrivateUseronlineServices} from '../Services/private.useronline.services';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    IconEtatColorPublicConver = true;
    IconEtatColorPrivateConver = false;

    /*la variable qui hidden le badges*/
    badgeshidden = false;
    badgetaille = 6;
    /*le tableau contenant les conversations des utilisateurs*/
    conversationsPublicsHome: any;
    privateusersOnlineHome: any;
    privaterecentConvertHome: any;

    animal: string;
    name: string;

    /*le status du block de la boite de dialogue*/
    block_boite_de_dialogue: string;


  constructor(private homedesign: HomeDesignService, private  router: Router, private authService: AuthService, private help1Services: Help1Services, private privateuseronlineservices: PrivateUseronlineServices, private privaterecentconvertservices: PrivateRecentconvertServices) { }



  ngOnInit() {
      this.conversationsPublicsHome = this.help1Services.conversationsPublics;
      this.privateusersOnlineHome = this.privateuseronlineservices.userOnlines;
      this.privaterecentConvertHome = this.privaterecentconvertservices.RecentConverts;
  }

  getColor(etat: boolean) {
    if (etat) {
      return '#0D47A1';
    } else {
      return 'black';
    }
  }

  ChangeIconOne() {
      this.IconEtatColorPublicConver = true;
      this.IconEtatColorPrivateConver = false;
  }

  ChangeIconTwo() {
      this.IconEtatColorPublicConver = false;
      this.IconEtatColorPrivateConver = true;
  }

  /*La methode qui change la couleur de l'icone suivant l'onglet cliquer*/
  onLinkClick(event: MatTabChangeEvent) {

        if (event.index === 0) {
            this.ChangeIconOne();
        } else if (event.index === 1) {
            this.ChangeIconTwo();
        }
  }

    OnclickNotification() {
        this.badgeshidden = true;

        this.router.navigate(['notification']);
    }

    OnclickProblematique() {
      this.router.navigate(['problematique']);
    }

    OnDeconnect() {
        this.authService.signOut();
        this.router.navigate(['connexion']);
    }

    OnProfil() {
        this.router.navigate(['profil']);
    }

    /*Pour afficher la boite de dialogue*/
    onDialogPublicConvert() {
        this.block_boite_de_dialogue = 'block';
    }

    /*Methode pour fermer la boite de dialogue*/
    onCloseDialog() {
        this.block_boite_de_dialogue = 'none';
    }

}




