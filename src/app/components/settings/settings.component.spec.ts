import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';

const mockGameService = jasmine.createSpyObj('GameService', ['setReactionTime']);


describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [{ provide: GameService, useValue: mockGameService }],
      declarations: [SettingsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameService.setReactionTime with reactionTime', () => {
    const mockReactionTime = 1500;
    component['time'] = mockReactionTime;
    component.timeChoosed();
    expect(mockGameService.setReactionTime).toHaveBeenCalledWith(mockReactionTime);
  });
});
