import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceSyncComponent } from './force-sync.component';

describe('ForceSyncComponent', () => {
  let component: ForceSyncComponent;
  let fixture: ComponentFixture<ForceSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
