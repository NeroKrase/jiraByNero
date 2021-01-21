import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ITask} from "../task/task";
import {UsersService} from "../services/users.service";
import {AuthService} from "../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent {

  issues = [
    {title: 'Epic', icon: 'flash_on', color: '#36b9cc'},
    {title: 'User story', icon: 'bookmark', color: '#f6c23e'},
    {title: 'Task', icon: 'check_box', color: '#4e73df'},
    {title: 'New feature', icon: 'add_box', color: '#1cc88a'},
    {title: 'Bug', icon: 'bug_report', color: '#e74a3b'}
  ]

  priorities = [
    {title: 'Blocker', icon: 'block', color: '#e74a3b'},
    {title: 'Critical', icon: 'warning', color: '#e74a3b'},
    {title: 'Major', icon: 'arrow_circle_up', color: '#e74a3b'},
    {title: 'Minor', icon: 'arrow_circle_down', color: '#1cc88a'},
    {title: 'Trivial', icon: 'south', color: '#1cc88a'}
  ]
  minDate: Date;
  currentDate: Date;

  private backupTask: Partial<ITask> = {...this.data.task}

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    public usersService: UsersService,
    public auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: ITaskDialogData
  ) {
    if (!this.data.task.title) {
      this.data.task.title = 'Title'
    }
    if (!this.data.task.assignee) {
      this.data.task.assignee = this.usersService.users.find(el => el.uid === this.auth.currentUser.uid)
    }
    else {
      this.data.task.assignee = this.usersService.users.find(el => el.uid === this.data.task.assignee.uid)
    }
    if(!this.data.task.description){
      this.data.task.description = ''
    }
    if (!this.data.task.issue) {
      this.data.task.issue = this.issues[2]
    }
    else {
      this.data.task.issue = this.issues.find(el => el.title === this.data.task.issue.title)
    }
    if (!this.data.task.priority) {
      this.data.task.priority = this.priorities[2]
    }
    else {
      this.data.task.priority = this.priorities.find(el => el.title === this.data.task.priority.title)
    }
    if (!this.data.task.dueDate) {
      this.data.task.dueDate = new Date(Date.now())
    }
    else{
      // @ts-ignore
      this.data.task.dueDate = new Date(this.data.task.dueDate.seconds * 1000)
    }
    this.minDate = new Date(Date.now());
  }

  taskForm = new FormGroup({
    title: new FormControl(this.data.task.title, Validators.required),
    description: new FormControl(this.data.task.description),
    issue: new FormControl('', Validators.required),
    assignee: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)
  })

  get title(){
    return this.taskForm.get('title')
  }

  get description(){
    return this.taskForm.get('description')
  }

  get issue(){
    return this.taskForm.get('issue')
  }

  get assignee(){
    return this.taskForm.get('assignee')
  }

  get priority(){
    return this.taskForm.get('priority')
  }

  get date(){
    return this.taskForm.get('date')
  }

  cancel() {
    this.data.task.title = this.backupTask.title
    this.data.task.description = this.backupTask.description
    this.data.task.assignee = this.backupTask.assignee
    this.data.task.issue = this.backupTask.issue
    this.data.task.priority = this.backupTask.priority
    this.data.task.dueDate = this.backupTask.dueDate
    this.dialogRef.close(this.data)
  }

}

export interface ITaskDialogData {
  task: ITask
  enableDelete: boolean
}

export interface ITaskDialogResult {
  task: ITask
  delete?: boolean
}
