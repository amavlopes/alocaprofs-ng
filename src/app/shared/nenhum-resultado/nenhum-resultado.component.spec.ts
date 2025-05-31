import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NenhumResultadoComponent } from './nenhum-resultado.component';

describe('NenhumResultadoComponent', () => {
  let component: NenhumResultadoComponent;
  let fixture: ComponentFixture<NenhumResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NenhumResultadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NenhumResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
