import { Component, OnInit } from '@angular/core';
import {DateAdapter, MatSnackBar, PageEvent} from '@angular/material';
import {MyDateAdapter} from '../Services/MyDateAdapter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {AuthService} from '../Services/auth.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-inscript-form',
  templateUrl: './inscript-form.component.html',
  styleUrls: ['./inscript-form.component.scss'],
  providers: [
        {provide: DateAdapter, useClass: MyDateAdapter}
  ]
})
export class InscriptFormComponent implements OnInit {

    isLinear = true;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    afficher_code = false;
    firstform1: any;
    nom: any;
    prenom: any;
    datedenaissance: any;
    sexe: any;
    password: any;

    disparaitreprogressbar = 'none';
    disparaitreallblock = 'block';

    constructor(private _formBuilder: FormBuilder
        , public snackBar: MatSnackBar
        , private authService: AuthService
        , private httpClient: HttpClient
        , private constance: ConstanceService) {}

    ngOnInit() {
        this.initForm();
    }

    OnBack() {

    }

    initForm() {
        this.firstFormGroup = this._formBuilder.group({
            email: ['',  [Validators.required, Validators.email]],
            codevalidation: ['', Validators.required]
        });

        this.secondFormGroup = this._formBuilder.group({
            Nom: ['', Validators.required],
            Prenom: ['', Validators.required],
            date: ['', Validators.required]
        });

        this.thirdFormGroup = this._formBuilder.group({
            sexe: ['', Validators.required],
            password1: ['', Validators.required],
            password2: ['', Validators.required]
        });
    }

    onSubmitfirstForm(stepper: MatStepper) {
        const formValue = this.firstFormGroup.value;
        if (this.afficher_code === false) {
        const url1 = this.constance.dns.concat('/WazzabyApiOthers/send_mail.php?email=').concat(formValue['email']);
       this.httpClient
            .get(url1)
            .subscribe(
                (response) => {
                    this.afficher_code = !this.afficher_code;
                    this.firstform1 = response;
                    console.log(this.firstform1.succes);
                },
                (error) => {
                }
            );
        } else {


            if (this.firstform1.succes === formValue['codevalidation']) {
                //this.openSnackBar('Vous avez inserer le bon mot de passe !!!', 'succes');
                stepper.next();
            } else {
                this.openSnackBar(' Vous avez inserer le mauvais mot de passe !!! ', 'erreur');
            }
        }
    }


    onSubmitSecondForm(stepper: MatStepper) {
        const formValue = this.secondFormGroup.value;
        this.nom = formValue['Nom'];
        this.prenom = formValue['Prenom'];
        this.datedenaissance = formValue['date'];
        stepper.next();
    }

    onSubmitthirdForm(stepper: MatStepper) {
        const formValue = this.thirdFormGroup.value;
        this.sexe = formValue['sexe'];
        this.password = formValue['password1'];
        const password2 = formValue['password2'];

        this.disparaitreprogressbar = 'block';
        this.disparaitreallblock = 'none';
        const date = new Date(this.datedenaissance);
        const moi = +date.getMonth() + 1;
        const jour = date.getDate();
        const annee = +date.getFullYear();
        const anneefinale = annee.toString().concat('-').concat(moi.toString()).concat('-').concat(jour.toString());
        const url = this.constance.dns.concat('/WazzabyApi/public/api/insertUsers?email=').concat(this.firstform1.email).concat('&codedevalidation=').concat(this.firstform1.succes).concat('&nom=').concat(this.nom).concat('&prenom=').concat(this.prenom).concat('&sexe=').concat(this.sexe).concat('&password=').concat(this.password).concat('&date=').concat(anneefinale);
        this.httpClient
            .get(url)
            .subscribe(
                (response) => {
                    this.disparaitreprogressbar = 'none';
                    this.disparaitreallblock = 'block';
                    this.authService.sessions = response;
                    this.openSnackBar(" Votre Inscription s'est effectuee avec succes ! ", 'succes');
                    const url1 = this.constance.dns.concat('/WazzabyApiOthers/send_welcome_mail.php?email=').concat(this.firstform1.email).concat('&password=').concat(this.password).concat('&nom=').concat(this.nom).concat('&prenom=').concat(this.prenom).concat('&sexe=').concat(this.sexe);
                    this.httpClient
                        .get(url1)
                        .subscribe(
                            (response1) => {
                                this.afficher_code = !this.afficher_code;
                                this.firstform1 = response1;
                            },
                            (error) => {
                            }
                        );



                },
                (error) => {
                    this.disparaitreprogressbar = 'none';
                    this.disparaitreallblock = 'block';
                    this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                }
            );
    }


    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }


}
