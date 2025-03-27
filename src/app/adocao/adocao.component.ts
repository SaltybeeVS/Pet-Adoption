import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PetsService, Pet } from '../pets.service';

@Component({
  selector: 'app-adocao',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './adocao.component.html',
  styleUrls: ['./adocao.component.css']
})
export class AdocaoComponent implements OnInit {
  pets: Pet[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  itemsPerLoad = 20;
  hasMorePets = true;

  constructor(private petsService: PetsService) {}

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    if (this.loading || !this.hasMorePets) return;

    this.loading = true;
    this.error = null;
    
    this.petsService.getPets(this.itemsPerLoad, this.currentPage).subscribe({
      next: (newPets) => {
        this.pets = [...this.pets, ...newPets];
        this.currentPage++;
        this.loading = false;
        this.hasMorePets = newPets.length === this.itemsPerLoad;
      },
      error: (err) => {
        console.error('Error loading pets', err);
        this.error = 'Erro ao carregar pets. Tente novamente.';
        this.loading = false;
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      this.loadPets();
    }
  }

  adoptPet(pet: Pet) {
    alert(`Você adotou ${pet.name} (${pet.type === 'cat' ? 'Gato' : 'Cachorro'})!`);
  }

  favoritePet(pet: Pet) {
    alert(`Você favoritou ${pet.name} (${pet.type === 'cat' ? 'Gato' : 'Cachorro'})!`);
  }

  getPlaceholderImage(type: 'cat' | 'dog'): string {
    return type === 'cat' 
      ? 'https://placekitten.com/300/200' 
      : 'https://placedog.net/300/200';
  }
}