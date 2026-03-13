import { AbstractControl, ValidationErrors } from '@angular/forms';

export function alphabeticValidator(control: AbstractControl): ValidationErrors | null {
  const alphabeticPattern = /^[a-zA-Z\s]*$/;
  const valid = alphabeticPattern.test(control.value);
  return valid ? null : { alphabetic: true };
}
