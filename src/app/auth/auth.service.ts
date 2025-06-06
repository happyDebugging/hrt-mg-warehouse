import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthChangeEvent, AuthSession, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'
import { environment } from '../../environments/environment.development';
//import { environment } from '../../environments/environment';
import { DbFunctionService } from '../shared/services/db-functions.service';
import { Users } from '../shared/models/users.model';
import { map } from 'rxjs';

@Injectable()
export class AuthService {

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

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(this.firebaseApp);

  // Initialize Supabase
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor(private router: Router, private dbFunctionService: DbFunctionService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  AuthenticateUser() {
    return new Promise((resolve, reject) => {
      this.userEmail = JSON.parse(JSON.stringify(sessionStorage.getItem("userEmail")));
      this.userPassword = JSON.parse(JSON.stringify(sessionStorage.getItem("userPassword")));

      this.errorMessageToShow = '';

      //Sign in with Supabase
      this.supabase.auth.signInWithPassword({ email: this.userEmail.trim(), password: this.userPassword.trim() })
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.data.user;

          this.isUserLoggedIn = true;
          sessionStorage.setItem("isUserLoggedIn", "true");

          this.isCredentialsWrong = false;

          this.userEmail = '';
          this.userPassword = '';

          this.loggedInUserId = user!.id;
          sessionStorage.setItem("loggedInUserId", user!.id);

          //this.GetLoggedInUserDetails();

          //this.accessToken = user.accessToken;

          console.log(this.isUserLoggedIn);
          sessionStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());


          let expiresDate = new Date();
          const expiresDateUnix = expiresDate.valueOf();
          expiresDate = new Date(expiresDateUnix * 1000);
          sessionStorage.setItem('sessionExpirationDate', Math.floor(expiresDate.getTime() / 1000).toString());
          console.log('sessionExpirationDate ', Math.floor(expiresDate.getTime() / 1000).toString())

          this.GetLoggedInUserDetails(user?.email);

          //window.location.href = environment.appUrl + '/home';

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(error.code)

          if (error.code = 'auth/invalid-credential') {
            this.errorMessageToShow = 'Λάθος email ή κωδικός πρόσβασης.';
          } else if (error.code = 'auth/too-many-requests') {
            this.errorMessageToShow = 'Υπέρβαση προσπαθειών σύνδεσης, προσπαθήστε αργότερα.';
          } else {
            this.errorMessageToShow = '';
          }

          sessionStorage.setItem('signinErrorMessage', this.errorMessageToShow);

          this.isUserLoggedIn = false;
          //sessionStorage.clear();

          this.isCredentialsWrong = true;

          resolve(this.errorMessageToShow);
        });

      // //Sign in with Firebase
      // signInWithEmailAndPassword(this.auth, this.userEmail.trim(), this.userPassword.trim())
      //   .then((userCredential) => {
      //     // Signed in 
      //     const user = userCredential.user;

      //     this.isUserLoggedIn = true;
      //     sessionStorage.setItem("isUserLoggedIn", "true");

      //     this.isCredentialsWrong = false;

      //     this.userEmail = '';
      //     this.userPassword = '';

      //     this.loggedInUserId = user.uid;
      //     sessionStorage.setItem("loggedInUserId", user.uid);

      //     //this.GetLoggedInUserDetails();

      //     //this.accessToken = user.accessToken;

      //     console.log(this.isUserLoggedIn);
      //     sessionStorage.setItem('isUserLoggedIn', this.isUserLoggedIn.toString());


      //     let expiresDate = new Date();
      //     const expiresDateUnix = expiresDate.valueOf();
      //     expiresDate = new Date(expiresDateUnix * 1000);
      //     sessionStorage.setItem('sessionExpirationDate', Math.floor(expiresDate.getTime() / 1000).toString());
      //     console.log('sessionExpirationDate ', Math.floor(expiresDate.getTime() / 1000).toString())

      //     this.GetLoggedInUserDetails();

      //     //window.location.href = environment.appUrl + '/home';

      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;

      //     console.log(error.code)

      //     if (error.code = 'auth/invalid-credential') {
      //       this.errorMessageToShow = 'Λάθος email ή κωδικός πρόσβασης.';
      //     } else if (error.code = 'auth/too-many-requests') {
      //       this.errorMessageToShow = 'Υπέρβαση προσπαθειών σύνδεσης, προσπαθήστε αργότερα.';
      //     } else {
      //       this.errorMessageToShow = '';
      //     }

      //     sessionStorage.setItem('signinErrorMessage', this.errorMessageToShow);

      //     this.isUserLoggedIn = false;
      //     //sessionStorage.clear();

      //     this.isCredentialsWrong = true;

      //     resolve(this.errorMessageToShow);
      //   });

      return false;

    });
  }


  GetLoggedInUserDetails(userEmail: string | undefined) {

    this.dbFunctionService.getUserDetailsFromDb(userEmail!)
      // .pipe(map((response: any) => {
      //   let markerArray: Users[] = [];

      //   for (const key in response) {
      //     if (response.hasOwnProperty(key)) {

      //       markerArray.push({ ...response[key], Id: key })

      //     }
      //   }

      //   return markerArray.reverse();
      // }))
      // .subscribe(
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res)
            //const responseData = new Array<Users>(...res);
            const responseData = res[0];

            //for (const data of res) {

            const resObj = new Users();

            resObj.Id = responseData.Id;
            resObj.UserId = responseData.UserId;
            resObj.FirstName = responseData.FirstName;
            resObj.LastName = responseData.LastName;
            resObj.Email = responseData.Email;
            resObj.Permissions = responseData.Permissions;

            //if (this.loggedInUserId == resObj.UserId) {
            this.loggedInUser = resObj;
            console.log(this.loggedInUser.Id, ' ', this.loggedInUser.FirstName)
            console.log('this.loggedInUser.Permissions2', ' ', this.loggedInUser.Permissions)

            sessionStorage.setItem('loggedInUserName', this.loggedInUser.FirstName + ' ' + this.loggedInUser.LastName);
            sessionStorage.setItem("loggedInUserEmail", this.loggedInUser.Email);
            sessionStorage.setItem('loggedInUserFirstName', this.loggedInUser.FirstName);
            sessionStorage.setItem('loggedInUserLastName', this.loggedInUser.LastName);
            sessionStorage.setItem("loggedInUserPermissions", this.loggedInUser.Permissions);

            window.location.href = environment.appUrl + '/home';
            //}

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  LogoutUser() {
    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));

    sessionStorage.clear();
    this.supabase.auth.signOut();

    this.router.navigate(['auth']);
    //window.location.href = environment.appUrl + '/auth';
    console.log('this.isUserLoggedIn1 ' + this.isUserLoggedIn)
    return this.isUserLoggedIn;
  }


}
