import { Component, HostListener, SimpleChange, OnDestroy, OnChanges, ComponentRef } from '@angular/core';
import { Week, Day, DatePickerInstance } from './date-picker.interfaces';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements OnChanges, OnDestroy {

  // References
  responseRef: Subject<Date>|undefined;
  componentRef: ComponentRef<DatePickerComponent>|undefined;
  // Month picker
  monthPickerYear: number|undefined;
  monthPickerMonth: number|undefined;
  // Date picker
  datePickerYear: number|undefined;
  datePickerMonth: number|undefined;
  datePickerWeek: number|undefined;
  datePickerDay: number|undefined;
  datesArray: Week[]|undefined;
  firstDay: Date|undefined;
  startingDay: number|undefined;

  // Locale settings
  dayNames: string[]|undefined;
  monthNames: string[]|undefined;
  monthNamesShort: string[]|undefined;
  // State variables
  year: number|undefined;
  month: number|undefined;
  week: number|undefined;
  monthName: string|undefined|undefined;
  selectedYear: number|undefined;
  selectedMonth: number|undefined;
  selectedWeek: number|undefined;
  selectedDay: number|undefined;
  navbarLabel: string|undefined;

  constructor() {}

  @HostListener('document:keydown', ['$event'])
  keyPressed(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.closeDatePicker();
    }
  }

  // Component Lifecycle hooks
  ngOnChanges (changes: {[propKey: string]: SimpleChange}) {
    if (changes['weekPickerMonth']) {
      const year = (changes['weekPickerYear']) ? changes['weekPickerYear'].currentValue : this.year;
      this.getDates(year, changes['weekPickerMonth'].currentValue);
    }
  }

  ngOnDestroy() {
    if (this.responseRef != null) {
      this.responseRef.complete();
      this.responseRef.unsubscribe();
    }
  }

  init(instance: DatePickerInstance) {
    this.componentRef = instance.componentRef;
    this.responseRef = instance.responseRef;
    this.dayNames = instance.dayNames;
    this.monthNames = instance.monthNames;
    this.monthNamesShort = instance.monthNamesShort;

    const d = (instance.preSelectDate != null) ? instance.preSelectDate : new Date();
    this.monthPickerYear = d.getFullYear();
    this.monthPickerMonth = d.getMonth() + 1;
    this.datePickerYear = d.getFullYear();
    this.datePickerMonth = d.getMonth() + 1;
    this.datePickerWeek = this.getWeekNumber(d);
    this.datePickerDay = d.getDate();

    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.week = this.getWeekNumber(d);
    this.selectedYear = this.year;
    this.selectedMonth = this.month;
    this.selectedWeek = this.week;
    this.selectedDay = d.getDate();
    this.monthName = this.monthNames[this.month];

    this.getDates(this.datePickerYear, this.datePickerMonth);
  }

  // Component Logic
  monthPickerNextYear(): void {
    if (this.monthPickerYear != null) {this.monthPickerYear++; }
  }

  monthPickerPrevYear(): void {
    if (this.monthPickerYear != null) {this.monthPickerYear--; }
  }

  dayPickerNextMonth(): void {
    if (this.datePickerMonth == null || this.datePickerYear == null) {return; }
    this.datePickerMonth++;
    if (this.datePickerMonth > 12) {
      this.datePickerMonth = 1;
      this.datePickerYear++;
      this.monthPickerYear = this.datePickerYear;
    }
    this.monthPickerMonth = this.datePickerMonth;
    this.getDates(this.datePickerYear, this.datePickerMonth);
  }

  dayPickerPrevMonth(): void {
    if (this.datePickerMonth == null || this.datePickerYear == null) {return; }
    this.datePickerMonth--;
    if (this.datePickerMonth < 1) {
      this.datePickerMonth = 12;
      this.datePickerYear--;
      this.monthPickerYear = this.datePickerYear;
    }
    this.monthPickerMonth = this.datePickerMonth;
    this.getDates(this.datePickerYear, this.datePickerMonth);
  }

  reset(): void {
    this.datePickerYear = this.year;
    this.datePickerMonth = this.month;
    this.datePickerWeek = this.week;
    this.monthPickerYear = this.year;
    this.monthPickerMonth = this.month;
    if (this.datePickerYear != null && this.datePickerMonth != null) {this.getDates(this.datePickerYear, this.datePickerMonth); }
  }

  selectMonth(year: number|undefined, month: number): void {
    this.datePickerYear = year;
    this.datePickerMonth = month;
    this.monthPickerMonth = month;
    if (year != null) {this.getDates(year, month); }
  }

  selectDate(year: number, month: number, day: number): void {
    this.closeDatePicker(new Date(year, month - 1, day));
  }

  getDates(year: number, month: number): void {
    this.datesArray = [];
    let counter = 1;
    const weeksInMonth = this.weeksInMonth(year, month);
    const daysInMonth = this.daysInMonth(year, month);
    this.firstDay = new Date(year, month - 1, 1);
    this.startingDay = this.getDayOfWeek(this.firstDay); // 0-6
    for (let i = 0; i < weeksInMonth; i++) {
      const weekNumber = this.getWeekNumber(new Date(year, month - 1, counter));
      const week = {yearNumber: year, weekNumber: weekNumber, daysCollection: [] as Day[]};
      for (let j = 0; j < 7; j++) {
        if (counter <= daysInMonth && (i > 0 || j >= this.startingDay)) {
          const dayLabel: string = counter.toString();
          const day: Day = {dayOfMonth: dayLabel, month: month, year: year};
          if (this.isDateToday(year, month, counter)) {
            day.today = true;
          }
          week.daysCollection.push(day);
          counter++;
        } else {
          if (i === 0) {
            const f = new Date(this.firstDay);
            f.setDate(f.getDate() - (this.startingDay - j));
            const day: Day = {
              dayOfMonth: f.getDate().toString(),
              month: f.getMonth() + 1,
              year: (f.getMonth() === 0) ? f.getFullYear() - 1 : f.getFullYear()
            };
            day.shaded = true;
            week.daysCollection.push(day);
          } else {
            const l = new Date(year, month, 0);
            l.setDate(l.getDate() + (j - this.getDayOfWeek(l)));
            const dayLabel: string = l.getDate().toString();
            const day: Day = {
              dayOfMonth: dayLabel,
              month: l.getMonth() + 1,
              year: (l.getMonth() === 11) ? l.getFullYear() + 1 : l.getFullYear()
            };
            day.shaded = true;
            week.daysCollection.push(day);
          }
        }
      }
      this.datesArray.push(week);
    }
  }

  daysInMonth(year: number, monthNumber: number): number {
    const lastOfMonth = new Date(year, monthNumber, 0);
    return lastOfMonth.getDate();
  }

  weeksInMonth(year: number, monthNumber: number): number {
    const firstOfMonth = new Date(year, monthNumber - 1, 1);
    const lastOfMonth = new Date(year, monthNumber, 0);
    return Math.ceil((this.getDayOfWeek(firstOfMonth) + lastOfMonth.getDate()) / 7);
  }

  isDateToday(year: number, monthNumber: number, day: number): boolean {
    const today = new Date();
    const otherDate = new Date(year, monthNumber - 1, day);
    return today.toDateString() === otherDate.toDateString();
  }

  getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((+d - +yearStart) / 86400000) + 1) / 7);
    return weekNo;
  }

  getDayOfWeek(date: Date): number {
    return (date.getDay() + 6) % 7; // 0-6. 0 is Monday instead of Sunday
  }

  clickOutsideDatePicker() {
    this.closeDatePicker();
  }

  closeDatePicker(response?: any) {
    if (response != null && this.responseRef != null) {
      this.responseRef.next(response);
      this.responseRef.complete();
    }
    if (this.componentRef != null) {this.componentRef.destroy(); }
  }

}
