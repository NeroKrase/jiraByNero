export interface ITask {
  id?: string;
  title: string;
  description?: string;
  issue: {
    title: string;
    icon: string;
    color: string;
  };
  priority: {
    title: string;
    icon: string;
    color: string;
  };
  assignee: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
  }
  dueDate: Date;
}
