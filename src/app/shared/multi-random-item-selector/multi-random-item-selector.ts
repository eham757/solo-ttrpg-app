import { Component, effect, input, signal } from '@angular/core';
import { ButtonComponent } from "../ui/button-component/button-component";

@Component({
  selector: 'app-multi-random-item-selector',
  imports: [ButtonComponent],
  templateUrl: './multi-random-item-selector.html',
  styleUrl: './multi-random-item-selector.css',
  host: { class: 'card' },
})
export class MultiRandomItemSelector {
  items = input<string[]>([]);
  title = input<string>('Random Item Selector');
  buttonText = input<string>('Select Random Item');
  showList = input<boolean>(false);
  rollCount = input<number>(1);
  allowModifyRollCount = input<boolean>(false);
  selectedItems = signal<string[] | null>(null);
  localRollCount = signal<number>(1);

  private syncRollCount = effect(() => {
    this.localRollCount.set(this.rollCount());
  });

  public selectRandomItems(): string[] {

    const items = this.items();
    const count = this.localRollCount();
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

  public onAddCount(): void {
    this.localRollCount.set(this.localRollCount() + 1);
  }

  public onSubtractCount(): void {
    if (this.localRollCount() > 1) {
      this.localRollCount.set(this.localRollCount() - 1);
    }
  }

}
