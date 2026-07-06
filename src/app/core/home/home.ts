import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  tools = [
    {
      title: 'MUNE Oracle',
      description:
        'Ask questions with normal/likely/unlikely logic, gain intervention points on sixes, and trigger interventions at 3 points.',
      route: '/oracle',
      action: 'Open Oracle',
    },
    {
      title: 'Character Sheet Engine',
      description:
        'Load a schema JSON that defines your sheet fields, fill values, then export/import characters as JSON documents.',
      route: '/characters',
      action: 'Open Character Sheet',
    },
    {
      title: 'Dice and Generators',
      description:
        'Use the original random generators, descriptor tools, and single/multi-dice rollers as a dedicated utility page.',
      route: '/dice',
      action: 'Open Dice Tools',
    },
  ];
}
