import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";
import {AuthService} from "../_services/auth.service";
import {User} from "../_models/user.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  pubContent : string = '';
  user! : User;
  AuthUserSub! : Subscription;
  constructor(
    private userService : UserService,
    private authService : AuthService
  ) {
  }
  ngOnInit(): void {

    this.AuthUserSub = this.authService.AuthenticatedUser$.subscribe({
      next : user => {
        if(user) this.user = user;
      }
    })

    this.userService.getUserPublicContent().subscribe({
      next : data => {
        this.pubContent = data;
      },
      error : err => console.log(err)
    })
  }
  ngOnDestroy() {
    this.AuthUserSub.unsubscribe();
  }
}
