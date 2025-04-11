import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Users } from '../models/users.model';
import { HistoryLines } from '../models/history-lines.model';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'

@Injectable()
export class ManageUsersService {

    // Initialize Supabase
    private supabase: SupabaseClient

    constructor(private http: HttpClient) {

        this.supabase = createClient(environment.supabaseUrl, environment.supabaseServiceRoleKey
            , {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );
    }


    async createUser(newUserEmail: string) {
        const { data, error } = await this.supabase.auth.admin.createUser({
            email: newUserEmail,
            password: (Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000).toString(),
            //user_metadata: { name: 'Yoda' }
        });

        return { data, error };
    }

    async getUsers() {

        const data = await this.supabase.from('users').select('*');

        return data["data"];
    }

    // async updateUserDetailsToDb(user: Users) {
    //     let options: any = {
    //         headers: { "Access-Control-Allow-Origin": "*" },
    //         observe: 'response'
    //     }
    //     //return this.http.put(environment.databaseURL + environment.usersTable + '/' + user.UserId + '.json', user, options);
    //     const data = await this.supabase.from('users').update({
    //         UserId: user.UserId,
    //         FirstName: user.FirstName,
    //         LastName: user.LastName,
    //         Email: user.Email,
    //         Permissions: user.Permissions,
    //         HasChangedPassword: user.HasChangedPassword
    //     }).eq('Email', user.Email);

    //     return data;
    // }


}



