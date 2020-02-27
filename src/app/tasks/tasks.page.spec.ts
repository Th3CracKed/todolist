import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPage } from './tasks.page';
import { RouterTestingModule } from "@angular/router/testing";
import { TasksPageModule } from './tasks.module';
import { TodosListService, TasksService } from '../services';
import { of } from 'rxjs';
import { TodoList, Task } from '../models';

describe('TasksPage', () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;
  let todoListServiceStub: Partial<TodosListService>;
  let tasksServiceSub: Partial<TasksService>;

  todoListServiceStub = {
    getOne: () => of<TodoList>({
      title: 'list1',
      userId: 'user32',
      id: 'fzaazffazfz'
    })
  }
  tasksServiceSub = {
    getAll: (listId: string, withId: boolean = false) => of<Task[]>([]),
    add: (todo: Task) => new Promise((resolve, reject) => resolve()),
    update: (id: string, newTodo: Partial<Task>) => new Promise((resolve, reject) => resolve()),
    delete: (id: string) => new Promise((resolve, reject) => resolve())
  }
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TasksPageModule, RouterTestingModule],
      providers: [
        { provide: TodosListService, useValue: todoListServiceStub },
        { provide: TasksService, useValue: tasksServiceSub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
