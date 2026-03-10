import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MudaPagina {

  constructor(private router: Router) {}

  mudarPagina(event: MouseEvent, rota: string) {
    this.router.navigate([rota]);
  }
}