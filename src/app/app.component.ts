import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DbFunctionService } from './shared/services/db-functions.service';
import { map } from 'rxjs';
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

  constructor(private authService: AuthService, private dbFunctionService: DbFunctionService) { }
  
  ngOnInit() {
    this.isUserLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserId")));
    this.loggedInUserPermissions = JSON.parse(JSON.stringify(localStorage.getItem("loggedInUserPermissions")));
    console.log('this.loggedInUserPermissions1 '+this.loggedInUserPermissions)

    if (JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn"))) == 'true') this.isUserLoggedIn = true; else this.isUserLoggedIn = false;
    console.log('this.isUserLoggedIn4 '+this.isUserLoggedIn)

    this.storageCategory = JSON.parse(JSON.stringify(localStorage.getItem('storageCategory')));

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
    localStorage.setItem('storageCategory', 'mountain');
    console.log('mountain')
  }

  SetWaterCategory() {
    localStorage.setItem('storageCategory', 'water');
    console.log('water')
  }

  SetDisasterCategory() {
    localStorage.setItem('storageCategory', 'disaster');
    console.log('disaster')
  }

  SetFirstAidCategory() {
    localStorage.setItem('storageCategory', 'firstAid');
    console.log('firstAid')
  }

  SetCommunicationsCategory() {
    localStorage.setItem('storageCategory', 'communications');
    console.log('communications')
  }

  SetSocialCareCategory() {
    localStorage.setItem('storageCategory', 'socialCare');
    console.log('socialCare')
  }

  ToggleNavBarControls() {
    this.isUserLoggedIn = true;
  }


  Logout() {
    this.isUserLoggedIn = false;
    
    localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());
    
    this.authService.LogoutUser();

    console.log('this.isUserLoggedIn2 '+JSON.parse(JSON.stringify(localStorage.getItem("isUserLoggedIn"))))
  }


}
