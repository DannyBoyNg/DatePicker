import { ComponentRef } from '@angular/core';
import { DatePickerComponent } from './date-picker.component';
import { Subject } from 'rxjs';

export interface Week {
  yearNumber: number;
  weekNumber: number;
  daysCollection: Day[];
}

export interface Day {
  dayOfMonth: string;
  dayOfWeek?: number;
  month?: number;
  year?: number;
  shaded?: boolean;
  today?: boolean;
}

export interface DatePickerInstance {
  componentRef: ComponentRef<DatePickerComponent>;
  responseRef: Subject<any>;
  dayNames: string[];
  monthNames: string[];
  monthNamesShort: string[];
  preSelectDate?: Date;
}
