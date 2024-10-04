import { Component } from '@angular/core';
import { MaterialLines } from '../shared/models/material-lines.model';
import { map, Subscription } from 'rxjs';
import { DbFunctionService } from '../shared/services/db-functions.service';

@Component({
  selector: 'app-material-lines',
  templateUrl: './material-lines.component.html',
  styleUrl: './material-lines.component.css'
})
export class MaterialLinesComponent {

  storageCategory = '';
  storageCategoryDescription = '';
  materialLines = [];

  availableMaterialsList = [{
    Id: '',
    MaterialName: '',
    SerialNumber: '',
    Quantity: 0,
    StorageCategory: '',
    StoringPlace: '',
    StoredNearRepeater: '',
    BorrowedTo: '',
    BorrowedAt: '',
    IsMaterialDamaged: false,
    IsMaterialDeleted: false,
    CreatedAt: '',
    CreatedBy: '',
    LastUpdatedAt: '',
    LastUpdatedBy: '',
    Photo: ''
  }];

  damagedMaterialsList = [{
    Id: '',
    MaterialName: '',
    SerialNumber: '',
    Quantity: 0,
    StorageCategory: '',
    StoringPlace: '',
    StoredNearRepeater: '',
    BorrowedTo: '',
    BorrowedAt: '',
    IsMaterialDamaged: false,
    IsMaterialDeleted: false,
    CreatedAt: '',
    CreatedBy: '',
    LastUpdatedAt: '',
    LastUpdatedBy: '',
    Photo: ''
  }];

  deletedMaterialsList = [{
    Id: '',
    MaterialName: '',
    SerialNumber: '',
    Quantity: 0,
    StorageCategory: '',
    StoringPlace: '',
    StoredNearRepeater: '',
    BorrowedTo: '',
    BorrowedAt: '',
    IsMaterialDamaged: false,
    IsMaterialDeleted: false,
    CreatedAt: '',
    CreatedBy: '',
    LastUpdatedAt: '',
    LastUpdatedBy: '',
    Photo: ''
  }];

  getMaterialLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));

    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';
  
    this.GetFMaterialLines();
  }

  GetFMaterialLines() {
    this.availableMaterialsList = [];
    this.damagedMaterialsList = [];
    this.deletedMaterialsList = [];

    this.getMaterialLines = this.dbFunctionService.getMaterialLinesFromDb()
      .pipe(map((response: any) => {
        let markerArray: MaterialLines[] = [];

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
            const responseData = new Array<MaterialLines>(...res);

            for (const data of responseData) {
              
              if (data.StorageCategory == this.storageCategoryDescription) {

                const resObj = new MaterialLines();

                resObj.Id = data.Id;
                resObj.MaterialName = data.MaterialName;
                resObj.SerialNumber = data.SerialNumber;
                resObj.Quantity = data.Quantity;
                resObj.StorageCategory = data.StorageCategory;
                resObj.StoringPlace = data.StoringPlace;
                resObj.StoredNearRepeater = data.StoredNearRepeater;//
                resObj.BorrowedTo = data.BorrowedTo;
                resObj.BorrowedAt = data.BorrowedAt;
                resObj.IsMaterialDamaged = data.IsMaterialDamaged;
                resObj.IsMaterialDeleted = data.IsMaterialDeleted;
                resObj.CreatedAt = data.CreatedAt;
                resObj.CreatedBy = data.CreatedBy;
                resObj.LastUpdatedAt = data.LastUpdatedAt;
                resObj.LastUpdatedBy = data.LastUpdatedBy;
                resObj.Photo = data.Photo;

                if (data.IsMaterialDamaged) {
                  this.damagedMaterialsList.push(resObj);
                  console.log(this.damagedMaterialsList)
                } else if (data.IsMaterialDeleted) {
                  this.deletedMaterialsList.push(resObj);
                  console.log(this.deletedMaterialsList)
                } else {
                  this.availableMaterialsList.push(resObj);
                  console.log(this.availableMaterialsList)
                }

              }

            }

          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  ngOnDestroy() {

    if (this.getMaterialLines && !this.getMaterialLines.closed) {
      this.getMaterialLines.unsubscribe();
    }

  }

}
