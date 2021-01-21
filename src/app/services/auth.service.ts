import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {IUser} from "./user.model";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import firebase from "firebase";
import auth = firebase.auth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<IUser>
  currentUser

  constructor(private afAuth: AngularFireAuth,
              private store: AngularFirestore,
              private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.currentUser = {uid: user.uid, displayName: user.displayName, photoURL: user.photoURL, email: user.email}
          return this.store.doc<IUser>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider()
    const credential = await this.afAuth.signInWithPopup(provider)
    await this.updateUserData(credential.user)
    return this.router.navigate(['/dashboard'])
  }

  async signOut(){
    await this.afAuth.signOut()
    return this.router.navigate(['/auth'])
  }

  private updateUserData({ uid, email, displayName, photoURL }: IUser){
    const userRef: AngularFirestoreDocument<IUser> = this.store.doc(`users/${uid}`)

    const data = {
      uid,
      email,
      displayName,
      photoURL
    }

    return userRef.set(data, { merge: true })
  }

}
