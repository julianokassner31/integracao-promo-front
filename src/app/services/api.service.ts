import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = environment.url;
  constructor(private http: HttpClient) {}

  public get(uri: string): Observable<any> {
    return this.http.get(this.url.concat(uri));
  }

  public post(uri: string, body?: any): Observable<any> {
    return this.http.post(this.url.concat(uri), body);
  }

  public getVersion() {
    return this.http.get(this.url.concat('/produtos/version'));
  }
}
