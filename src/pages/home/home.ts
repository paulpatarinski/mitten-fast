import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { WeightRecord } from '../../app/models/record';
import { WeightRecordService } from '../../app/services/weightRecordService';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private storage: Storage, private weightRecordService: WeightRecordService, private camera: Camera, private androidPermissions: AndroidPermissions) {
    this.weightInputControl = new FormControl();
  }

  private currentlySelectedDate: Date;

  weightInputControl: FormControl;
  startDate: Date;
  selectedRecord: WeightRecord;
  newWeightValue: number;

  ionViewDidLoad() {
    this.currentlySelectedDate = new Date();

    this.weightRecordService.getWeightRecordOrDefault(this.currentlySelectedDate)
      .then((record) => {
        this.selectedRecord = record;
        this.newWeightValue = record.weight;
      });

    this.storage.get('startDate').then((startDate) => {
      this.startDate = startDate;
    });

    this.weightInputControl.valueChanges.debounceTime(700).subscribe((newWeight) => {
      if (this.selectedRecord.weight !== newWeight)
        this.setWeight(this.selectedRecord, newWeight)
    });
  }

  private setWeight(existingRecord, newWeight) {
    this.selectedRecord = { ...existingRecord, weight: newWeight };
    return this.weightRecordService.insertOrUpdateWeightRecord(this.selectedRecord);
  }

  private verifyHasCameraPermission() {
    return this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => result.hasPermission,
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
  }

  takePhoto(existingRecord) {
    this.verifyHasCameraPermission().then(() => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
        correctOrientation: true,
        allowEdit: true
      };

      this.camera.getPicture(options).then((imageData) => {
        this.selectedRecord = { ...existingRecord, img: imageData };

        return this.weightRecordService.insertOrUpdateWeightRecord(this.selectedRecord);
      }, (err) => {
        // Handle error
        console.log('ERROR LOADING IMAGE');
        console.log(err);
      });
    });
  }

  getDaysSinceFastStart(currentDate, startDate): number {
    const currentDateMoment = moment(currentDate);
    const startDateMoment = moment(startDate);
    return currentDateMoment.diff(startDateMoment, 'days') + 1;
  }

  isOnStartDay() {
    if (!this.currentlySelectedDate)
      return false;

    const currentlySelectedDateMoment = moment(this.currentlySelectedDate);
    const startDateMoment = moment(this.startDate);

    return currentlySelectedDateMoment.diff(startDateMoment, 'days') === 0;
  }

  isOnLatestDay() {
    if (!this.currentlySelectedDate)
      return false;

    const currentlySelectedDateMoment = moment(this.currentlySelectedDate);
    const todayMoment = moment(new Date());

    return currentlySelectedDateMoment.diff(todayMoment, 'days') === 0;
  }

  navDay(back) {
    const currentlySelectedDateMoment = moment(this.currentlySelectedDate);
    const newSelectedDate = (back ? currentlySelectedDateMoment.subtract(1, 'day') : currentlySelectedDateMoment.add(1, 'day')).toDate()

    this.currentlySelectedDate = newSelectedDate;

    return this.weightRecordService.getWeightRecordOrDefault(newSelectedDate).then((record) => {
      this.selectedRecord = record;
      this.newWeightValue = record.weight;
    });
  }
}