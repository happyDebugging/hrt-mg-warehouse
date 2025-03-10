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
    AvailableMaterialQuantity: 0,
    StorageCategory: '',
    StoringPlace: '',
    StoredNearRepeater: '',
    BorrowedTo: '',
    BorrowedAt: '',
    BorrowedMaterialQuantity: 0,
    ExpiryDate: '',
    IsMaterialDamaged: false,
    DamagedMaterialQuantity: 0,
    IsMaterialDeleted: false,
    DeletedMaterialQuantity: 0,
    IsMaterialConsumable: false,
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
    AvailableMaterialQuantity: 0,
    StorageCategory: '',
    StoringPlace: '',
    StoredNearRepeater: '',
    BorrowedTo: '',
    BorrowedAt: '',
    BorrowedMaterialQuantity: 0,
    ExpiryDate: '',
    IsMaterialDamaged: false,
    DamagedMaterialQuantity: 0,
    IsMaterialDeleted: false,
    DeletedMaterialQuantity: 0,
    IsMaterialConsumable: false,
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
    AvailableMaterialQuantity: 0,
    StorageCategory: '',
    StoringPlace: '',
    StoredNearRepeater: '',
    BorrowedTo: '',
    BorrowedAt: '',
    BorrowedMaterialQuantity: 0,
    ExpiryDate: '',
    IsMaterialDamaged: false,
    DamagedMaterialQuantity: 0,
    IsMaterialDeleted: false,
    DeletedMaterialQuantity: 0,
    IsMaterialConsumable: false,
    CreatedAt: '',
    CreatedBy: '',
    LastUpdatedAt: '',
    LastUpdatedBy: '',
    Photo: ''
  }];

  getMaterialLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));

    //this.GetLoggedInUserDetails();

    this.storageCategory = JSON.parse(JSON.stringify(sessionStorage.getItem('storageCategory')));

    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';
  
    this.RemoveMaterialDetailsFromsessionStorage();

    this.GetMaterialLines();
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
  //               sessionStorage.setItem('loggedInUserName', this.loggedInUser.FirstName + ' ' + this.loggedInUser.LastName);
  //             }
              
  //           }
  //         }
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );

  // }

  GetMaterialLines() {
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
                resObj.AvailableMaterialQuantity = data.AvailableMaterialQuantity;
                resObj.StorageCategory = data.StorageCategory;
                resObj.StoringPlace = data.StoringPlace;
                resObj.StoredNearRepeater = data.StoredNearRepeater;//
                resObj.BorrowedTo = data.BorrowedTo;
                resObj.BorrowedAt = data.BorrowedAt;
                resObj.BorrowedMaterialQuantity = data.BorrowedMaterialQuantity;
                resObj.ExpiryDate = data.ExpiryDate;
                resObj.IsMaterialDamaged = data.IsMaterialDamaged;
                resObj.DamagedMaterialQuantity = data.DamagedMaterialQuantity;
                resObj.IsMaterialDeleted = data.IsMaterialDeleted;
                resObj.DeletedMaterialQuantity = data.DeletedMaterialQuantity;
                resObj.IsMaterialConsumable = data.IsMaterialConsumable;
                resObj.CreatedAt = data.CreatedAt;
                resObj.CreatedBy = data.CreatedBy;
                resObj.LastUpdatedAt = data.LastUpdatedAt;
                resObj.LastUpdatedBy = data.LastUpdatedBy;
                resObj.Photo = data.Photo;

                if (data.IsMaterialDamaged) {
                  //resObj.Quantity = data.DamagedMaterialQuantity;
                  this.damagedMaterialsList.push(resObj);
                  //console.log(this.damagedMaterialsList)
                } 
                if (data.IsMaterialDeleted) {
                  //resObj.Quantity = data.DeletedMaterialQuantity;
                  this.deletedMaterialsList.push(resObj);
                  //console.log(this.deletedMaterialsList)
                } 
                if (!data.IsMaterialDamaged && !data.IsMaterialDeleted) {
                  //resObj.Quantity = data.AvailableMaterialQuantity;
                  this.availableMaterialsList.push(resObj);
                  //console.log(this.availableMaterialsList)
                } else if (data.AvailableMaterialQuantity>0 && data.DamagedMaterialQuantity>0) {
                  //resObj.Quantity = data.AvailableMaterialQuantity;
                  this.availableMaterialsList.push(resObj);
                } else if (data.AvailableMaterialQuantity>0 && data.DeletedMaterialQuantity>0) {
                  //resObj.Quantity = data.AvailableMaterialQuantity;
                  this.availableMaterialsList.push(resObj);
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

  SetAvailableMaterialDetailsTosessionStorage(material: MaterialLines) {
    sessionStorage.setItem('materialState', 'available');

    sessionStorage.setItem('materialIdToPreview', material.Id);
    sessionStorage.setItem('materialNameToPreview', material.MaterialName);
    sessionStorage.setItem('materialserialNumberToPreview', material.SerialNumber);
    sessionStorage.setItem('materialQuantityToPreview', material.AvailableMaterialQuantity.toString()); // material.Quantity.toString()
    sessionStorage.setItem('availableMaterialQuantityToPreview', material.AvailableMaterialQuantity.toString());
    sessionStorage.setItem('materialStorageCategoryToPreview', material.StorageCategory);
    sessionStorage.setItem('materialStoringPlaceToPreview', material.StoringPlace);
    sessionStorage.setItem('materialStoredNearRepeaterToPreview', material.StoredNearRepeater);
    sessionStorage.setItem('materialBorrowedToToPreview', material.BorrowedTo);
    sessionStorage.setItem('materialBorrowedAtToPreview', material.BorrowedAt);
    sessionStorage.setItem('materialBorrowedQuantityToPreview', material.BorrowedMaterialQuantity.toString());
    sessionStorage.setItem('materialExpiryDateToPreview', material.ExpiryDate);
    sessionStorage.setItem('isMaterialDamagedToPreview', material.IsMaterialDamaged.toString());
    sessionStorage.setItem('damagedMaterialQuantityToPreview', material.DamagedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialDeletedToPreview', material.IsMaterialDeleted.toString());
    sessionStorage.setItem('deletedMaterialQuantityToPreview', material.DeletedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialConsumableToPreview', material.IsMaterialConsumable.toString());
    sessionStorage.setItem('CreatedAtToPreview', material.CreatedAt);
    sessionStorage.setItem('CreatedByToPreview', material.CreatedBy);
    sessionStorage.setItem('LastUpdatedAtToPreview', material.LastUpdatedAt);
    sessionStorage.setItem('LastUpdatedByToPreview', material.LastUpdatedBy);
    sessionStorage.setItem('materialPhotoToPreview', material.Photo);
  }

  SetDamagedMaterialDetailsTosessionStorage(material: MaterialLines) {
    sessionStorage.setItem('materialState', 'damaged');

    sessionStorage.setItem('materialIdToPreview', material.Id);
    sessionStorage.setItem('materialNameToPreview', material.MaterialName);
    sessionStorage.setItem('materialserialNumberToPreview', material.SerialNumber);
    sessionStorage.setItem('materialQuantityToPreview', material.DamagedMaterialQuantity.toString()); //material.Quantity.toString()
    sessionStorage.setItem('availableMaterialQuantityToPreview', material.AvailableMaterialQuantity.toString());
    sessionStorage.setItem('materialStorageCategoryToPreview', material.StorageCategory);
    sessionStorage.setItem('materialStoringPlaceToPreview', material.StoringPlace);
    sessionStorage.setItem('materialStoredNearRepeaterToPreview', material.StoredNearRepeater);
    sessionStorage.setItem('materialBorrowedToToPreview', material.BorrowedTo);
    sessionStorage.setItem('materialBorrowedAtToPreview', material.BorrowedAt);
    sessionStorage.setItem('materialBorrowedQuantityToPreview', material.BorrowedMaterialQuantity.toString());
    sessionStorage.setItem('materialExpiryDateToPreview', material.ExpiryDate);
    sessionStorage.setItem('isMaterialDamagedToPreview', material.IsMaterialDamaged.toString());
    sessionStorage.setItem('damagedMaterialQuantityToPreview', material.DamagedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialDeletedToPreview', material.IsMaterialDeleted.toString());
    sessionStorage.setItem('deletedMaterialQuantityToPreview', material.DeletedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialConsumableToPreview', material.IsMaterialConsumable.toString());
    sessionStorage.setItem('CreatedAtToPreview', material.CreatedAt);
    sessionStorage.setItem('CreatedByToPreview', material.CreatedBy);
    sessionStorage.setItem('LastUpdatedAtToPreview', material.LastUpdatedAt);
    sessionStorage.setItem('LastUpdatedByToPreview', material.LastUpdatedBy);
    sessionStorage.setItem('materialPhotoToPreview', material.Photo);
  }

  SetDeletedMaterialDetailsTosessionStorage(material: MaterialLines) {
    sessionStorage.setItem('materialState', 'deleted');

    sessionStorage.setItem('materialIdToPreview', material.Id);
    sessionStorage.setItem('materialNameToPreview', material.MaterialName);
    sessionStorage.setItem('materialserialNumberToPreview', material.SerialNumber);
    sessionStorage.setItem('materialQuantityToPreview', material.DeletedMaterialQuantity.toString()); // material.Quantity.toString()
    sessionStorage.setItem('availableMaterialQuantityToPreview', material.AvailableMaterialQuantity.toString());
    sessionStorage.setItem('materialStorageCategoryToPreview', material.StorageCategory);
    sessionStorage.setItem('materialStoringPlaceToPreview', material.StoringPlace);
    sessionStorage.setItem('materialStoredNearRepeaterToPreview', material.StoredNearRepeater);
    sessionStorage.setItem('materialBorrowedToToPreview', material.BorrowedTo);
    sessionStorage.setItem('materialBorrowedAtToPreview', material.BorrowedAt);
    sessionStorage.setItem('materialBorrowedQuantityToPreview', material.BorrowedMaterialQuantity.toString());
    sessionStorage.setItem('materialExpiryDateToPreview', material.ExpiryDate);
    sessionStorage.setItem('isMaterialDamagedToPreview', material.IsMaterialDamaged.toString());
    sessionStorage.setItem('damagedMaterialQuantityToPreview', material.DamagedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialDeletedToPreview', material.IsMaterialDeleted.toString());
    sessionStorage.setItem('deletedMaterialQuantityToPreview', material.DeletedMaterialQuantity.toString());
    sessionStorage.setItem('isMaterialConsumableToPreview', material.IsMaterialConsumable.toString());
    sessionStorage.setItem('CreatedAtToPreview', material.CreatedAt);
    sessionStorage.setItem('CreatedByToPreview', material.CreatedBy);
    sessionStorage.setItem('LastUpdatedAtToPreview', material.LastUpdatedAt);
    sessionStorage.setItem('LastUpdatedByToPreview', material.LastUpdatedBy);
    sessionStorage.setItem('materialPhotoToPreview', material.Photo);
  }

  RemoveMaterialDetailsFromsessionStorage() {
    sessionStorage.removeItem('materialIdToPreview');
    sessionStorage.removeItem('materialNameToPreview');
    sessionStorage.removeItem('materialserialNumberToPreview');
    sessionStorage.removeItem('materialQuantityToPreview');
    sessionStorage.removeItem('availableMaterialQuantityToPreview');
    sessionStorage.removeItem('materialStorageCategoryToPreview');
    sessionStorage.removeItem('materialStoringPlaceToPreview');
    sessionStorage.removeItem('materialStoredNearRepeaterToPreview');
    sessionStorage.removeItem('materialBorrowedToToPreview');
    sessionStorage.removeItem('materialBorrowedAtToPreview');
    sessionStorage.removeItem('materialBorrowedQuantityToPreview');
    sessionStorage.removeItem('materialExpiryDateToPreview');
    sessionStorage.removeItem('isMaterialDamagedToPreview');
    sessionStorage.removeItem('damagedMaterialQuantityToPreview');
    sessionStorage.removeItem('isMaterialDeletedToPreview');
    sessionStorage.removeItem('deletedMaterialQuantityToPreview');
    sessionStorage.removeItem('isMaterialConsumableToPreview');
    sessionStorage.removeItem('CreatedAtToPreview');
    sessionStorage.removeItem('CreatedByToPreview');
    sessionStorage.removeItem('LastUpdatedAtToPreview');
    sessionStorage.removeItem('LastUpdatedByToPreview');
    sessionStorage.removeItem('materialPhotoToPreview');
  }

  ngOnDestroy() {

    if (this.getMaterialLines && !this.getMaterialLines.closed) {
      this.getMaterialLines.unsubscribe();
    }

  }

}
