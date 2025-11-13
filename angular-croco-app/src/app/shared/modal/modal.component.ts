import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() body: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modalOverlay', { static: false }) modalOverlay?: ElementRef;
  @ViewChild('modalContent', { static: false }) modalContent?: ElementRef;

  isClosing: boolean = false;

  ngOnInit(): void {
    this.updateBodyOverflow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      const wasOpen = changes['isOpen'].previousValue;
      const isNowOpen = changes['isOpen'].currentValue;

      if (!wasOpen && isNowOpen) {
        this.isClosing = false;
        this.updateBodyOverflow();
      } else if (wasOpen && !isNowOpen && !this.isClosing) {
        this.triggerCloseAnimation();
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  private updateBodyOverflow(): void {
    if (this.isOpen && !this.isClosing) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  private triggerCloseAnimation(): void {
    this.isClosing = true;
    this.updateBodyOverflow();
    
    setTimeout(() => {
      this.isClosing = false;
    }, 300);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && !this.isClosing) {
      this.close();
    }
  }

  close(): void {
    if (!this.isClosing) {
      this.triggerCloseAnimation();
      setTimeout(() => {
        this.closeModal.emit();
      }, 300);
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isClosing) {
      this.close();
    }
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  get overlayClass(): string {
    return this.isClosing ? 'modal-overlay modal-closing' : 'modal-overlay';
  }

  get contentClass(): string {
    return this.isClosing ? 'modal-content modal-closing' : 'modal-content';
  }
}
