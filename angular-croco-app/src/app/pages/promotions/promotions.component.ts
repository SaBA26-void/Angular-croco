import { Component } from '@angular/core';
import { WheelComponent } from './wheel/wheel.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@Component({
  selector: 'app-promotions',
  imports: [WheelComponent, LeaderboardComponent],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export class PromotionsComponent {

}
