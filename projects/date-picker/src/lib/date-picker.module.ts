import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  entryComponents: [DatePickerComponent]
})
export class DatePickerModule { }
