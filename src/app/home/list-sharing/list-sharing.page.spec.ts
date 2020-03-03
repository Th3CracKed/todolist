import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListSharingPage } from './list-sharing.page';

describe('ListSharingPage', () => {
  let component: ListSharingPage;
  let fixture: ComponentFixture<ListSharingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSharingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListSharingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
