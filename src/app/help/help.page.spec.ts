import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPage } from './help.page';
import { HelpPageModule } from './help.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('HelpPage', () => {
  let component: HelpPage;
  let fixture: ComponentFixture<HelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelpPageModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
