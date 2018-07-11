import { Component, ViewContainerRef } from '@angular/core';
import { DatePickerService } from 'projects/date-picker/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private datePicker: DatePickerService, private viewContainerRef: ViewContainerRef) {}

  async open() {

    const dayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'September', 'Augustus', 'Oktober', 'November', 'December'];
    const monthNamesShort = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Sep', 'Aug', 'Okt', 'Nov', 'Dec'];
    this.datePicker.setDayNames(dayNames);
    this.datePicker.setMonthNames(monthNames);
    this.datePicker.setMonthNamesShort(monthNamesShort);

    const selected = await this.datePicker.open(this.viewContainerRef, new Date(2016, 1, 14)).toPromise();
    console.log(selected);
  }

  open2() {
    this.datePicker.open(this.viewContainerRef).subscribe(x => console.log(x));
  }
}
