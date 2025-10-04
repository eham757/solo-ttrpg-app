import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-multi-dice-roller-component',
  imports: [],
  templateUrl: './multi-dice-roller-component.html',
  styleUrl: './multi-dice-roller-component.css',
  host: { class: 'card' }
})
export class MultiDiceRollerComponent {
  // the user will give an array dice which will then be rolled
  // e.g. [6, 6, 8] means roll two six sided dice and one eight sided die
  // the results will be stored in an array of numbers
  diceTypes = input<number[]>([2,3,4,6,8,10,12,20,100]);

  results = signal<number[]>([]);
  diceArray = signal<number[]>([]);
  title = signal<string>('Multi Dice Roller');
  buttonText = signal<string>('Roll Dice');
  numberOfSides = signal<number>(2);
  total = computed(() => this.results().reduce((acc, curr) => acc + curr, 0));

  public rollDice(): void {
    const dice = this.diceArray();
    const newResults: number[] = [];
    for (const sides of dice) {
      const result = Math.floor(Math.random() * sides) + 1;
      newResults.push(result);
    }
    this.results.set(newResults);
  }

  public addDie(): void {
    this.diceArray.update(dice => [...dice, this.numberOfSides()]);
  }

  public removeDie(): void {
    this.diceArray.update(dice => {
      const newDice = [...dice];
      newDice.pop();
      return newDice;
    });
  }
  
  public onSidesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    this.numberOfSides.set(value);
  }

  public clearDice(): void {
    this.diceArray.set([]);
    this.results.set([]);
  }
}
