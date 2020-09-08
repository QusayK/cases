import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  basicInfo: FormGroup;
  contactInfo: FormGroup;
  loginInfo: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.basicInfo = this._formBuilder.group({
      company_name: ['', Validators.required],
      address: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
    this.contactInfo = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      identity_number: ['', Validators.required],
    });

    this.loginInfo = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    let manager = {
      ...this.basicInfo.value,
      ...this.contactInfo.value,
      ...this.loginInfo.value,
    };

    this.authService.signup(manager).subscribe();
  }
}
