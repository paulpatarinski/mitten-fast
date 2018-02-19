import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@Component({ selector: 'page-welcome', templateUrl: 'welcome.html' })
export class WelcomePage {

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, private storage: Storage) { }

  selectedStartDate: Date = new Date();

  startClicked() {
    this
      .storage
      .set('startDate', moment(this.selectedStartDate).toDate())
      .then(() => {
        this
          .navCtrl
          .push(HomePage)
          .then(() => {
            // first we find the index of the current view controller:
            const index = this.viewCtrl.index;
            // then we remove it from the navigation stack
            this.navCtrl.remove(index);
          });
      });
  }
}