import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaVgComponent } from './edita-vg.component';

describe('EditaVgComponent', () => {
  let component: EditaVgComponent;
  let fixture: ComponentFixture<EditaVgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditaVgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditaVgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
