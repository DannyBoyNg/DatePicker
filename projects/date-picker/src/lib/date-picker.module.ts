import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatePickerComponent } from './date-picker.component';



@NgModule({
  declarations: [DatePickerComponent],
  imports: [
    CommonModule
  ],
  exports: [DatePickerComponent]
})
export class DatePickerModule { }
