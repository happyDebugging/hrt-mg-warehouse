import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { delay, map, of } from 'rxjs';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { Users } from '../shared/models/users.model';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

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

  users: Users[] = [];
  userToManage = '';
  userManagementAction = '';

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

  auth = getAuth(this.firebaseApp);

  constructor(private router: Router, private dbFunctionService: DbFunctionService) { }

  ngOnInit() {

    let tokenSubscription = of(null).pipe(delay(36000000)).subscribe(() => { //logout after 10 hours
      console.log('EXPIRED!')
      sessionStorage.setItem('isUserLoggedIn', 'false');
      sessionStorage.setItem('sessionExpirationDate', '');
    });

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUser.Permissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserLastName")));

    this.GetUsers();
  }

  GetUsers() {

    // this.dbFunctionService.getUserDetailsFromDb()
    //   .pipe(map((response: any) => {
    //     let markerArray: Users[] = [];

    //     for (const key in response) {
    //       if (response.hasOwnProperty(key)) {

    //         markerArray.push({ ...response[key], Id: key })

    //       }
    //     }

    //     return markerArray.reverse();
    //   }))
    //   .subscribe(
    //     (res: any) => {
    //       if ((res != null) || (res != undefined)) {
    //         //console.log(res)
    //         const responseData = new Array<Users>(...res);

    //         for (const data of responseData) {

    //           const resObj = new Users();

    //           resObj.Id = data.Id;
    //           resObj.UserId = data.UserId;
    //           resObj.FirstName = data.FirstName;
    //           resObj.LastName = data.LastName;
    //           resObj.Email = data.Email;
    //           resObj.Permissions = data.Permissions;

    //           if (resObj.FirstName != 'Σκίουρος') this.users.push(resObj);
    //         }

    //       }
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
  }

  CreateUser() {
    
    // const  email='eeeez@gmail.com';
    // const password='123456';

    // createUserWithEmailAndPassword(this.auth, email, password)
    //   .then((userCredential) => {
    //     // Signed up 
    //     const user = userCredential.user;
    //     console.log(user)
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   });
  }


}
