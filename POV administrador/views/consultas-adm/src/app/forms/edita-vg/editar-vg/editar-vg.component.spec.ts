import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarVgComponent } from './editar-vg.component';

describe('EditarVgComponent', () => {
  let component: EditarVgComponent;
  let fixture: ComponentFixture<EditarVgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarVgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarVgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
