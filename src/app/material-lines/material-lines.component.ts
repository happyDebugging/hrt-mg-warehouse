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

  loggedInUserId = '';
  isUserLoggedIn = false;

  loggedInUser = {
    Id: '',
    UserId: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Permissions: ''
  };

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
    ExpiryDate: '',
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
    ExpiryDate: '',
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
    ExpiryDate: '',
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

    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserId")));

    //this.GetLoggedInUserDetails();

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));

    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';
  
    this.RemoveMaterialDetailsFromLocalStorage();

    this.GetFMaterialLines();
  }

  // GetLoggedInUserDetails() {

  //   this.dbFunctionService.getUserDetailsFromDb()
  //     .pipe(map((response: any) => {
  //       let markerArray: MaterialLines[] = [];

  //       for (const key in response) {
  //         if (response.hasOwnProperty(key)) {

  //           markerArray.push({ ...response[key], Id: key })

  //         }
  //       }

  //       return markerArray.reverse();
  //     }))
  //     .subscribe(
  //       (res: any) => {
  //         if ((res != null) || (res != undefined)) {
  //           //console.log(res)
  //           const responseData = new Array<Users>(...res);

  //           for (const data of responseData) {

  //             const resObj = new Users();

  //             resObj.Id = data.Id;
  //             resObj.UserId = data.UserId;
  //             resObj.FirstName = data.FirstName;
  //             resObj.LastName = data.LastName;
  //             resObj.Email = data.Email;
  //             resObj.StorageCategory = data.StorageCategory;

  //             if (this.loggedInUserId == resObj.UserId) {
  //               this.loggedInUser = resObj;
  //               //console.log(this.loggedInUser.Id, ' ',this.loggedInUser.FirstName)
  //               localStorage.setItem('loggedInUserName', this.loggedInUser.FirstName + ' ' + this.loggedInUser.LastName);
  //             }
              
  //           }
  //         }
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );

  // }

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
                resObj.ExpiryDate = data.ExpiryDate;
                resObj.IsMaterialDamaged = data.IsMaterialDamaged;
                resObj.IsMaterialDeleted = data.IsMaterialDeleted;
                resObj.CreatedAt = data.CreatedAt;
                resObj.CreatedBy = data.CreatedBy;
                resObj.LastUpdatedAt = data.LastUpdatedAt;
                resObj.LastUpdatedBy = data.LastUpdatedBy;
                resObj.Photo = data.Photo;

                if (data.IsMaterialDamaged) {
                  this.damagedMaterialsList.push(resObj);
                  //console.log(this.damagedMaterialsList)
                } else if (data.IsMaterialDeleted) {
                  this.deletedMaterialsList.push(resObj);
                  //console.log(this.deletedMaterialsList)
                } else {
                  this.availableMaterialsList.push(resObj);
                  //console.log(this.availableMaterialsList)
                }

              }

            }

            this.availableMaterialsList.sort((a, b) => (a.MaterialName > b.MaterialName) ? 1 : -1);
            this.deletedMaterialsList.sort((a, b) => (a.MaterialName > b.MaterialName) ? 1 : -1);
            this.availableMaterialsList.sort((a, b) => (a.MaterialName > b.MaterialName) ? 1 : -1);

          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  SetMaterialDetailsToLocalStorage(material: MaterialLines) {
    localStorage.setItem('materialIdToPreview', material.Id);
    localStorage.setItem('materialNameToPreview', material.MaterialName);
    localStorage.setItem('materialserialNumberToPreview', material.SerialNumber);
    localStorage.setItem('materialQuantityToPreview', material.Quantity.toString());
    localStorage.setItem('materialStorageCategoryToPreview', material.StorageCategory);
    localStorage.setItem('materialStoringPlaceToPreview', material.StoringPlace);
    localStorage.setItem('materialStoredNearRepeaterToPreview', material.StoredNearRepeater);
    localStorage.setItem('materialBorrowedToToPreview', material.BorrowedTo);
    localStorage.setItem('materialBorrowedAtToPreview', material.BorrowedAt);
    localStorage.setItem('materialExpiryDateToPreview', material.ExpiryDate);
    localStorage.setItem('isMaterialDamagedToPreview', material.IsMaterialDamaged.toString());
    localStorage.setItem('isMaterialDeletedToPreview', material.IsMaterialDeleted.toString());
    localStorage.setItem('CreatedAtToPreview', material.CreatedAt);
    localStorage.setItem('CreatedByToPreview', material.CreatedBy);
    localStorage.setItem('LastUpdatedAtToPreview', material.LastUpdatedAt);
    localStorage.setItem('LastUpdatedByToPreview', material.LastUpdatedBy);
    localStorage.setItem('materialPhotoToPreview', material.Photo);
  }

  RemoveMaterialDetailsFromLocalStorage() {
    localStorage.removeItem('materialIdToPreview');
    localStorage.removeItem('materialNameToPreview');
    localStorage.removeItem('materialserialNumberToPreview');
    localStorage.removeItem('materialQuantityToPreview');
    localStorage.removeItem('materialStorageCategoryToPreview');
    localStorage.removeItem('materialStoringPlaceToPreview');
    localStorage.removeItem('materialStoredNearRepeaterToPreview');
    localStorage.removeItem('materialBorrowedToToPreview');
    localStorage.removeItem('materialBorrowedAtToPreview');
    localStorage.removeItem('materialExpiryDateToPreview');
    localStorage.removeItem('isMaterialDamagedToPreview');
    localStorage.removeItem('isMaterialDeletedToPreview');
    localStorage.removeItem('CreatedAtToPreview');
    localStorage.removeItem('CreatedByToPreview');
    localStorage.removeItem('LastUpdatedAtToPreview');
    localStorage.removeItem('LastUpdatedByToPreview');
    localStorage.removeItem('materialPhotoToPreview');
  }

  ngOnDestroy() {

    if (this.getMaterialLines && !this.getMaterialLines.closed) {
      this.getMaterialLines.unsubscribe();
    }

  }

}
