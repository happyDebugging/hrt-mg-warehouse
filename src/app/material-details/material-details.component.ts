import { Component, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { DbFunctionService } from '../shared/services/db-functions.service';
import { MaterialLines } from '../shared/models/material-lines.model';
import { map, Subscription } from 'rxjs';
import * as imageConversion from 'image-conversion';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryLines } from '../shared/models/history-lines.model';

@Component({
  selector: 'app-material-details',
  templateUrl: './material-details.component.html',
  styleUrl: './material-details.component.css',
})
export class MaterialDetailsComponent {

  loggedInUserId = '';
  isUserLoggedIn = false;
  loggedInUserName = '';
  loggedInUserPermissions = '';

  isNewMaterial = false;
  materialState = '';
  materialStateDescription = '';
  isMaterialAvailable = false;
  incorrectQuantityInput = false;

  storageCategory = '';
  storageCategoryDescription = '';
  materialLines = [];
  isNewMaterialLineAdded = false;

  preview = 'photo-file_.png';
  currentFile?: File;

  materialId = '';
  materialName = '';
  materialserialNumber = '';
  hasNoSerialNumber = false;
  materialQuantity = 0;
  materialStorageCategory = '';
  materialStoringPlace = '';
  materialStoredNearRepeater = '';
  materialBorrowedTo = '';
  materialBorrowedAt = '';
  materialExpiryDate = '';
  isMaterialDamaged = false;
  isMaterialDeleted = false;
  CreatedAt = '';
  CreatedBy = '';
  LastUpdatedAt = '';
  LastUpdatedBy = '';
  materialPhoto = '';
  previousMaterialPhoto = '';
  isMaterialConsumable = false;

  availableMaterialQuantity = 0;
  previousAvailableMaterialQuantity = 0;
  isMaterialBorrowed = false;
  materialBorrowedQuantity = 0;
  isAvailableMaterialCheckboxChecked = false;
  isDamagedMaterialCheckboxChecked = false;
  damagedMaterialQuantity = 0;
  previousDamagedMaterialQuantity = 0;
  isDeletedMaterialCheckboxChecked = false;
  deletedMaterialQuantity = 0;
  previousDeletedMaterialQuantity = 0;

  isSaveButtonClicked = false;
  isSaveSuccessfull = false;
  isDeletionSuccessfull = false;

  hasPreviewPhotoChanged = false;
  selectedImageFile: any;

  isMaterialEditEnabled = false;

  tempAvailableMaterialQuantity = 0;
  tempDamagedMaterialQuantity = 0;
  tempDeletedMaterialQuantity = 0;

  @ViewChild('invalidFormWarning') invalidFormWarning: any;
  @ViewChild('exitWarning') exitWarning: any;

  // Firebase web app configuration
  firebaseConfig = {
    apiKey: "AIzaSyAq82tP-XtNICS4oNiS2hKLN2tzElGQF0Q",
    authDomain: "hrt-mg-warehouse.firebaseapp.com",
    databaseURL: "https://hrt-mg-warehouse-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hrt-mg-warehouse",
    storageBucket: "hrt-mg-warehouse.appspot.com",
    messagingSenderId: "814645994356",
    appId: "1:814645994356:web:7efe4746dd371d51338221"
  };

  // Initialize Firebase
  firebaseApp = initializeApp(this.firebaseConfig);

  // Initialize Realtime Database and get a reference to the service
  database = getDatabase(this.firebaseApp);

  // Initialize Cloud Storage and get a reference to the service
  storage = getStorage(this.firebaseApp);
  // Create a storage reference from our storage service
  storageRef = ref(this.storage, 'some-child');


  updateMaterialLines: Subscription = new Subscription;
  postMaterialLines: Subscription = new Subscription;

  constructor(private dbFunctionService: DbFunctionService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUserName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserName")));
    this.loggedInUserPermissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));

    this.storageCategory = JSON.parse(JSON.stringify(sessionStorage.getItem('storageCategory')));
    if (this.storageCategory == 'mountain') this.storageCategoryDescription = 'Τμήμα Ορεινής Διάσωσης';
    else if (this.storageCategory == 'water') this.storageCategoryDescription = 'Τμήμα Υγρού Στοιχείου';
    else if (this.storageCategory == 'disaster') this.storageCategoryDescription = 'Τμήμα Αντιμετώπισης Καταστροφών';
    else if (this.storageCategory == 'firstAid') this.storageCategoryDescription = 'Τμήμα Πρώτων Βοηθειών';
    else if (this.storageCategory == 'communications') this.storageCategoryDescription = 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας';
    else if (this.storageCategory == 'socialCare') this.storageCategoryDescription = 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών';

    this.GetItemDetailsToPreviewFromsessionStorage();

    this.GetMaterialPhotoFromStorage();

  }

  ShowInvalidFormMessage() {
    this.modalService.open(this.invalidFormWarning, { centered: true, size: 'sm', windowClass: 'zindex' });
  }

  ShowExitWarning() {
    this.modalService.open(this.exitWarning, { centered: true, size: 'sm', windowClass: 'zindex' });
  }

  selectFile(event: any) {
    this.preview = '';
    const selectedFiles = event.target.files;
    this.selectedImageFile = selectedFiles;

    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;

          imageConversion.dataURLtoFile(this.preview).then(p => {
            // imageConversion.compressAccurately(p, 300).then(res => {
            imageConversion.compress(p, 0.3).then(res => {
              imageConversion.filetoDataURL(res).then(url => {
                this.preview = url;
              });
            })
          });

        };

        reader.readAsDataURL(this.currentFile);

        this.hasPreviewPhotoChanged = true;
      }
    }
  }

  RadioSelectSerialNumberState(hasNoSerialNumber: boolean) {
    this.hasNoSerialNumber = true;
  }

  SetMaterialAsBorrowed(value: string) {
    if (value == 'borrowed') this.isMaterialBorrowed = true;
    else this.isMaterialBorrowed = false;
  }

  RadioSelectMaterialAvailableState(isMaterialAvailable: boolean) {
    //this.isMaterialDeleted = false;
    //this.isDamagedMaterialCheckboxChecked = false;
    //this.isDeletedMaterialCheckboxChecked = false;
    //this.deletedMaterialQuantity = 0;

    // if (this.isMaterialAvailable == true) {
    //   this.isAvailableMaterialCheckboxChecked = false;
    // } else {
    this.isAvailableMaterialCheckboxChecked = !this.isAvailableMaterialCheckboxChecked;
    // }

    this.isMaterialAvailable = this.isAvailableMaterialCheckboxChecked;
  }

  RadioSelectMaterialDamagedState(isMaterialDamaged: boolean) {
    //this.isMaterialDeleted = false;
    //this.isDeletedMaterialCheckboxChecked = false;
    //this.deletedMaterialQuantity = 0;

    // if (this.isMaterialDamaged == true) {
    //   this.isDamagedMaterialCheckboxChecked = false;
    // } else {
    this.isDamagedMaterialCheckboxChecked = !this.isDamagedMaterialCheckboxChecked;
    // }

    this.isMaterialDamaged = this.isDamagedMaterialCheckboxChecked;
  }

  RadioSelectMaterialDeletedState(isMaterialDamaged: boolean) {
    //this.isMaterialDamaged = false;
    //this.isDamagedMaterialCheckboxChecked = false;
    //this.damagedMaterialQuantity = 0;

    // if (this.isMaterialDeleted == true) {
    //   this.isDeletedMaterialCheckboxChecked = false;
    // } else {
    this.isDeletedMaterialCheckboxChecked = !this.isDeletedMaterialCheckboxChecked;
    // }

    this.isMaterialDeleted = this.isDeletedMaterialCheckboxChecked;

    console.log(this.isMaterialDeleted, ' ', this.isDeletedMaterialCheckboxChecked)

  }

  SelectConsumableMaterialState() {
    this.isMaterialConsumable = !this.isMaterialConsumable;
  }

  EnableMaterialEdit() {
    this.isMaterialEditEnabled = true;
    sessionStorage.setItem('isMaterialEditEnabled', 'true');
  }

  DisableMaterialEdit() {
    this.isMaterialEditEnabled = false;
    sessionStorage.setItem('isMaterialEditEnabled', 'false');
  }

  DecideOnSaveMethod() {
    console.log('this.materialId ' + this.materialId)

    if (this.materialId != '' && this.materialId != null && this.materialId != undefined) {
      this.UpdateMaterialLine();
    } else {
      this.PostMaterialLine();
    }

  }

  UpdateMaterialLine() {
    this.isSaveButtonClicked = true;

    let updatedMaterialLine = new MaterialLines;

    updatedMaterialLine.Id = this.materialId;
    updatedMaterialLine.MaterialName = this.materialName.trim();
    if (!this.hasNoSerialNumber) {
      updatedMaterialLine.SerialNumber = this.materialserialNumber.trim();
    } else {
      updatedMaterialLine.SerialNumber = 'Άνευ';
    }
    updatedMaterialLine.Quantity = this.materialQuantity;

    this.availableMaterialQuantity = this.tempAvailableMaterialQuantity;
    this.damagedMaterialQuantity = this.tempDamagedMaterialQuantity;
    this.deletedMaterialQuantity = this.tempDeletedMaterialQuantity;

    if (this.materialState == 'available') {
      this.availableMaterialQuantity = this.materialQuantity; ////
      this.availableMaterialQuantity = (+this.availableMaterialQuantity) - (+this.damagedMaterialQuantity) - (+this.deletedMaterialQuantity);
      this.damagedMaterialQuantity = (+this.previousDamagedMaterialQuantity) + (+this.damagedMaterialQuantity);
      this.deletedMaterialQuantity = (+this.previousDeletedMaterialQuantity) + (+this.deletedMaterialQuantity);
    } else if (this.materialState == 'damaged') {
      this.damagedMaterialQuantity = this.materialQuantity; ////

      this.damagedMaterialQuantity = (+this.previousDamagedMaterialQuantity) - (+this.availableMaterialQuantity) - (+this.deletedMaterialQuantity);

      this.deletedMaterialQuantity = (+this.previousDeletedMaterialQuantity) + (+this.deletedMaterialQuantity);
      this.availableMaterialQuantity = (+this.previousAvailableMaterialQuantity) + (+this.availableMaterialQuantity);
      if (this.damagedMaterialQuantity == 0) this.isMaterialDamaged = false;

    } else if (this.materialState == 'deleted') {
      this.deletedMaterialQuantity = this.materialQuantity; ////

      this.deletedMaterialQuantity = (+this.previousDeletedMaterialQuantity) - (+this.availableMaterialQuantity) - (+this.damagedMaterialQuantity);

      this.damagedMaterialQuantity = (+this.previousDamagedMaterialQuantity) + (+this.damagedMaterialQuantity);
      this.availableMaterialQuantity = (+this.previousAvailableMaterialQuantity) + (+this.availableMaterialQuantity);
      if (this.deletedMaterialQuantity == 0) this.isMaterialDeleted = false;

    }
    updatedMaterialLine.Quantity = this.materialQuantity;
    updatedMaterialLine.AvailableMaterialQuantity = this.availableMaterialQuantity;
    updatedMaterialLine.StorageCategory = this.storageCategoryDescription;
    updatedMaterialLine.StoringPlace = this.materialStoringPlace;
    updatedMaterialLine.StoredNearRepeater = this.materialStoredNearRepeater;//
    if (!this.isMaterialBorrowed) {
      updatedMaterialLine.BorrowedTo = '';
      updatedMaterialLine.BorrowedAt = '';
      updatedMaterialLine.BorrowedMaterialQuantity = 0;
    } else {
      updatedMaterialLine.BorrowedTo = this.materialBorrowedTo;
      updatedMaterialLine.BorrowedAt = this.materialBorrowedAt;
      updatedMaterialLine.BorrowedMaterialQuantity = this.materialBorrowedQuantity;
    }
    updatedMaterialLine.ExpiryDate = this.materialExpiryDate;
    updatedMaterialLine.IsMaterialDamaged = this.isMaterialDamaged;
    updatedMaterialLine.DamagedMaterialQuantity = this.damagedMaterialQuantity;
    updatedMaterialLine.IsMaterialDeleted = this.isMaterialDeleted;
    updatedMaterialLine.DeletedMaterialQuantity = this.deletedMaterialQuantity;
    updatedMaterialLine.IsMaterialConsumable = this.isMaterialConsumable;
    updatedMaterialLine.CreatedAt = this.CreatedAt;
    updatedMaterialLine.CreatedBy = this.CreatedBy;
    updatedMaterialLine.LastUpdatedAt = Date.now().toString();
    updatedMaterialLine.LastUpdatedBy = this.loggedInUserName; //this.LastUpdatedBy;

    if (this.hasPreviewPhotoChanged) {
      console.log('(this.materialserialNumber)  ' + this.materialserialNumber)
      updatedMaterialLine.Photo = this.storageCategory + '_' + btoa(unescape(encodeURIComponent(updatedMaterialLine.MaterialName)).substring(0, 10)).replaceAll('/', '-') + '_' + this.RemoveSpecialCharacters(this.materialserialNumber) + '_' + Date.now().toString();
      sessionStorage.setItem('materialPhotoToPreview', updatedMaterialLine.Photo);

      // const desertRef = ref(this.storage, this.previousMaterialPhoto);
      // // Delete previous uploaded image
      // deleteObject(desertRef).then(() => {
      //   console.log('File deleted successfully')
      // }).catch((error) => {
      //   console.log(error)
      // });
      this.DeleteMaterialPhotoFromStorage(this.previousMaterialPhoto);

      // this.storageRef = ref(this.storage, updatedMaterialLine.Photo);
      // uploadString(this.storageRef, this.preview, 'data_url').then((snapshot) => {
      //   console.log('Uploaded image!');
      // });
      this.PostMaterialPhotoToStorage(updatedMaterialLine.Photo);

    } else {
      updatedMaterialLine.Photo = this.previousMaterialPhoto;
    }

    //this.updateMaterialLines = 
    this.dbFunctionService.updateMaterialLinesToDb(updatedMaterialLine)
      // .pipe(map((response: any) => {

      //   this.isSaveSuccessfull = true;

      //   setTimeout(() => {
      //     this.isSaveSuccessfull = false;
      //     this.isSaveButtonClicked = false;

      //     let actionType = 'Ενημέρωση υλικού';
      //     this.AddHistoryRecord(updatedMaterialLine.MaterialName, updatedMaterialLine.SerialNumber, actionType);

      //   }, 2000);

      // }))
      // .subscribe(
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)

            this.isSaveSuccessfull = true;

            setTimeout(() => {
              this.isSaveSuccessfull = false;
              this.isSaveButtonClicked = false;

              let actionType = 'Ενημέρωση υλικού';
              this.AddHistoryRecord(updatedMaterialLine.MaterialName, updatedMaterialLine.SerialNumber, actionType);

            }, 2000);

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  PostMaterialLine() {
    this.isSaveButtonClicked = true;

    let materialLine = new MaterialLines;
    console.log(this.materialId)

    this.availableMaterialQuantity = this.tempAvailableMaterialQuantity;
    this.damagedMaterialQuantity = this.tempDamagedMaterialQuantity;
    this.deletedMaterialQuantity = this.tempDeletedMaterialQuantity;

    materialLine.Id = this.materialId;
    materialLine.MaterialName = this.materialName.trim();
    if (!this.hasNoSerialNumber) {
      materialLine.SerialNumber = this.materialserialNumber.trim();
    } else {
      materialLine.SerialNumber = 'Άνευ';
    }
    materialLine.Quantity = this.materialQuantity;
    this.availableMaterialQuantity = (+this.materialQuantity) - (+this.damagedMaterialQuantity) - (+this.deletedMaterialQuantity);
    materialLine.AvailableMaterialQuantity = this.availableMaterialQuantity;
    materialLine.StorageCategory = this.storageCategoryDescription;
    materialLine.StoringPlace = this.materialStoringPlace;
    materialLine.StoredNearRepeater = this.materialStoredNearRepeater;//
    if (!this.isMaterialBorrowed) {
      materialLine.BorrowedTo = '';
      materialLine.BorrowedAt = '';
      materialLine.BorrowedMaterialQuantity = 0;
    } else {
      materialLine.BorrowedTo = this.materialBorrowedTo;
      materialLine.BorrowedAt = this.materialBorrowedAt;
      materialLine.BorrowedMaterialQuantity = this.materialBorrowedQuantity;
    }
    materialLine.ExpiryDate = this.materialExpiryDate;
    materialLine.IsMaterialDamaged = this.isMaterialDamaged;
    if (this.damagedMaterialQuantity == null) materialLine.DamagedMaterialQuantity = 0;
    else materialLine.DamagedMaterialQuantity = this.damagedMaterialQuantity;
    materialLine.IsMaterialDeleted = this.isMaterialDeleted;
    if (this.damagedMaterialQuantity == null) materialLine.DeletedMaterialQuantity = 0;
    else materialLine.DeletedMaterialQuantity = this.deletedMaterialQuantity;
    materialLine.IsMaterialConsumable = this.isMaterialConsumable;
    materialLine.CreatedAt = Date.now().toString();
    materialLine.CreatedBy = this.loggedInUserName; //this.loggedInUserId;
    //materialLine.LastUpdatedAt = this.LastUpdatedAt;
    //materialLine.LastUpdatedBy = this.LastUpdatedBy;
    materialLine.Photo = this.storageCategory + '_' + btoa(unescape(encodeURIComponent(materialLine.MaterialName)).substring(0, 10)).replaceAll('/', '-') + '_' + this.RemoveSpecialCharacters(this.materialserialNumber) + '_' + Date.now().toString(); //this.materialPhoto;

    // this.storageRef = ref(this.storage, materialLine.Photo);
    // uploadString(this.storageRef, this.preview, 'data_url').then((snapshot) => {
    //   console.log('Uploaded image!');
    // });
    this.PostMaterialPhotoToStorage(materialLine.Photo);


    //this.postMaterialLines = 
    this.dbFunctionService.postMaterialLineToDb(materialLine)
      // .pipe(map((response: any) => {

      //   this.isNewMaterialLineAdded = true;

      //   this.isSaveSuccessfull = true;

      //   setTimeout(() => {
      //     this.isSaveSuccessfull = false;
      //     this.isSaveButtonClicked = false;

      //     let actionType = 'Προσθήκη υλικού';
      //     this.AddHistoryRecord(materialLine.MaterialName, materialLine.SerialNumber, actionType);

      //     this.router.navigate([this.storageCategory + '/material-lines']);
      //   }, 2000);

      // }))
      // .subscribe(
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res);

            this.isNewMaterialLineAdded = true;

            this.isSaveSuccessfull = true;

            setTimeout(() => {
              this.isSaveSuccessfull = false;
              this.isSaveButtonClicked = false;

              let actionType = 'Προσθήκη υλικού';
              this.AddHistoryRecord(materialLine.MaterialName, materialLine.SerialNumber, actionType);

              this.router.navigate([this.storageCategory + '/material-lines']);
            }, 2000);

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  CheckInputMax(materialQuantity: number) {

    let materialQuantitySum = (+this.tempAvailableMaterialQuantity) + (+this.tempDamagedMaterialQuantity) + (+this.tempDeletedMaterialQuantity);
    if (materialQuantitySum > this.materialQuantity) {
      this.incorrectQuantityInput = true;
    } else {
      this.incorrectQuantityInput = false;
    }
  }

  GetItemDetailsToPreviewFromsessionStorage() {
    this.materialState = JSON.parse(JSON.stringify(sessionStorage.getItem('materialState')));
    if (this.materialState == 'available') {
      this.materialStateDescription = 'Διαθέσιμο Υλικό';
    } else if (this.materialState == 'damaged') {
      this.materialStateDescription = 'Υλικό σε βλάβη/προς επισκευή';
    } else if (this.materialState == 'deleted') {
      this.materialStateDescription = 'Υλικό προς διαγραφή λόγω καταστροφής ή απώλειας';
    }

    this.materialId = JSON.parse(JSON.stringify(sessionStorage.getItem('materialIdToPreview')));
    if (this.materialId == null) {
      console.log('this.materialId: ' + this.materialId)
      this.isNewMaterial = true;
      sessionStorage.setItem('isNewMaterial', 'true');
      this.materialState = 'available';
      this.materialStateDescription = 'Διαθέσιμο Υλικό';
    }
    this.materialName = JSON.parse(JSON.stringify(sessionStorage.getItem('materialNameToPreview')));
    this.materialserialNumber = JSON.parse(JSON.stringify(sessionStorage.getItem('materialserialNumberToPreview')));
    if (this.materialserialNumber != 'Άνευ') {
      this.hasNoSerialNumber = false;
    } else {
      this.hasNoSerialNumber = true;
      this.materialserialNumber = '';
    }
    this.materialQuantity = JSON.parse(JSON.stringify(sessionStorage.getItem('materialQuantityToPreview')));
    //this.availableMaterialQuantity = 
    this.previousAvailableMaterialQuantity = JSON.parse(JSON.stringify(sessionStorage.getItem('availableMaterialQuantityToPreview')));
    this.materialStorageCategory = JSON.parse(JSON.stringify(sessionStorage.getItem('materialStorageCategoryToPreview')));
    this.materialStoringPlace = JSON.parse(JSON.stringify(sessionStorage.getItem('materialStoringPlaceToPreview')));
    this.materialStoredNearRepeater = JSON.parse(JSON.stringify(sessionStorage.getItem('materialStoredNearRepeaterToPreview')));
    this.materialBorrowedTo = JSON.parse(JSON.stringify(sessionStorage.getItem('materialBorrowedToToPreview')));
    if (this.materialBorrowedTo != '' && this.materialBorrowedTo != null && this.materialBorrowedTo != 'null' && this.materialBorrowedTo != undefined && this.materialBorrowedTo != 'undefined') {
      this.isMaterialBorrowed = true;
    }
    this.materialBorrowedAt = JSON.parse(JSON.stringify(sessionStorage.getItem('materialBorrowedAtToPreview')));
    this.materialBorrowedQuantity = JSON.parse(JSON.stringify(sessionStorage.getItem('materialBorrowedQuantityToPreview')));
    this.materialExpiryDate = JSON.parse(JSON.stringify(sessionStorage.getItem('materialExpiryDateToPreview')));
    if (JSON.parse(JSON.stringify(sessionStorage.getItem('isMaterialDamagedToPreview'))) == 'true') {
      this.isMaterialDamaged = true;
    } else this.isMaterialDamaged = false;
    //this.damagedMaterialQuantity = 
    this.previousDamagedMaterialQuantity = JSON.parse(JSON.stringify(sessionStorage.getItem('damagedMaterialQuantityToPreview')));
    if (JSON.parse(JSON.stringify(sessionStorage.getItem('isMaterialDeletedToPreview'))) == 'true') {
      this.isMaterialDeleted = true;
    } else this.isMaterialDeleted = false;
    if (!this.isMaterialDamaged && !this.isMaterialDeleted) {
      this.isMaterialAvailable = true;
    } else this.isMaterialAvailable = false;
    //this.deletedMaterialQuantity = 
    this.previousDeletedMaterialQuantity = JSON.parse(JSON.stringify(sessionStorage.getItem('deletedMaterialQuantityToPreview')));
    if (JSON.parse(JSON.stringify(sessionStorage.getItem('isMaterialConsumableToPreview'))) == 'true') {
      this.isMaterialConsumable = true;
    } else this.isMaterialConsumable = false;
    this.CreatedAt = JSON.parse(JSON.stringify(sessionStorage.getItem('CreatedAtToPreview')));
    this.CreatedBy = JSON.parse(JSON.stringify(sessionStorage.getItem('CreatedByToPreview')));
    this.LastUpdatedAt = JSON.parse(JSON.stringify(sessionStorage.getItem('LastUpdatedAtToPreview')));
    this.LastUpdatedBy = JSON.parse(JSON.stringify(sessionStorage.getItem('LastUpdatedByToPreview')));
    this.materialPhoto = JSON.parse(JSON.stringify(sessionStorage.getItem('materialPhotoToPreview')));
    this.previousMaterialPhoto = JSON.parse(JSON.stringify(sessionStorage.getItem('materialPhotoToPreview')));
  }

  GetMaterialPhotoFromStorage() {
    if (this.materialPhoto != null) {

      // getDownloadURL(this.storageRef = ref(this.storage, this.materialPhoto))
      //   .then((url) => {
      //     this.preview = url;
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   });

      this.dbFunctionService.getGetMaterialPhotoFromDb(this.materialPhoto)
        .then((url) => {
          this.preview = url.publicUrl + '.jpg';
        })
        .catch((error) => {
          console.log(error)
        });

    }
  }

  PostMaterialPhotoToStorage(materialImage: string) {
    if (this.materialPhoto != null) {

      this.dbFunctionService.postGetMaterialPhotoToDb(materialImage, this.selectedImageFile, this.preview)
        .then((url) => {
          console.log(url);
          console.log('Uploaded image!');
        })
        .catch((error) => {
          console.log(error)
          console.log('Failed to upload image.');
        });

    }
  }

  DeleteMaterialPhotoFromStorage(materialImage: string) {
    if (this.materialPhoto != null) {

      this.dbFunctionService.deleteMaterialPhotoFromDb(this.previousMaterialPhoto)
        .then((url) => {
          console.log(url);
          console.log('Deleted image!');
        })
        .catch((error) => {
          console.log(error)
          console.log('Failed to delete image.');
        });

    }
  }

  DeleteMaterialPermanently() {
    let materialLine = new MaterialLines;
    console.log(this.materialId)

    materialLine.Id = this.materialId;
    materialLine.Photo = this.materialPhoto;

    // // Delete image file
    // this.storageRef = ref(this.storage, materialLine.Photo);
    // deleteObject(this.storageRef).then(() => {
    //   console.log('Image deleted!');
    // }).catch((error) => {
    //   console.log(error);
    // });
    this.DeleteMaterialPhotoFromStorage(materialLine.Photo);

    this.dbFunctionService.deleteMaterialFromDb(materialLine)
      //.subscribe(
      .then(
        (res: any) => {
          console.log(res);
          //if ((res != null) || (res != undefined)) {

          this.isDeletionSuccessfull = true;
          sessionStorage.setItem('isDeletionSuccessfull', 'true');

          setTimeout(() => {
            this.isDeletionSuccessfull = false;
            //sessionStorage.setItem('isDeletionSuccessfull', 'false');

            let actionType = 'Οριστική διαγραφή υλικού';
            this.AddHistoryRecord(this.materialName, this.materialserialNumber, actionType);

            this.router.navigate([this.storageCategory + '/material-lines']);
          }, 2000);

          //}
        },
        err => {
          console.log(err);
        }
      );
  }

  AddHistoryRecord(materialName: string, serialNumber: string, actionType: string) {

    let historyLine = new HistoryLines;
    historyLine.Id = '';
    historyLine.Date = Date.now().toString();
    historyLine.ActionType = actionType;
    historyLine.MaterialName = materialName;
    historyLine.SerialNumber = (serialNumber == '' ? 'Άνευ' : serialNumber);
    historyLine.Responsible = this.loggedInUserName;

    this.dbFunctionService.postHistoryLinesToDb(historyLine)
      // .pipe(map((response: any) => {

      // }))
      // .subscribe(
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res);
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  RemoveSpecialCharacters(str: string) {
    if (str != null && str != '') {
      return str.replaceAll('/', '-').replaceAll('.', '-').replaceAll(',', '-').replaceAll('?', '').replaceAll('(', '')
        .replaceAll(')', '').replaceAll('*', '').replaceAll('@', '').replaceAll('#', '').replaceAll('$', '')
        .replaceAll('%', '').replaceAll('^', '').replaceAll('&', '').replaceAll('"', '').replaceAll('[', '')
        .replaceAll(']', '').replaceAll(':', '').replaceAll(';', '').replaceAll('!', '').replaceAll(' ', '');
    } else {
      return 'null';
    }

  }

  DismillModal() {
    this.modalService.dismissAll();
  }

  ngOnDestroy() {

    if (this.updateMaterialLines && !this.updateMaterialLines.closed) {
      this.updateMaterialLines.unsubscribe();
    }

    if (this.postMaterialLines && !this.postMaterialLines.closed) {
      this.postMaterialLines.unsubscribe();
    }

  }


}
