import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MaterialLines } from '../models/material-lines.model';

@Injectable()
export class DbFunctionService {

    constructor(private http: HttpClient) { }

    getMaterialLinesFromDb() {
        let options: any = {
            headers: {"Access-Control-Allow-Origin": "*"},  
            observe: 'response'
        }
        return this.http.get<MaterialLines>(environment.databaseURL + environment.materialLinesTable + '.json');
    }

    postMaterialLineToDb(materialLine: MaterialLines) {
        let options: any = {
            headers: {"Access-Control-Allow-Origin": "*"}, 
            observe: 'response'
        }
        return this.http.post(environment.databaseURL + environment.materialLinesTable + '.json', materialLine, options);
    }

    updateMaterialLinesToDb(materialLine: MaterialLines) {
        let options: any = {
            headers: {"Access-Control-Allow-Origin": "*"}, 
            observe: 'response'
        }
        return this.http.put(environment.databaseURL + environment.materialLinesTable + '/' + materialLine.Id + '.json', materialLine, options);
    }


}



