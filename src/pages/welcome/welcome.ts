import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import moment from 'moment';

@Component({ selector: 'page-welcome', templateUrl: 'welcome.html' })
export class WelcomePage {

  constructor(public navCtrl: NavController, private storage: Storage) { }

  selectedStartDate: Date = new Date();

  startClicked() {
    this
      .storage
      .set('startDate', moment(this.selectedStartDate).toDate())
      .then(() => {
        this
          .navCtrl
          .push(HomePage);
      });
  }
}