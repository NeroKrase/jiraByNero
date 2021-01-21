import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {CdkDragDrop, transferArrayItem} from "@angular/cdk/drag-drop";
import {ITask} from "../task/task";
import {ITaskDialogResult, TaskDialogComponent} from "../task-dialog/task-dialog.component";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../services/auth.service";
import {UsersService} from "../services/users.service";

const getObservable = (collection: AngularFirestoreCollection<ITask>) => {
  const subject = new BehaviorSubject([])
  collection.valueChanges({idField: 'id'}).subscribe((val: ITask[]) => {
    subject.next(val)
  })
  return subject
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private dialog: MatDialog, private store: AngularFirestore, public auth: AuthService, public usersService: UsersService) {
    this.auth.user$.subscribe(user => {
      this.photoURL = user.photoURL
      this.name = user.displayName
    })
  }

  name: string
  photoURL: string
  todo = getObservable(this.store.collection('todo'))
  inProgress = getObservable(this.store.collection('inProgress'))
  done = getObservable(this.store.collection('done'))

  drop(event: CdkDragDrop<ITask[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.previousContainer.data[event.currentIndex]
    this.store.firestore.runTransaction(() => {
      return Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item)
      ])
    })
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    )
  }

  edit(list: 'done' | 'todo' | 'inProgress', task: ITask): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true
      }
    })
    dialogRef.afterClosed().subscribe((result: ITaskDialogResult) => {
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete()
      } else {
        this.store.collection(list).doc(task.id).update(task)
      }
    })
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {}
      }
    })
    dialogRef.afterClosed().subscribe((result: ITaskDialogResult) => this.store.collection('todo').add(result.task))
  }

}
