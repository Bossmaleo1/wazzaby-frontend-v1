import { Component, OnInit } from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {PublicCommentsServices} from '../Services/public.comments.services';

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


  constructor(private publicconvert: PublicConvertServices, private route: ActivatedRoute, private  router: Router, private authService: AuthService, private publiccomments: PublicCommentsServices) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.name = this.publicconvert.getPublicConversById(+id).name;
    this.updated = this.publicconvert.getPublicConversById(+id).updated;
    this.user_photo = this.publicconvert.getPublicConversById(+id).user_photo;
    this.status_photo = this.publicconvert.getPublicConversById(+id).status_photo;
    this.status_text_content = this.publicconvert.getPublicConversById(+id).status_text_content;
    this.etat_photo_status = this.publicconvert.getPublicConversById(+id).etat_photo_status;

      this.comments = this.publiccomments.Comments;
}

    OnBack() {
        this.router.navigate(['home']);
    }
}
