import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Leaderboard } from '../../../core/models/leaderboard.model';

type WeekFilter = 'I' | 'II' | 'III' | 'IV' | 'ALL';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  allRecords: Leaderboard[] = [];
  filteredRecords: Leaderboard[] = [];
  activeFilter: WeekFilter = 'ALL';
  weeks: WeekFilter[] = ['I', 'II', 'III', 'IV', 'ALL'];

  ngOnInit(): void {
    this.generateLeaderboardData();
    this.filterRecords();
  }

  generateLeaderboardData(): void {
    const records: Leaderboard[] = [];
    const weeks: Array<'I' | 'II' | 'III' | 'IV'> = ['I', 'II', 'III', 'IV'];
    let customerId = 1;


    const minRecordsPerWeek = 12;
    const maxRecordsPerWeek = 15;
    
    weeks.forEach(week => {
      const recordsPerWeek = Math.floor(Math.random() * (maxRecordsPerWeek - minRecordsPerWeek + 1)) + minRecordsPerWeek;
      
      for (let place = 1; place <= recordsPerWeek; place++) {
        records.push({
          customerId: customerId++,
          loginName: this.generateRandomLoginName(),
          place: place,
          week: week
        });
      }
    });

    this.allRecords = this.shuffleArray(records);
  }

  private generateRandomLoginName(): string {
    const adjectives = ['Cool', 'Swift', 'Brave', 'Smart', 'Fast', 'Bright', 'Sharp', 'Bold', 'Quick', 'Wise'];
    const nouns = ['Tiger', 'Eagle', 'Lion', 'Wolf', 'Fox', 'Hawk', 'Bear', 'Shark', 'Falcon', 'Panther'];
    const numbers = Math.floor(Math.random() * 1000);
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${numbers}`;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  setFilter(week: WeekFilter): void {
    this.activeFilter = week;
    this.filterRecords();
  }

  filterRecords(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredRecords = [...this.allRecords];
    } else {
      this.filteredRecords = this.allRecords.filter(record => record.week === this.activeFilter);
      this.filteredRecords.sort((a, b) => a.place - b.place);
    }
  }

  getWeekCount(week: WeekFilter): number {
    if (week === 'ALL') {
      return this.allRecords.length;
    }
    return this.allRecords.filter(record => record.week === week).length;
  }
}
