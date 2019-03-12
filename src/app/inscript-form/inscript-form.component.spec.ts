import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptFormComponent } from './inscript-form.component';

describe('InscriptFormComponent', () => {
    let component: InscriptFormComponent;
    let fixture: ComponentFixture<InscriptFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InscriptFormComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InscriptFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});