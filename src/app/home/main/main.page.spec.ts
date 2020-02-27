import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPage } from './main.page';
import { MainPageModule } from './main.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { TodosListService } from 'src/app/services';

describe('MainPage', () => {
  let component: MainPage;
  let fixture: ComponentFixture<MainPage>;

  beforeEach(async(() => {
    let actionSheetController = jasmine.createSpyObj('ActionSheetController', ['create']);
    let toastController = jasmine.createSpyObj('ToastController', ['create']);
    let alertController = jasmine.createSpyObj('AlertController', ['create']);
    let todosListService = jasmine.createSpyObj('TodosListService', ['getAll', 'delete']);
    TestBed.configureTestingModule({
      imports: [
        MainPageModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActionSheetController, useValue: actionSheetController},
        { provide: ToastController, useValue: toastController},
        { provide: AlertController, useValue: alertController},
        { provide: TodosListService, useValue: todosListService},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
