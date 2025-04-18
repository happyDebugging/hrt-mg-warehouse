import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MaterialLines } from '../models/material-lines.model';
import { Users } from '../models/users.model';
import { HistoryLines } from '../models/history-lines.model';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js'

@Injectable()
export class DbFunctionService {

    // Initialize Supabase
    private supabase: SupabaseClient

    constructor(private http: HttpClient) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    async getMaterialLinesFromDb() {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.get<MaterialLines>(environment.databaseURL + environment.materialLinesTable + '.json');
        const data = await this.supabase.from('materialLines').select('*'); //.eq('StorageCategory', 'Τμήμα Πρώτων Βοηθειών');

        return data["data"];
    }

    async postMaterialLineToDb(materialLine: MaterialLines) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.post(environment.databaseURL + environment.materialLinesTable + '.json', materialLine, options);
        const data = await this.supabase.from('materialLines')
            .insert({
                MaterialName: materialLine.MaterialName,
                SerialNumber: materialLine.SerialNumber,
                Quantity: materialLine.Quantity,
                AvailableMaterialQuantity: materialLine.AvailableMaterialQuantity,
                StorageCategory: materialLine.StorageCategory,
                StoringPlace: materialLine.StoringPlace,
                StoredNearRepeater: materialLine.StoredNearRepeater,
                BorrowedTo: materialLine.BorrowedTo,
                BorrowedAt: materialLine.BorrowedAt,
                BorrowedMaterialQuantity: materialLine.BorrowedMaterialQuantity,
                ExpiryDate: materialLine.ExpiryDate,
                IsMaterialDamaged: materialLine.IsMaterialDamaged,
                DamagedMaterialQuantity: materialLine.DamagedMaterialQuantity,
                IsMaterialDeleted: materialLine.IsMaterialDeleted,
                DeletedMaterialQuantity: materialLine.DeletedMaterialQuantity,
                IsMaterialConsumable: materialLine.IsMaterialConsumable,
                CreatedAt: materialLine.CreatedAt,
                CreatedBy: materialLine.CreatedBy,
                LastUpdatedAt: materialLine.LastUpdatedAt,
                LastUpdatedBy: materialLine.LastUpdatedBy,
                Photo: materialLine.Photo
            }).select();

        return data;
    }

    async updateMaterialLinesToDb(materialLine: MaterialLines) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        console.log(materialLine.Id)
        //return this.http.put(environment.databaseURL + environment.materialLinesTable + '/' + materialLine.Id + '.json', materialLine, options);
        const data = await this.supabase.from('materialLines').update({
            MaterialName: materialLine.MaterialName,
            SerialNumber: materialLine.SerialNumber,
            Quantity: materialLine.Quantity,
            AvailableMaterialQuantity: materialLine.AvailableMaterialQuantity,
            StorageCategory: materialLine.StorageCategory,
            StoringPlace: materialLine.StoringPlace,
            StoredNearRepeater: materialLine.StoredNearRepeater,
            BorrowedTo: materialLine.BorrowedTo,
            BorrowedAt: materialLine.BorrowedAt,
            BorrowedMaterialQuantity: materialLine.BorrowedMaterialQuantity,
            ExpiryDate: materialLine.ExpiryDate,
            IsMaterialDamaged: materialLine.IsMaterialDamaged,
            DamagedMaterialQuantity: materialLine.DamagedMaterialQuantity,
            IsMaterialDeleted: materialLine.IsMaterialDeleted,
            DeletedMaterialQuantity: materialLine.DeletedMaterialQuantity,
            IsMaterialConsumable: materialLine.IsMaterialConsumable,
            CreatedAt: materialLine.CreatedAt,
            CreatedBy: materialLine.CreatedBy,
            LastUpdatedAt: materialLine.LastUpdatedAt,
            LastUpdatedBy: materialLine.LastUpdatedBy,
            Photo: materialLine.Photo
        }).eq('Id', materialLine.Id);

        return data;
    }

    async deleteMaterialFromDb(materialLine: MaterialLines) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.delete(environment.databaseURL + environment.materialLinesTable + '/' + materialLine.Id + '.json');
        const response = await this.supabase.from('materialLines')
            .delete().eq('Id', materialLine.Id);

        return response;
    }

    async getGetMaterialPhotoFromDb(materialImage: string) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.get<HistoryLines>(environment.databaseURL + environment.historyLinesTable + '.json');
        const data = await this.supabase.storage.from('hrt-mg-warehouse-photo-storage').getPublicUrl(materialImage);
        return data["data"];
    }

    async postGetMaterialPhotoToDb(materialImage: string, selectedImageFile: any, preview: string) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.get<HistoryLines>(environment.databaseURL + environment.historyLinesTable + '.json');
        //const photoFile = event.target.files[0];
        console.log(selectedImageFile[0])
        const data = await this.supabase.storage.from('hrt-mg-warehouse-photo-storage')
            .upload(materialImage + '.jpg', selectedImageFile[0], { cacheControl: '3600', upsert: false, contentType: 'image/jpeg' });
        //.uploadToSignedUrl(materialImage+'.jpg', 'token-from-createSignedUploadUrl', selectedImageFile, {contentType: 'image/jpeg'})

        return data["data"];
    }

    async deleteMaterialPhotoFromDb(materialImage: string) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        console.log(materialImage + '.jpg')
        const { error } = await this.supabase.storage.from('hrt-mg-warehouse-photo-storage')
            .remove([materialImage + '.jpg']);

        return { error };
    }

    users = [
        {
            Id: '',
            UserId: 'oV4wudBZ45UUK5HhfA3aTccmkuX2',
            FirstName: 'Σκίουρος',
            LastName: 'Ορεινός',
            Email: '123@123.com',
            Permissions: 'All'
        }
        ,
        {
            Id: '',
            UserId: '',
            FirstName: 'Χάρης',
            LastName: 'Παπαμαρκάκης',
            Email: '',
            Permissions: 'All'
        }
        ,
        {
            Id: '',
            UserId: '',
            FirstName: 'Δημήτρης',
            LastName: 'Ντόντης',
            Email: '',
            Permissions: 'Τμήμα Ορεινής Διάσωσης'
        }
        ,
        {
            Id: '',
            UserId: '',
            FirstName: 'Έλενα',
            LastName: 'Πρίντζου',
            Email: '',
            Permissions: 'Τμήμα Πρώτων Βοηθειών'
        }
        ,
        {
            Id: '',
            UserId: '',
            FirstName: 'Βαγγέλης',
            LastName: 'Βαμβακάς',
            Email: '',
            Permissions: 'Τμήμα Υγρού Στοιχείου'
        }
        ,
        {
            Id: 0,
            UserId: '',
            FirstName: 'Κωνσταντίνος',
            LastName: 'Χατζησάββας',
            Email: '',
            Permissions: 'Τμήμα Αντιμετώπισης Καταστροφών'
        }
        ,
        {
            Id: 0,
            UserId: '',
            FirstName: 'Ζωή',
            LastName: 'Παππά',
            Email: '',
            Permissions: 'Τμήμα Κοινωνικής Μέριμνας & Ανθρωπιστικών Αποστολών'
        }
        ,
        {
            Id: 0,
            UserId: '',
            FirstName: 'Κωνσταντίνος',
            LastName: 'Μαυροματιανός',
            Email: '',
            Permissions: 'Τμήμα Επικοινωνιών - Έρευνας & Τεχνολογίας'
        }
    ];
    postUsersToDb() {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        return this.http.post(environment.databaseURL + environment.usersTable + '.json', this.users[7], options);
    }

    async addNewUserToDb(userΙd: string, newUserFirstName: string, newUserLastName: string, newUserEmail: string, newUserPermissions: string) {

        const data = await this.supabase.from('users')
            .insert({
                UserId: userΙd,
                FirstName: newUserFirstName,
                LastName: newUserLastName,
                Email: newUserEmail,
                Permissions: newUserPermissions,
                HasChangedPassword: false
            }).select();

        return data;
    }

    async updateUserToDb(userΙd: string, userFirstName: string, userLastName: string, userEmail: string, userPermissions: string) {

        const data = await this.supabase.from('users')
            .update({
                UserId: userΙd,
                FirstName: userFirstName,
                LastName: userLastName,
                Email: userEmail,
                Permissions: userPermissions,
                HasChangedPassword: false
            }).eq('UserId', userΙd);

        return data;
    }

    async deleteUserFromDb(userΙd: string) {

        const { data, error } = await this.supabase.from('users')
            .delete().eq('UserId', userΙd);

        return { data, error };
    }

    async getUserDetailsFromDb(userEmail: string) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.get<Users>(environment.databaseURL + environment.usersTable + '.json');
        const data = await this.supabase.from('users').select('*').eq('Email', userEmail);

        return data["data"];
    }

    async updateUserDetailsToDb(user: Users) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.put(environment.databaseURL + environment.usersTable + '/' + user.UserId + '.json', user, options);
        const data = await this.supabase.from('users').update({
            UserId: user.UserId,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Permissions: user.Permissions,
            HasChangedPassword: user.HasChangedPassword
        }).eq('Email', user.Email);

        return data;
    }


    async geHistoryLinesFromDb(pageNumber: number, itemsPerPage: number) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.get<HistoryLines>(environment.databaseURL + environment.historyLinesTable + '.json');
        const data = await this.supabase.from('history').select('*', { count: 'exact' })
            .order('Id', { ascending: false })
            .range((pageNumber - 1) * itemsPerPage,
                pageNumber * itemsPerPage - 1);

        return data["data"];
    }

    async postHistoryLinesToDb(historyLine: HistoryLines) {
        let options: any = {
            headers: { "Access-Control-Allow-Origin": "*" },
            observe: 'response'
        }
        //return this.http.post(environment.databaseURL + environment.historyLinesTable + '.json', historyLine, options);
        const data = await this.supabase.from('history')
            .insert({
                Date: historyLine.Date,
                ActionType: historyLine.ActionType,
                MaterialName: historyLine.MaterialName,
                SerialNumber: historyLine.SerialNumber,
                Responsible: historyLine.Responsible
            }).select();

        return data;
    }

}



