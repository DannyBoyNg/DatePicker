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

## License

This project is licensed under the MIT License.

## Contributions

Contributions are welcome.
