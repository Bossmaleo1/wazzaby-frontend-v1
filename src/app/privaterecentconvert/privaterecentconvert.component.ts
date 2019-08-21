import {Component, Input, OnInit} from '@angular/core';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';
import { BoshClient, $build } from 'xmpp-bosh-client/browser';

@Component({
  selector: 'app-privaterecentconvert',
  templateUrl: './privaterecentconvert.component.html',
  styleUrls: ['./privaterecentconvert.component.scss']
})
export class PrivaterecentconvertComponent implements OnInit {

    @Input() id: number;
    @Input() name: string;
    @Input() user_photo: string;
    @Input() indexOfConvert: number;

  constructor(private privaterecentconvertservices: PrivateRecentconvertServices) { }

  ngOnInit() {
      const client = new BoshClient('admin', 'maleo9393', 'localhost');
      client.on("error", (e) => {
          console.log("Error event");
          console.log(e);
      });

      client.on("online", () => {
          console.log("Connected successfully");
      });

      client.on("ping", () => {
          console.log(`Ping received at ${new Date()}`);
      });

      client.on("stanza", (stanza) => {
          console.log(`Stanza received at ${new Date()}`);
          console.log(stanza);
      });

      client.on("offline", () => {
          console.log("Disconnected/Offline");
      });

      //client.connect();
  }

}
