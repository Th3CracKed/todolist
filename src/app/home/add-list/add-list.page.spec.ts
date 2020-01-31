import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddlistPage } from './add-list.page';

describe('AddlistPage', () => {
  let component: AddlistPage;
  let fixture: ComponentFixture<AddlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
