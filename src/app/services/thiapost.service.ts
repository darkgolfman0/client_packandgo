import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ThaipostService {

    constructor(private http: HttpClient) { }

    GetToken() {
        return this.http.get(`${environment.apiUrl}/c/thaipost`);
    }

    GetItem(temp: string, token: string) {
        console.log('temp', temp)
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6IkF1dGhvcml6YXRpb24iLCJleHAiOjE1NzU3OTQyNDQsInJvbCI6WyJST0xFX1VTRVIiXSwiZCpzaWciOnsicCI6InpXNzB4IiwicyI6bnVsbCwidSI6ImY2Y2MxNDM0ZDgzOGUxMjlkMzgzMDMxZDUwNTJmZDY5IiwiZiI6InhzeiM5In19.NmPBt8pio1n1vlOWX5XfvRqwP_Z8arAGo-fKa3zsMxpRDL3G0lCeGnl7Iiw0cB9p8pXbS4muFGcW721Gl70INg'
            }
        }
        console.log('headers', headers)
        return this.http.post(`https://trackapi.thailandpost.co.th/post/api/v1/track`, JSON.parse(temp), headers);
    }

}
