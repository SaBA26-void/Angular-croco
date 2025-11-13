import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchQuery: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  getFirstName(name: string): string {
    const parts = name.trim().split(' ');
    return parts[0] || '';
  }

  getLastName(name: string): string {
    const parts = name.trim().split(' ');
    return parts.slice(1).join(' ') || '';
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => {
      const firstName = this.getFirstName(user.name).toLowerCase();
      const lastName = this.getLastName(user.name).toLowerCase();
      const email = user.email.toLowerCase();

      return firstName.includes(query) ||
             lastName.includes(query) ||
             email.includes(query);
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredUsers = this.users;
  }

  viewPosts(userId: number): void {
    this.router.navigate(['/posts'], { queryParams: { userId } });
  }

  viewTodos(userId: number): void {
    this.router.navigate(['/todos', userId]);
  }
}
