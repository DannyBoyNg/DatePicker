import { Component, ViewContainerRef } from '@angular/core';
import { DatePickerService } from 'projects/date-picker/src/public-api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private datePicker: DatePickerService, private viewContainerRef: ViewContainerRef) {}

  changeLanguageToDutch() {
    //customize names of days and months
    const dayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    const monthNamesShort = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
    this.datePicker.setDayNames(dayNames);
    this.datePicker.setMonthNames(monthNames);
    this.datePicker.setMonthNamesShort(monthNamesShort);
  }

  resetLanguage() {
    this.datePicker.setDefaultLanguage();
  }

  setReturnType(returnType: 'Date'|'ISO') {
    this.datePicker.setReturnType(returnType);
  }

  //Example using async/await
  async open(): Promise<void> {
    const selected = await firstValueFrom(this.datePicker.open(this.viewContainerRef, new Date(2016, 1, 14))); //pre-select a specific date
    console.log(selected);
  }

  //Example using RxJs
  open2(): void {
    this.datePicker.open(this.viewContainerRef).subscribe(x => console.log(x));
  }
}
