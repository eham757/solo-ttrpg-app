import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dropdown-component',
  imports: [],
  templateUrl: './dropdown-component.html',
  styleUrl: './dropdown-component.css'
})
export class DropdownComponent {
  items = input<string[]>([]);
}
