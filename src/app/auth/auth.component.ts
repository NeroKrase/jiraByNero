import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent{

  constructor(public auth: AuthService, private router: Router) {
    if(auth.user$){
      router.navigate(['/dashboard'])
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,
      Validators.minLength(6),
      Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')])
  })
  hide: boolean = true

  get loginEmail() {
    return this.loginForm.get('email')
  }

  get loginPassword() {
    return this.loginForm.get('password')
  }

}
