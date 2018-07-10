import { Component, OnInit, HostListener, SimpleChange, OnDestroy, OnChanges, ComponentRef } from '@angular/core';
import { Week, Day, DatePickerInstance } from './date-picker.interfaces';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements OnInit, OnChanges, OnDestroy {

  // References
  responseRef: Subject<Date>|undefined;
  componentRef: ComponentRef<DatePickerComponent>|undefined;
  // Month picker
  monthPickerYear!: number;
  monthPickerMonth!: number;
  // Date picker
  datePickerYear!: number;
  datePickerMonth!: number;
  datePickerWeek!: number;
  datePickerDay!: number;
  datesArray: Week[]|undefined;
  firstDay: Date|undefined;
  startingDay: number|undefined;

  // Shared variables
  dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // State variables
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  week: number = this.getWeekNumber(new Date());
  monthName: string = this.monthNames[this.month];
  selectedYear: number = this.year;
  selectedMonth: number = this.month;
  selectedWeek: number = this.week;
  selectedDay: number = new Date().getDate();
  navbarLabel: string|undefined;

  constructor() {}

  @HostListener('document:keydown', ['$event'])
  keyPressed(e: KeyboardEvent) {
    const key = e.which || e.keyCode || 0;
    if (key === 27) {
      this.closeDatePicker();
    }
  }

  // Component Lifecycle hooks
  ngOnInit() {
    const d = new Date();
    this.monthPickerYear = d.getFullYear();
    this.monthPickerMonth = d.getMonth() + 1;
    this.datePickerYear = d.getFullYear();
    this.datePickerMonth = d.getMonth() + 1;
    this.datePickerWeek = this.getWeekNumber(new Date());
    this.datePickerDay = d.getDate();
    this.getDates(this.datePickerYear, this.datePickerMonth);
  }

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
    this.getDates(this.datePickerYear, this.datePickerMonth);
  }

  selectMonth(year: number, month: number): void {
    this.datePickerYear = year;
    this.datePickerMonth = month;
    this.monthPickerMonth = month;
    this.getDates(year, month);
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
            const day: Day = {dayOfMonth: f.getDate().toString(), month: f.getMonth() + 1, year: (f.getMonth() === 0) ? f.getFullYear() - 1 : f.getFullYear()};
            day.shaded = true;
            week.daysCollection.push(day);
          } else {
            const l = new Date(year, month, 0);
            l.setDate(l.getDate() + (j - this.getDayOfWeek(l)));
            const dayLabel: string = l.getDate().toString();
            const day: Day = {dayOfMonth: dayLabel, month: l.getMonth() + 1, year: (l.getMonth() === 11) ? l.getFullYear() + 1 : l.getFullYear()};
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
