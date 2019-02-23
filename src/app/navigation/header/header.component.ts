import {
  Component,
  OnInit,
  AfterViewInit,
  HostBinding,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import { AuthService } from '../../auth/auth.service';

import { Subscription } from 'rxjs';
// import { Subscription, fromEvent } from 'rxjs';
//
// import {
//   distinctUntilChanged,
//   filter,
//   map,
//   pairwise,
//   share,
//   tap,
//   throttleTime
// } from 'rxjs/operators';
//
// export enum VisibilityState {
//   Visible = 'visible',
//   Hidden = 'hidden'
// }
//
// export enum Direction {
//   Up = 'Up',
//   Down = 'Down'
// }

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
  // animations: [
  //   trigger('toggle', [
  //     state(
  //       VisibilityState.Hidden,
  //       style({ opacity: 0, transform: 'translateY(-100%)' })
  //     ),
  //     state(
  //       VisibilityState.Visible,
  //       style({ opacity: 1, transform: 'translateY(0)' })
  //     ),
  //     transition('* => *', animate('200ms ease-in'))
  //   ])
  // ]
})
export class HeaderComponent implements OnInit, OnDestroy {
// export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  // private isVisible = true;
  //
  // @HostBinding('@toggle')
  // get toggle(): VisibilityState {
  //   return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden;
  // }
  //
  // ngAfterViewInit() {
  //   const scroll$ = fromEvent(window, 'scroll').pipe(
  //     throttleTime(10),
  //     map(() => window.pageYOffset),
  //     pairwise(),
  //     map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
  //     distinctUntilChanged(),
  //     share()
  //   );
  //   const goingUp$ = scroll$.pipe(
  //     filter(direction => direction === Direction.Up)
  //   );
  //
  //   const goingDown$ = scroll$.pipe(
  //     filter(direction => direction === Direction.Down)
  //   );
  //
  //   goingUp$.subscribe(() => (this.isVisible = true));
  //   goingDown$.subscribe(() => (this.isVisible = false));
  // }

  @Output() sidenavToggle = new EventEmitter<void>();
  userIsAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

}
