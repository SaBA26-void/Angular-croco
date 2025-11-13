import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Todo } from '../../core/models/todo.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-todos',
  imports: [CommonModule, RouterModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  user: User | null = null;
  userId: number | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = +userIdParam;
      this.loadData();
    } else {
      this.error = 'Invalid user ID';
    }
  }

  loadData(): void {
    if (!this.userId) return;

    this.loading = true;
    this.error = null;

    // Load user info first
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.user = users.find(u => u.id === this.userId!) || null;
        this.loadTodos();
      },
      error: (error) => {
        this.error = 'Failed to load user information.';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  loadTodos(): void {
    if (!this.userId) return;

    this.apiService.getTodosByUser(this.userId).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load todos. Please try again later.';
        this.loading = false;
        console.error('Error loading todos:', error);
      }
    });
  }

  getUserName(): string {
    return this.user?.name || `User ${this.userId}`;
  }

  getCompletedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

  getPendingCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
