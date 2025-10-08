import { Component, input, signal } from '@angular/core';
import { ButtonComponent } from '../ui/button-component/button-component';
@Component({
  selector: 'app-random-item-selector-component',
  imports: [ButtonComponent],
  templateUrl: './random-item-selector-component.html',
  styleUrl: './random-item-selector-component.css',
  host: { class: 'card' },
})
export class RandomItemSelectorComponent {
  items = input<string[]>([]);
  title = input<string>('Random Item Selector');
  buttonText = input<string>('Select Random Item');
  showList = input<boolean>(false);
  selectedItem = signal<string | null>(null);
  

  public selectRandomItem(): string {
    const items = this.items();
    console.log('Items:', items);
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  public onButtonClick(): void {
    const selectedItem = this.selectRandomItem();
    console.log('Selected Item:', selectedItem);
    this.selectedItem.set(selectedItem);
  }
}