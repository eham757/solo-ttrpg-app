import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-multi-random-item-selector',
  imports: [],
  templateUrl: './multi-random-item-selector.html',
  styleUrl: './multi-random-item-selector.css'
})
export class MultiRandomItemSelector {
  items = input<string[]>([]);
  title = input<string>('Random Item Selector');
  buttonText = input<string>('Select Random Item');
  showList = input<boolean>(false);
  rollCount = input<number>(1);

  selectedItems = signal<string[] | null>(null);


  public selectRandomItems(): string[] {
    // const items = this.items();
    // console.log('Items:', items);
    // const randomIndex = Math.floor(Math.random() * items.length);
    // return items[randomIndex];
    const items = this.items();
    const count = this.rollCount();
    const selectedItems: string[] = [];
    for (let i = 0; i < count; i++) {
      // Prevent selecting the same item multiple times
      if (selectedItems.length >= items.length) {
        break; // All items have been selected
      }
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * items.length);
      } while (selectedItems.includes(items[randomIndex]));
      selectedItems.push(items[randomIndex]);
    }
    return selectedItems;
  }

  public onButtonClick(): void {
    const selectedItem = this.selectRandomItems();
    console.log('Selected Item:', selectedItem);
    this.selectedItems.set(selectedItem);
  }
}
