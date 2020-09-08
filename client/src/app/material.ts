import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';

const material = [
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatStepperModule,
];

@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {}
