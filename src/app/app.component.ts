import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldComponent } from './field/field.component';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FieldComponent, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly gameWinner: WritableSignal<number> = signal(0);
  protected readonly boardState: WritableSignal<number[][]> = signal([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);

  protected readonly currentPlayer: WritableSignal<number> = signal(-1);

  public togglePlayer() {
    this.currentPlayer.update(player => player === -1 ? 1 : -1);
  }

  protected modifyBoard(row: number, col: number) {
    if (this.gameWinner() !== 0) return;
    this.boardState.update(board => {
      if (board[row][col] === 0) {
        board[row][col] = this.currentPlayer();
        this.togglePlayer();
        this.gameWinner.set(this.checkWinner(board));
      }
      return board;
    });
  }

  protected restartGame() {
    this.gameWinner.set(0);
    this.boardState.update(board => {
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          board[row][col] = 0;
        }
      }
      return board;
    });
  }

  private checkWinner(board: number[][]): number {
    for (let i = 0; i < 3; i++) {
      const rowTotal = board[i][0] + board[i][1] + board[i][2];
      const colTotal = board[0][i] + board[1][i] + board[2][i];
      if (rowTotal === 3 || colTotal === 3) {
        return 1;
      }
      if (rowTotal === -3 || colTotal === -3) {
        return -1;
      }
    }

    const diag1Total = board[0][0] + board[1][1] + board[2][2];
    const diag2Total = board[0][2] + board[1][1] + board[2][0];
    if (diag1Total === 3 || diag2Total === 3) {
      return 1;
    }
    if (diag1Total === -3 || diag2Total === -3) {
      return -1;
    }

    if (board.every(row => row.every(cell => cell !== 0))) {
      return 404;
    }

    // No result
    return 0;
  }
}
