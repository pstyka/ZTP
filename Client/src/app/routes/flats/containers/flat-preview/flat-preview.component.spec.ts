import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatPreviewComponent } from './flat-preview.component';

describe('FlatPreviewComponent', () => {
  let component: FlatPreviewComponent;
  let fixture: ComponentFixture<FlatPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
