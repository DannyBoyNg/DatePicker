import { Injectable, Inject, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DatePickerComponent } from './date-picker.component';
import { DatePickerInstance } from './date-picker.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DatePickerService {

  constructor(
    @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  open(viewContainerRef: ViewContainerRef): Observable<Date> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
    const componentRef = viewContainerRef.createComponent(factory);
    const responseRef = new Subject<Date>();
    const instance: DatePickerInstance = {
      componentRef: componentRef,
      responseRef: responseRef
    };
    componentRef.instance.init(instance);
    return responseRef.asObservable();
  }
}
