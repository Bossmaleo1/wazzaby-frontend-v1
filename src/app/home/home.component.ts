import {Component, ElementRef, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HomeDesignService} from '../Services/home.design.service';
import {MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {Help1Services} from '../Services/help1.services';
import {PrivateUseronlineServices} from '../Services/private.useronline.services';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConstanceService} from '../Services/Constance.service';
import {MessagePublic} from '../models/MessagePublic.model';
import {Subscription} from 'rxjs';
import {MessagepublicService} from '../Services/messagepublic.service';
import {DOCUMENT} from '@angular/common';
import { speedDialFabAnimations } from './speed-dial-fab.animations';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: speedDialFabAnimations
})
export class HomeComponent implements OnInit, OnDestroy {

    //gestion du bouton flottant multiple
    fabButtons = [
        {
            icon: 'edit'
        },
        {
            icon: 'keyboard_arrow_up'
        }
    ];
    buttons = [];
    fabTogglerState = 'inactive';

    messagepublic: MessagePublic;
    messagepublicsubscription: Subscription;
    messagepublicform: FormGroup;

    @ViewChild('fileInput') fileInput: ElementRef;

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

    afficher_spinner = false;

    // les coordonnees de l'utilisateurs
    nom: string;
    prenom: string;
    photo_user: string;
    problematique_libelle: string;
    // attributs pour la gestion du uploading des fichiers
    someUrlFile: any;
    imageSrc: any;
    disparaitreimage = 'none';
    filevalue: any;


  constructor(private homedesign: HomeDesignService
              , private  router: Router
              , private authService: AuthService
              , private help1Services: Help1Services
              , private privateuseronlineservices: PrivateUseronlineServices
              , private privaterecentconvertservices: PrivateRecentconvertServices
              , private httpClient: HttpClient
              , public snackBar: MatSnackBar
              , private constance: ConstanceService
              , private messagepublicservice: MessagepublicService
              , private formBuilder: FormBuilder) {


  }

  ngOnInit() {
      this.conversationsPublicsHome = this.help1Services.conversationsPublics;
      this.privateusersOnlineHome = this.privateuseronlineservices.userOnlines;
      this.privaterecentConvertHome = this.privaterecentconvertservices.RecentConverts;
      this.nom = this.authService.getSessions().nom;
      this.prenom = this.authService.getSessions().prenom;
      if (this.authService.getSessions().photo === '') {
            this.photo_user = 'ic_profile.png';
      } else {
          this.photo_user = this.authService.getSessions().photo;
      }
      this.problematique_libelle = this.authService.getSessions().libelle_prob;

      this.messagepublicsubscription = this.messagepublicservice.messageSubject.subscribe(
          (messagepublic: MessagePublic) => {
              this.messagepublic = messagepublic;
          }
      );
      this.messagepublicservice.emitMessage();
      this.initForm();
      window.addEventListener('scroll', this.scroll, true);
  }

  initForm() {
      this.messagepublicform = this.formBuilder.group({
          tenantPhotoId: '',
          problematique: ['', Validators.required]
          });
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
    onDialogPublicConvert(event) {
        if (event.srcElement.innerHTML === 'edit') {
            this.block_boite_de_dialogue = 'block';
        } else {
            window.scroll(0,0);
        }
    }

    /*Methode pour fermer la boite de dialogue*/
    onCloseDialog() {
        this.block_boite_de_dialogue = 'none';
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

	onChangeFile(event) {
        //afficher_spinner
        const taille = event.target.files[0].name.split('.').length;
        const extension = event.target.files[0].name.split('.')[taille - 1].toLowerCase();

        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {

            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];

                const reader = new FileReader();
                reader.onload = e => this.imageSrc = reader.result;

                reader.readAsDataURL(file);
                this.disparaitreimage = 'block';
                this.filevalue = file;

                const url1 = this.constance.dns.concat('/uploads/uploadScript.php');
                let formData: FormData = new FormData();
                formData.append('photostatus', this.filevalue);
                this.httpClient
                    .post(url1, formData)
                    .subscribe(
                        (response) => {

                        },
                        (error) => {
                            console.log('Erreur ! : ' + error);
                        }
                    );
            }

        } else {
            this.openSnackBar('Veuillez choisir une image', 'erreur');
        }
	}

    onpenFileBrowser(event: any) {
        event.preventDefault();
        let element: HTMLElement = document.getElementById('tenantPhotoId') as HTMLElement;
        element.click();
    }



    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
        this.messagepublicsubscription.unsubscribe();
    }

    onSubmitForm() {
        const formvalue = this.messagepublicform.value;
        const problematique = formvalue['problematique'];

        let formData: FormData = new FormData();
        formData.append('photostatus', this.filevalue);
        /*let formData1: FormData = new FormData();
        formData1.append('ID',);
        formData1.append('libelle',);
        formData1.append('libelle',);*/

        /*this.httpClient
            .post(url1, formData)
            .subscribe(
                (response) => {

                },
                (error) => {
                    console.log('Erreur ! : ' + error);
                }
            );*/
    }

    scroll = (): void => {
        this.block_boite_de_dialogue = 'none';
    }

    showItems() {
        this.fabTogglerState = 'active';
        this.buttons = this.fabButtons;
    }

    hideItems() {
        this.fabTogglerState = 'inactive';
        this.buttons = [];
    }

    onToggleFab() {
        this.buttons.length ? this.hideItems() : this.showItems();
    }

}




