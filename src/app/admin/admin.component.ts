import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../shared/models/users.model';
import { ManageUsersService } from '../shared/services/manage-users.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

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

  newUserName = '';
  newUserEmail = '';

  // Initialize Supabase
  private supabase: SupabaseClient
  
  constructor(private router: Router, private manageUsersService: ManageUsersService) { 
    //this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseServiceRoleKey
      // , {  
      // auth: {    
      //   autoRefreshToken: false,    
      //   persistSession: false  
      // }}
    );
    
  }

  ngOnInit() {

    // Access auth admin api
    const adminAuthClient = this.supabase.auth.admin

    this.isUserLoggedIn = JSON.parse(JSON.stringify(sessionStorage.getItem("isUserLoggedIn")));
    this.loggedInUserId = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserId")));
    this.loggedInUser.Permissions = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserPermissions")));
    this.loggedInUser.FirstName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserFirstName")));
    this.loggedInUser.LastName = JSON.parse(JSON.stringify(sessionStorage.getItem("loggedInUserLastName")));

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

  async CreateUser() {
    
    this.manageUsersService.createUser(this.newUserEmail)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.data.user;
        console.log(user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

  }

  UpdateUser() {

  }

  DeleteUser() {

  }


}
