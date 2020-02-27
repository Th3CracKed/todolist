import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilPage } from './profil.page';
import { ProfilPageModule } from './profil.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfilPage', () => {
  let component: ProfilPage;
  let fixture: ComponentFixture<ProfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ProfilPageModule,
      RouterTestingModule
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
