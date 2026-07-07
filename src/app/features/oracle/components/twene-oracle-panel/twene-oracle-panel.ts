import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OracleRollResult } from '../../../../core/models/mune.models';
import { OracleService } from '../../../../core/services/oracle.service';

@Component({
  selector: 'app-twene-oracle-panel',
  imports: [FormsModule],
  templateUrl: './twene-oracle-panel.html',
  styleUrl: './twene-oracle-panel.css',
})
export class TweneOraclePanel {
  public readonly rolled = output<OracleRollResult>();

  public readonly question = signal<string>('Is everything as expected?');

  constructor(private readonly oracleService: OracleService) {}

  public rollTwene(): void {
    const text = this.question().trim();
    if (!text) {
      return;
    }

    const result = this.oracleService.rollTwene(text);
    this.rolled.emit(result);
  }
}
