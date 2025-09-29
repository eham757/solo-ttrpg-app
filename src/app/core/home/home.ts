import { Component } from '@angular/core';
import { RandomItemSelectorComponent } from "../../shared/random-item-selector-component/random-item-selector-component";
import { DieRollerComponent } from '../../shared/die-roller-component/die-roller-component';

@Component({
  selector: 'app-home',
  imports: [RandomItemSelectorComponent, DieRollerComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
