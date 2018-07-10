import { NgModule } from '@angular/core';
import { DatePickerComponent } from './date-picker.component';
import { CommonModule } from '../../../../node_modules/@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  entryComponents: [DatePickerComponent]
})
export class DatePickerModule { }
