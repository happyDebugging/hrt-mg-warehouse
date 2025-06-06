import { Component } from '@angular/core';
import { MaterialLines } from '../shared/models/material-lines.model';
import { map, Subscription } from 'rxjs';
import { DbFunctionService } from '../shared/services/db-functions.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate } from '@angular/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
pdfMake.vfs = pdfFonts.vfs;

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

    //this.getMaterialLines = 
    this.dbFunctionService.getMaterialLinesFromDb()
      // .pipe(map((response: any) => {
      //   let markerArray: MaterialLines[] = [];

      //   for (const key in response) {
      //     if (response.hasOwnProperty(key)) {

      //       markerArray.push({ ...response[key], Id: key })

      //     }
      //   }

      //   return markerArray.reverse();

      // }))
      //.subscribe(
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)
            //const responseData = new Array<MaterialLines>(res);

            for (const data of res) {

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
                } else if (data.AvailableMaterialQuantity > 0 && data.DamagedMaterialQuantity > 0) {
                  //resObj.Quantity = data.AvailableMaterialQuantity;
                  this.availableMaterialsList.push(resObj);
                } else if (data.AvailableMaterialQuantity > 0 && data.DeletedMaterialQuantity > 0) {
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


  ExportMaterialDetailsToPDF() {

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape', 
      header: function(currentPage, pageCount) {
        return [
          { text: 'Αποθήκη ΕΟΔ Μαγνησίας', alignment: 'right', fontSize: 12, color: 'grey', margin: [480, 10, 40, 0] } // Right side text
        ];
      },
      footer: function(currentPage, pageCount) {
        return {
          text: `Σελίδα ${currentPage}/${pageCount}`,
          alignment: 'center',
          fontSize: 10,
          color: 'grey',
          margin: [0, 10, 0, 0]
        };
      },
      content: [
        { text: this.storageCategoryDescription, style: 'header', fontSize: 15, color: '#154c79', bold: true },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        { text: 'Διαθέσιμα Υλικά', style: 'header', fontSize: 13, color: '#063970' },
        { text: ' ', style: 'header' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [350, 110, 50, 120, 70],
            body: [
              ['Όνομα', 'Σειριακός', 'Τεμάχια', 'Θέση', 'Λήξη'],
              ...this.availableMaterialsList.map(item => [item.MaterialName, item.SerialNumber, item.AvailableMaterialQuantity, (item.StoringPlace!='borrowed') ? this.ConvertStoringPlaceValueToDescription(item.StoringPlace) : (this.ConvertStoringPlaceValueToDescription(item.StoringPlace)+': '+((item.StoringPlace=='borrowed') ? item.BorrowedTo : '')), (item.ExpiryDate!=null && item.ExpiryDate!='undefined' && item.ExpiryDate!='null') ? item.ExpiryDate.toString() : ''])
            ]
          }
        },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        { text: 'Υλικά σε Βλάβη', style: 'header', fontSize: 13, color: '#063970' },
        { text: ' ', style: 'header' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [350, 110, 50, 120, 70],
            body: [
              ['Όνομα', 'Σειριακός', 'Τεμάχια', 'Θέση', 'Λήξη'],
              ...this.damagedMaterialsList.map(item => [item.MaterialName, item.SerialNumber, item.DamagedMaterialQuantity, (item.StoringPlace!='borrowed') ? this.ConvertStoringPlaceValueToDescription(item.StoringPlace) : this.ConvertStoringPlaceValueToDescription(item.StoringPlace)+': '+((item.StoringPlace=='borrowed') ? item.BorrowedTo : ''), (item.ExpiryDate!=null && item.ExpiryDate!='undefined' && item.ExpiryDate!='null') ? item.ExpiryDate.toString() : ''])
            ]
          }
        },
        { text: ' ', style: 'header' },
        { text: ' ', style: 'header' },
        { text: 'Διαγραμμένα Υλικά', style: 'header', fontSize: 13, color: '#063970' },
        { text: ' ', style: 'header' },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: [350, 110, 50, 120, 70],
            body: [
              ['Όνομα', 'Σειριακός', 'Τεμάχια', 'Θέση', 'Λήξη'],
              ...this.deletedMaterialsList.map(item => [item.MaterialName, item.SerialNumber, item.DeletedMaterialQuantity, (item.StoringPlace!='borrowed') ? this.ConvertStoringPlaceValueToDescription(item.StoringPlace) : this.ConvertStoringPlaceValueToDescription(item.StoringPlace)+': '+((item.StoringPlace=='borrowed') ? item.BorrowedTo : ''), (item.ExpiryDate!=null && item.ExpiryDate!='undefined' && item.ExpiryDate!='null') ? item.ExpiryDate.toString() : ''])
            ]
          }
        }
      ]
    };

    pdfMake.createPdf(docDefinition).download(this.storageCategory + '_' + formatDate(Date.now(), 'ddMMyy_hhmmss', 'en_US') + '.pdf');
  }

  ConvertStoringPlaceValueToDescription(storingPlace: string) {

    let storingPlaceDescription = '';

    if (storingPlace == 'warehouse') storingPlaceDescription = 'Αποθήκη';
    else if (storingPlace == 'kepix') storingPlaceDescription = 'Κ.ΕΠΙΧ.';
    else if (storingPlace == 'mountain_training_center') storingPlaceDescription = 'Εκπαιδευτικό Κέντρο Ορεινής';
    else if (storingPlace == 'boat') storingPlaceDescription = 'Σκάφος';
    else if (storingPlace == 'tys') storingPlaceDescription = 'Κτίρια Τ.Υ.Σ.';
    else if (storingPlace == 'repeater_Pelion') storingPlaceDescription = 'Αναμεταδότης Πηλίου';
    else if (storingPlace == 'repeater_Dimini') storingPlaceDescription = 'Αναμεταδότης Διμηνίου';
    else if (storingPlace == 'repeater_Argalasti') storingPlaceDescription = 'Αναμεταδότης Αργαλαστής';
    else if (storingPlace == 'repeater_portable') storingPlaceDescription = 'Αναμεταδότης Φορητός';
    else if (storingPlace == 'borrowed') storingPlaceDescription = 'Σε δανεισμό';

    return storingPlaceDescription;
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
