import { Component, OnInit } from '@angular/core';
import { AuthService } from '../app/services/guard/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isAdmin: boolean;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.isAdmin = this.auth.isAdminLogged();
  }

  logout() {
    this.auth.logout();
  }

}
