import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root',
})
export class HotelesService {
  resourceUrl: string = 'https://pav2.azurewebsites.net/api/hoteles/';

  constructor(private httpClient: HttpClient) {}

  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

  put(Id: number, obj: Hotel) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  post(obj: Hotel) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
}
