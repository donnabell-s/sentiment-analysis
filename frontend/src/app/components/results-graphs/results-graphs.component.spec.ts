import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsGraphsComponent } from './results-graphs.component';

describe('ResultsGraphsComponent', () => {
  let component: ResultsGraphsComponent;
  let fixture: ComponentFixture<ResultsGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsGraphsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
