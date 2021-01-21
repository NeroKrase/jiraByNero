import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {IUser} from "./user.model";
import {AngularFirestore} from "@angular/fire/firestore";
import {first, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users = []

  constructor(
    private store: AngularFirestore
  ) {
    this.store.collection('users').valueChanges().subscribe(users => this.users = users)
  }
}
