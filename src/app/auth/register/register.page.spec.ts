import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPage } from './register.page';
import { RegisterPageModule } from './register.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from '@angular/fire/auth';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  let angularFireAuthSpy = jasmine.createSpyObj('AngularFireAuth', ['auth']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RegisterPageModule, RouterTestingModule],
      providers: [
        { provide: AngularFireAuth, useValue: angularFireAuthSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
