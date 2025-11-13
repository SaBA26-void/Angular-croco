import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`).pipe(
      catchError((error) => {
        console.error('Error fetching posts:', error);
        return of([]);
      })
    );
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts?userId=${userId}`).pipe(
      catchError((error) => {
        console.error(`Error fetching posts for user ${userId}:`, error);
        return of([]);
      })
    );
  }

  getTodosByUser(userId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.baseUrl}/todos?userId=${userId}`).pipe(
      catchError((error) => {
        console.error(`Error fetching todos for user ${userId}:`, error);
        return of([]);
      })
    );
  }
}
