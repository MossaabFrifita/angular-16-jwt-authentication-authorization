import {Component, OnInit} from '@angular/core';
import {UserService} from "../_services/user.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  adminPubContent!: string;
  constructor(private userService : UserService) {
  }
  ngOnInit(): void {
    this.userService.getAdminPublicContent().subscribe({
      next : data => {
        this.adminPubContent = data;
      },
      error : err => console.log(err)
    })
  }

}
