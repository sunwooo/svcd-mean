import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardLogin implements CanActivate {

  constructor(public auth: AuthService, private router: Router) {}

  canActivate() {
    
    //return this.auth.loggedIn;

    if (!this.auth.isAuthenticated()) {
        
        console.log("======================================");
        console.log("invalid token!");
        console.log("======================================");
        
        this.router.navigate(['']);
        return false;
      }
      return true;
  }

}
