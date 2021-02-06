import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoauthComponent } from './noauth.component';

describe('NoauthComponent', () => {
  let component: NoauthComponent;
  let fixture: ComponentFixture<NoauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
