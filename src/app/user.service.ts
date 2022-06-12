import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { User } from './user';
import { USERS } from './users/mock-users';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private messageService: MessageService) { }

  getUsers(): Observable<User[]> {
    const users = of(USERS);
    this.messageService.add('UserService: fetched users');
    return users;
  }
}
