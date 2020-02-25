import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlistPage } from './add-list.page';
import { AddlistPageModule } from './add-list.module';
import { TodosListService, Globals } from 'src/app/services';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddlistPage', () => {
  let component: AddlistPage;
  let fixture: ComponentFixture<AddlistPage>;

  beforeEach(async(() => {
    let todosListService = jasmine.createSpyObj('TodosListService', ['add']);
    let globals = { currentUserId: 'userId'};
    TestBed.configureTestingModule({
      imports: [
        AddlistPageModule,
        RouterTestingModule
      ],
      providers: [
        { provide: TodosListService, todosListService },
        { provide: Globals, global: globals }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
