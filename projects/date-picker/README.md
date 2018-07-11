# Datepicker

An Angular library to display a datepicker

## Dependancies

none

## Installing

Install from NPM

```bash
npm install @dannyboyng/datepicker
```

## Usage

Basic

```typescript
constructor(
  private datepicker: DatePickerService,
  private viewContainerRef: ViewContainerRef, // get viewContainerRef from Dependancy Injection
) {}

open() {
  this.datepicker.open(this.viewContainerRef).subscribe((date: Date) => console.log(date)); // no need to unsubscribe. It is done automatically
}

async open2() {
  const date: Date = await this.datepicker.open(this.viewContainerRef).toPromise<Date>());
  console.log(date); // will return undefined if datepicker is closed and no date is selected
}
```

Advanced  

```typescript
// show a preSelected date. 14 feb 2016. Month is zero based. The default is to show the current date (today)
const selected = await this.datePicker.open(this.viewContainerRef, new Date(2016, 1, 14)).toPromise();

// use a different language for day and month names. You only have to do this once.
// will throw an Error if anything else but string array is provided or if array size does not match.
const dayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'September', 'Augustus', 'Oktober', 'November', 'December'];
const monthNamesShort = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Sep', 'Aug', 'Okt', 'Nov', 'Dec'];
this.datePicker.setDayNames(dayNames);
this.datePicker.setMonthNames(monthNames);
this.datePicker.setMonthNamesShort(monthNamesShort);
```

## License

This project is licensed under the MIT License.

## Contributions

Contributions are welcome.
