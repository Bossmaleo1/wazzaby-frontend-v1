import {Component, Input, OnInit} from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';

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
    @Input() indexOfConvert: number;

  constructor(private publicconvert: PublicConvertServices) { }

  ngOnInit() {
  }

  OnIntervention(id: number) {
      /*console.log('id est : '+id);*/
  }



}
