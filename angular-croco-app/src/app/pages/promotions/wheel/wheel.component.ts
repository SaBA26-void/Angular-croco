import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wheel',
  imports: [CommonModule, FormsModule],
  templateUrl: './wheel.component.html',
  styleUrl: './wheel.component.scss'
})
export class WheelComponent {
  selectedSector: number | null = null;
  isSpinning: boolean = false;
  rotation: number = 0;
  errorMessage: string | null = null;
  
  private readonly sectors = 10;
  private readonly sectorAngle = 360 / this.sectors;

  spin(): void {
    if (this.selectedSector === null || this.selectedSector < 1 || this.selectedSector > this.sectors) {
      this.errorMessage = 'The specified sector could not be found.';
      return;
    }

    this.errorMessage = null;
    this.isSpinning = true;

    // Calculate target rotation
    // Pointer is fixed at top (12 o'clock = -90° in SVG coordinates)
    // Sectors are drawn starting from -90° (sector 1 at top)
    // Each sector is 36° wide
    // We want the center of the selected sector to align with the pointer
    
    const targetSector = this.selectedSector - 1; // Convert to 0-based index (0-9)
    
    // Sector centers are at: -90° + (sectorIndex * 36°) + 18°
    // For sector 0: center at -72°
    // For sector 1: center at -36°
    // For sector 2: center at 0°
    // etc.
    
    // To get a sector's center to the pointer at -90°, we need to rotate
    // the wheel so the center moves from its current position to -90°
    // Rotation needed = -90° - (sector center angle)
    
    const sectorCenterAngle = -90 + (targetSector * this.sectorAngle) + (this.sectorAngle / 2);
    const rotationToPointer = -90 - sectorCenterAngle;
    
    // Convert to positive rotation (clockwise)
    const normalizedRotation = rotationToPointer < 0 ? rotationToPointer + 360 : rotationToPointer;
    
    // Add multiple full rotations for spin effect (5 full rotations = 1800 degrees)
    const fullRotations = 5;
    const additionalRotation = fullRotations * 360;
    
    // Calculate final rotation (add to current rotation for cumulative effect)
    this.rotation = this.rotation + additionalRotation + normalizedRotation;
    
    // Reset spinning state after animation completes
    setTimeout(() => {
      this.isSpinning = false;
    }, 3000); // Match animation duration
  }

  getSectorPath(sectorIndex: number): string {
    const centerX = 200;
    const centerY = 200;
    const radius = 180;
    const startAngle = (sectorIndex * this.sectorAngle - 90) * (Math.PI / 180);
    const endAngle = ((sectorIndex + 1) * this.sectorAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = this.sectorAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }

  getSectorTextPosition(sectorIndex: number): { x: number; y: number; rotation: number } {
    const centerX = 200;
    const centerY = 200;
    const textRadius = 120;
    const angle = (sectorIndex * this.sectorAngle + this.sectorAngle / 2 - 90) * (Math.PI / 180);
    const x = centerX + textRadius * Math.cos(angle);
    const y = centerY + textRadius * Math.sin(angle);
    const rotation = sectorIndex * this.sectorAngle + this.sectorAngle / 2;
    
    return { x, y, rotation };
  }

  getSectorColor(index: number): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#82E0AA'
    ];
    return colors[index % colors.length];
  }

  get wheelTransform(): string {
    return `rotate(${this.rotation}deg)`;
  }
}
