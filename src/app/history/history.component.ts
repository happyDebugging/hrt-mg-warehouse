import { Component } from '@angular/core';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { map, Subscription } from 'rxjs';
import { HistoryLines } from '../shared/models/history-lines.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {

  historyLinesList = [{
    Id: '',
    Date: '',
    ActionType: '',
    MaterialName: '',
    SerialNumber: '',
    Responsible: ''
  }];

  getHistoryLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

  }

  GetHistoryLines() {
    this.getHistoryLines = this.dbFunctionService.getMaterialLinesFromDb()
      .pipe(map((response: any) => {
        let markerArray: HistoryLines[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {

            markerArray.push({ ...response[key], Id: key })

          }
        }

        return markerArray.reverse();

      }))
      .subscribe(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            //console.log(res)
            const responseData = new Array<HistoryLines>(...res);

            for (const data of responseData) {

              const resObj = new HistoryLines();

              resObj.Id = data.Id;
              resObj.Date = data.Date;
              resObj.ActionType = data.ActionType;
              resObj.MaterialName = data.MaterialName;
              resObj.SerialNumber = data.SerialNumber;
              resObj.Responsible = data.Responsible;
              
              this.historyLinesList.push(resObj);

            }

            this.historyLinesList.reverse();

          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  ngOnDestroy() {

    if (this.getHistoryLines && !this.getHistoryLines.closed) {
      this.getHistoryLines.unsubscribe();
    }

  }

}
