import { Injectable, Inject, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DatePickerComponent } from './date-picker.component';
import { DatePickerInstance } from './date-picker.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DatePickerService {

  dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  open(viewContainerRef: ViewContainerRef, preSelectDate?: Date): Observable<Date> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
    const componentRef = viewContainerRef.createComponent(factory);
    const responseRef = new Subject<Date>();
    const instance: DatePickerInstance = {
      componentRef,
      responseRef,
      dayNames: this.dayNames,
      monthNames: this.monthNames,
      monthNamesShort: this.monthNamesShort,
      preSelectDate
    };
    componentRef.instance.init(instance);
    return responseRef.asObservable();
  }

  setDayNames(dayNames: string[]): void {
    if (!Array.isArray(dayNames) || dayNames.length !== 7) {
      throw new Error('DatePicker: dayNames array is not valid');
    }
    for (const item of dayNames) {
      if (typeof item !== 'string') {
        throw new Error('DatePicker: dayNames array is not valid');
      }
    }
    this.dayNames = dayNames;
  }

  setMonthNames(monthNames: string[]): void {
    if (!Array.isArray(monthNames) || monthNames.length !== 12) {
      throw new Error('DatePicker: monthNames array is not valid');
    }
    for (const item of monthNames) {
      if (typeof item !== 'string') {
        throw new Error('DatePicker: monthNames array is not valid');
      }
    }
    this.monthNames = monthNames;
  }

  setMonthNamesShort(monthNamesShort: string[]): void {
    if (!Array.isArray(monthNamesShort) || monthNamesShort.length !== 12) {
      throw new Error('DatePicker: monthNamesShort array is not valid');
    }
    for (const item of monthNamesShort) {
      if (typeof item !== 'string') {
        throw new Error('DatePicker: monthNamesShort array is not valid');
      }
    }
    this.monthNamesShort = monthNamesShort;
  }
}
