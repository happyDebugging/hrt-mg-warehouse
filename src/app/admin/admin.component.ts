import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../shared/models/users.model';
import { ManageUsersService } from '../shared/services/manage-users.service';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { DbFunctionService } from '../shared/services/db-functions.service';

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

  newUserFirstName = '';
  newUserLastName = '';
  newUserEmail = '';
  newUserPermissions = '';

  // Initialize Supabase
  private supabase: SupabaseClient
  
  constructor(private router: Router, private dbFunctionService: DbFunctionService, private manageUsersService: ManageUsersService) { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    // this.supabase = createClient(environment.supabaseUrl, environment.supabaseServiceRoleKey
    //   , {  
    //   auth: {    
    //     autoRefreshToken: false,    
    //     persistSession: false  
    //   }}
    // );
    
  }

  ngOnInit() {

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUser.Permissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserLastName")));

    console.log(this.loggedInUserId)

    this.GetUsers();
  }

  GetUsers() {

    this.manageUsersService.getUsers()
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            //console.log(res)
            const responseData = new Array<Users>(...res);

            for (const data of responseData) {

              const resObj = new Users();

              resObj.Id = data.Id;
              resObj.UserId = data.UserId;
              resObj.FirstName = data.FirstName;
              resObj.LastName = data.LastName;
              resObj.Email = data.Email;
              resObj.Permissions = data.Permissions;

              if (resObj.FirstName != 'Σκίουρος') this.users.push(resObj);
            }

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  ManageSelectedUserDetails(user: Users) {
    this.newUserFirstName = user.FirstName;
    this.newUserLastName = user.LastName;
    this.newUserEmail = user.Email;
    this.newUserPermissions = user.Permissions;
  }

  async CreateUser() {
    
    this.manageUsersService.createUser(this.newUserEmail)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.data.user;
        console.log(user)

        this.AddNewUserToDb(user);
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  }

  AddNewUserToDb(user: User | null) {
    this.dbFunctionService.addNewUserToDb(user!.id, this.newUserFirstName, this.newUserLastName, this.newUserEmail, this.newUserPermissions)
      .then(
        (res: any) => {
          if ((res != null) || (res != undefined)) {
            console.log(res);

            this.GetUsers();

          }
        },
        err => {
          console.log(err);
        }
      );
  }

  UpdateUser() {

    this.manageUsersService.updateUser(this.userToManage, this.newUserEmail)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.data.user;
      console.log(user)

      this.UpdateUserToDb(user);
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  UpdateUserToDb(user: User | null) {
    this.dbFunctionService.updateUserToDb(user!.id, this.newUserFirstName, this.newUserLastName, this.newUserEmail, this.newUserPermissions)
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

  DeleteUser() {
    this.manageUsersService.deleteUser(this.userToManage)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.data.user;
      console.log(user)

      this.DeleteUserFromDb(user);
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  DeleteUserFromDb(user: User | null) {
    //console.log(this.userToManage)
    this.dbFunctionService.deleteUserFromDb(this.userToManage)
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

  ClearFieldValues() {
    this.userToManage = '';
    this.newUserFirstName = '';
    this.newUserLastName = '';
    this.newUserEmail = '';
    this.newUserPermissions = '';
  }


}
