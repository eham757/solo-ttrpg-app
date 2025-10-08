import { Component, input, signal } from '@angular/core';
import { ButtonComponent } from '../ui/button-component/button-component';
@Component({
  selector: 'app-die-roller-component',
  imports: [ButtonComponent],
  templateUrl: './die-roller-component.html',
  styleUrl: './die-roller-component.css',
  host: { class: 'card' },
})
export class DieRollerComponent {
  numberOfSides = input<number>(6);
  title = input<string>('Die Roller');
  buttonText = input<string>('Roll Die');
  result = signal<number | null>(null);

  public rollDie(): number {
    const sides = this.numberOfSides();
    return Math.floor(Math.random() * sides) + 1;
  }
}
