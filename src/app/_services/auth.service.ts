import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {User} from "../_models/user.model";
import {StorageService} from "./storage.service";
import {Router} from "@angular/router";


export interface AuthResponseData {
  id : number,
  email : string,
  roles : string[],
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AuthenticatedUser$  = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) { }

  login(email : string, password: string) {
    return this.http.request<AuthResponseData>('post','http://localhost:8086/api/v1/auth/authenticate',
      {
        body : {email, password},
        withCredentials : true
      }).pipe(
        catchError(err => {
          console.log(err);
          let errorMessage = 'An unknown error occurred!';
          if(err.error.message === 'Bad credentials') {
            errorMessage = 'The email address or password you entered is invalid'
          }
            return throwError(() =>  new Error(errorMessage))
        }),
        tap(
          user => {
            const extractedUser : User = {
              email: user.email,
              id: user.id,
              role : {
                name : user.roles.find(role => role.includes('ROLE')) || '',
                permissions : user.roles.filter(permission => !permission.includes('ROLE'))
              }
            }
            this.storageService.saveUser(extractedUser);
            this.AuthenticatedUser$.next(extractedUser);
          }
        )
    );
  }

  autoLogin() {
    const userData = this.storageService.getSavedUser();
    if (!userData) {
      return;
    }
    this.AuthenticatedUser$.next(userData);
  }

  logout(){
    this.http.request('post','http://localhost:8086/api/v1/auth/logout',{
      withCredentials: true
    }).subscribe({
      next: () => {
        this.storageService.clean();
        this.AuthenticatedUser$.next(null);
        this.router.navigate(['/login']);
      }
    })

  }

  refreshToken(){
    return this.http.request('post', 'http://localhost:8086/api/v1/auth/refresh-token-cookie', {
      withCredentials: true
    })
  }
}
