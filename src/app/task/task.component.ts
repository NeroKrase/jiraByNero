import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ITask} from "./task";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  date
  @Input() task: ITask
  @Output() edit = new EventEmitter()
  constructor() {
  }

  ngOnInit(): void {
  }

}
