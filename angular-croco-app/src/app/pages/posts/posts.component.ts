import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Post } from '../../core/models/post.model';
import { User } from '../../core/models/user.model';
import { ModalComponent } from '../../shared/modal/modal.component';

interface PostWithUsername extends Post {
  username?: string;
}

@Component({
  selector: 'app-posts',
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  postsWithUsername: PostWithUsername[] = [];
  users: User[] = [];
  loading: boolean = false;
  error: string | null = null;
  userId: number | null = null;
  
  modalOpen: boolean = false;
  selectedPost: Post | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] ? +params['userId'] : null;
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadPosts();
      },
      error: (error) => {
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  loadPosts(): void {
    if (this.userId) {
      this.apiService.getPostsByUser(this.userId).subscribe({
        next: (posts) => {
          this.posts = posts;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load posts. Please try again later.';
          this.loading = false;
          console.error('Error loading posts:', error);
        }
      });
    } else {
      this.apiService.getPosts().subscribe({
        next: (posts) => {
          this.posts = posts;
          this.mapUsernames();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load posts. Please try again later.';
          this.loading = false;
          console.error('Error loading posts:', error);
        }
      });
    }
  }

  mapUsernames(): void {
    this.postsWithUsername = this.posts.map(post => {
      const user = this.users.find(u => u.id === post.userId);
      return {
        ...post,
        username: user?.username || 'Unknown User'
      };
    });
  }

  getUsername(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user?.username || 'Unknown User';
  }

  getPostPreview(body: string, maxLength: number = 150): string {
    if (body.length <= maxLength) {
      return body;
    }
    return body.substring(0, maxLength) + '...';
  }

  openModal(post: Post): void {
    this.selectedPost = post;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedPost = null;
  }

  clearFilter(): void {
    this.router.navigate(['/posts']);
  }
}
