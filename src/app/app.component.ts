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
    const selected = await this.datePicker.open(this.viewContainerRef).toPromise();
    console.log('selected: ');
    console.log(selected);
  }
}
