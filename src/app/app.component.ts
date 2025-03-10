import { Component, ViewChild } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DbFunctionService } from './shared/services/db-functions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getAuth, updatePassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Users } from './shared/models/users.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hrt-mg-warehouse';

  storageCategory = '';
  loggedInUserPermissions = '';

  userEmail = '';
  userPassword = '';
  accessToken = '';
  isCredentialsWrong = false;
  loggedInUserId = '';
  isUserLoggedIn = false;
  newUserPassword = '';
  newUserPasswordConfirmation = '';
  isPassword6Characters = true;
  isChangePasswordSuccessfull = false;
  errorMessageToShow = '';

  loggedInUser = {
    Id: '',
    UserId: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Permissions: ''
  };

  @ViewChild('updatePassword') updatePassword: any;

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
  auth: any;


  constructor(private authService: AuthService, private dbFunctionService: DbFunctionService, private modalService: NgbModal) { }

  ngOnInit() {
    // Initialize Firebase Authentication and get a reference to the service
    this.auth = getAuth(this.firebaseApp);

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUserPermissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));
    console.log('this.loggedInUserPermissions1 ' + this.loggedInUserPermissions)
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserLastName")));
    this.loggedInUser.Email = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserEmail")));

    if (JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn"))) == 'true') this.isUserLoggedIn = true; else this.isUserLoggedIn = false;
    console.log('this.isUserLoggedIn4 ' + this.isUserLoggedIn)

    this.storageCategory = JSON.parse(JSON.stringify(sessionStorage.getItem('storageCategory')));

    // this.dbFunctionService.postUsersToDb()
    //   .subscribe(
    //     (res: any) => {
    //       console.log(res);
    //       if ((res != null) || (res != undefined)) {

    //       }
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );

  }

  SetMountainCategory() {
    sessionStorage.setItem('storageCategory', 'mountain');
    console.log('mountain')
  }

  SetWaterCategory() {
    sessionStorage.setItem('storageCategory', 'water');
    console.log('water')
  }

  SetDisasterCategory() {
    sessionStorage.setItem('storageCategory', 'disaster');
    console.log('disaster')
  }

  SetFirstAidCategory() {
    sessionStorage.setItem('storageCategory', 'firstAid');
    console.log('firstAid')
  }

  SetCommunicationsCategory() {
    sessionStorage.setItem('storageCategory', 'communications');
    console.log('communications')
  }

  SetSocialCareCategory() {
    sessionStorage.setItem('storageCategory', 'socialCare');
    console.log('socialCare')
  }

  ToggleNavBarControls() {
    this.isUserLoggedIn = true;
  }

  PrepareToUpdateUserPassword() {
    this.modalService.open(this.updatePassword, { centered: true, size: 'sm', windowClass: 'zindex' });
  }

  UpdateUserPassword() {

    const user = this.auth.currentUser;

    updatePassword(user, this.newUserPassword).then(() => {
      // Update successful.
      //this.modalService.dismissAll();
      this.isChangePasswordSuccessfull = true;

      this.newUserPassword = '';
      this.newUserPasswordConfirmation = '';
      this.isPassword6Characters = true;

      this.UpdateUserDetails();

      setTimeout(() => {
        this.DismillModal();
        this.isChangePasswordSuccessfull = false;

        this.Logout();

      }, 2500);

    }).catch((error) => {
      console.log(error)

      this.isPassword6Characters = false;
    });
  }

  UpdateUserDetails() {

    let updatedUserDetails = new Users;

    updatedUserDetails.Id = '';
    updatedUserDetails.UserId = this.loggedInUserId;
    updatedUserDetails.FirstName = this.loggedInUser.FirstName;
    updatedUserDetails.LastName = this.loggedInUser.LastName;
    updatedUserDetails.Email = this.loggedInUser.Email;
    updatedUserDetails.Permissions = this.loggedInUserPermissions;
    updatedUserDetails.HasChangedPassword = true;

    this.dbFunctionService.updateUserDetailsToDb(updatedUserDetails)
    .subscribe(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  DismillModal() {
    this.modalService.dismissAll();
  }

  Logout() {
    this.isUserLoggedIn = false;

    sessionStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());
    sessionStorage.setItem('sessionExpirationDate', '');

    this.authService.LogoutUser();

    console.log('this.isUserLoggedIn2 ' + JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn"))))
  }


}
