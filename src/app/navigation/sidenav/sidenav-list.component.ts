import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';

import { AuthService } from '../../auth/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  userIsAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

  }

  onLogout() {
    this.authService.logout();
  }

  onClose() {
    this.closeSidenav.emit();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
}
