import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { UserService } from '../../services/user';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthEffects {
  login$;
  autoLogout$;
  logout$;

  constructor(private actions$: Actions, private userService: UserService) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ email, password }) =>
          this.userService.login(email, password).pipe(
            map(({ user, token }) => {
              localStorage.setItem('auth_token', token);
              localStorage.setItem('user', JSON.stringify(user));
              return AuthActions.loginSuccess({ user, token });
            }),
            catchError((error) =>
              of(AuthActions.loginFailure({ error: error?.message || 'Login failed' }))
            )
          )
        )
      )
    );

    this.autoLogout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        switchMap(({ token }) => {
          try {
            const decoded: any = jwtDecode(token);
            const delay = decoded.exp * 1000 - Date.now();
            return delay > 0 ? timer(delay).pipe(map(() => AuthActions.logout())) : of(AuthActions.logout());
          } catch {
            return of(AuthActions.logout());
          }
        })
      )
    );

    this.logout$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logout),
          tap(() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          })
        ),
      { dispatch: false }
    );
  }
}