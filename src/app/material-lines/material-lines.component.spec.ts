import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialLinesComponent } from './material-lines.component';

describe('MaterialLinesComponent', () => {
  let component: MaterialLinesComponent;
  let fixture: ComponentFixture<MaterialLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
