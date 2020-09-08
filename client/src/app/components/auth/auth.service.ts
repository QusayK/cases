import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface User {
  img: string;
  company_name: string;
  address: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  identity_number: number;
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(user: User) {
    return this.http.post('http://localhost:5000/api/manager', user).pipe(
      tap((res) => {
        console.log(res);
      })
    );
  }
}
