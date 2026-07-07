import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LikelihoodMode, OracleRollResult } from '../../../../core/models/mune.models';
import { OracleService } from '../../../../core/services/oracle.service';

@Component({
  selector: 'app-mune-oracle-panel',
  imports: [FormsModule],
  templateUrl: './mune-oracle-panel.html',
  styleUrl: './mune-oracle-panel.css',
})
export class MuneOraclePanel {
  public readonly rolled = output<OracleRollResult>();

  public readonly question = signal<string>('');
  public readonly likelihood = signal<LikelihoodMode>('normal');

  constructor(private readonly oracleService: OracleService) {}

  public askOracle(): void {
    const text = this.question().trim();
    if (!text) {
      return;
    }

    const result = this.oracleService.rollOracle(text, this.likelihood());
    this.rolled.emit(result);
  }

  public setLikelihood(mode: LikelihoodMode): void {
    this.likelihood.set(mode);
  }
}
