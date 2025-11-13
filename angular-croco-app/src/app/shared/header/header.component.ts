import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateTimeService } from '../../core/services/date-time.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'Angular Croco App';
  currentDateTime: string = '';
  private intervalId: any;

  constructor(private dateTimeService: DateTimeService) {}
  
  ngOnInit(): void {
    this.updateDateTime();
    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateDateTime(): void {
    this.currentDateTime = this.dateTimeService.getCurrentDateTime();
  }
}
