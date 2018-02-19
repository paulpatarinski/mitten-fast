import { Injectable } from '@angular/core';
import { WeightRecord } from '../models/record';
import { Storage } from '@ionic/storage';
import moment from 'moment';

@Injectable()
export class WeightRecordService {
    constructor(private storage: Storage) {
    }

    private weightRecords: Array<WeightRecord>;
    private WEIGHT_RECORDS_KEY: string = 'weightRecords';

    private loadWeightRecords(): Promise<Array<WeightRecord>> {
        if (this.weightRecords)
            return new Promise((res, rej) => {
                res(this.weightRecords);
            });

        return this.storage.get(this.WEIGHT_RECORDS_KEY).then((weightRecords) => {
            this.weightRecords = weightRecords;
            return this.weightRecords;
        });
    }

    getWeightRecordOrDefault(createdDate: Date): Promise<WeightRecord> {
        const dateFormatted = this.getShortDate(createdDate);
        const defaultWeightRecord: WeightRecord = {
            dateFormatted: dateFormatted,
            createdDate: createdDate,
            weight: null,
            img: null
        };

        return this.loadWeightRecords().then((weightRecords: Array<WeightRecord>) => {
            if (!weightRecords)
                return defaultWeightRecord;

            var existingRecord = weightRecords.find(c => c.dateFormatted === dateFormatted);

            return existingRecord ? existingRecord : defaultWeightRecord;
        });
    }

    private getShortDate(date: Date): string {
        return moment(date).format("MM-DD-YYYY");
    }

    insertOrUpdateWeightRecord(record: WeightRecord) {
        return this.loadWeightRecords().then((existingWeightRecords) => {
            let newWeightRecords = existingWeightRecords;

            //No records exist
            if (!newWeightRecords) {
                newWeightRecords = [record];
                console.log('Adding new array & record ');
                console.log(newWeightRecords);
            } else {
                const existingRecordIndex = newWeightRecords.findIndex(c => c.dateFormatted === record.dateFormatted);

                //Records exist but this record does not
                if (existingRecordIndex === -1) {
                    console.log('Adding to existing array')
                    newWeightRecords.push(record);
                } else {
                    console.log('Updating existing');
                    newWeightRecords[existingRecordIndex] = record;
                }
            }

            this.weightRecords = newWeightRecords;
            return this.storage.set(this.WEIGHT_RECORDS_KEY, newWeightRecords);
        })
    }
} 