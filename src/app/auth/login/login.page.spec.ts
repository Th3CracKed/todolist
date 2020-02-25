import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPage } from './login.page';
import { LoginPageModule } from './login.module';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { Globals } from 'src/app/services';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    let angularFireAuthSpy = jasmine.createSpyObj('AngularFireAuth', ['auth']);
    let globals = { currentUserId: 'userId'};
    TestBed.configureTestingModule({
      imports: [
        LoginPageModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AngularFireAuth, useValue: angularFireAuthSpy },
        { provide: Globals, globals }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
