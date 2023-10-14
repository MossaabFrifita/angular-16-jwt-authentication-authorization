import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }


  getUserPublicContent() {
  return  this.http.request('post','http://localhost:8086/api/v1/user/resource', {
      withCredentials: true,
      responseType : "text"
    })
  }

  getAdminPublicContent() {
    return  this.http.request('get','http://localhost:8086/api/v1/admin/resource', {
      withCredentials: true,
      responseType : "text"
    })
  }
}
