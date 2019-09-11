import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  alternate: boolean = true;
  toggle: boolean = true;
  color: boolean = false;
  size: number = 35;
  expandEnabled: boolean = true;
  side = 'left';

  entries = [
    {
      header: 'header',
      content: 'content'
    }
  ];

  addEntry() {
    this.entries.push({
      header: 'header',
      content: 'content'
    });
  }

  removeEntry() {
    this.entries.pop();
  }

  onHeaderClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onDotClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onExpandEntry(expanded, index) {
    console.log(`Expand status of entry #${index} changed to ${expanded}`);
  }

  toggleSide() {
    this.side = this.side === 'left' ? 'right' : 'left';
  }

}
