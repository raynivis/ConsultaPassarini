import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroVgComponent } from './cadastro-vg.component';


describe('CadastroVgComponent', () => {
  let component: CadastroVgComponent;
  let fixture: ComponentFixture<CadastroVgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroVgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroVgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
