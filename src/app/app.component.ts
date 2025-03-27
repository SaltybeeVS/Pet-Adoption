import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Pet {
  id: string;
  name: string;
  breed: string;
  temperament: string;
  imageUrl: string;
  type: 'cat' | 'dog';
  age?: string;
}

interface CatApiResponse {
  id: string;
  name: string;
  breed_group?: string;
  temperament?: string;
  image?: { url: string };
}

interface DogApiResponse {
  id: string;
  name: string;
  breed_group?: string;
  temperament?: string;
  image?: { url: string };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    CommonModule,
    HttpClientModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Adoção de Pets';
  loading = false;
  currentPage = 1;
  itemsPerPage = 8;
  pets: Pet[] = [];
  hasMorePets = true;

  myControl = new FormControl('');
  filterOptions: string[] = ['Todos', 'Gatos', 'Cachorros'];
  filteredOptions: Observable<string[]> | undefined;
  selectedFilter = 'Todos';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.setupFilter();
    this.loadPets();
  }

  private setupFilter() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  loadPets() {
    if (this.loading || !this.hasMorePets) return;

    this.loading = true;
    const catApiUrl = `https://api.thecatapi.com/v1/breeds?limit=${this.itemsPerPage}&page=${this.currentPage}`;
    const dogApiUrl = `https://api.thedogapi.com/v1/breeds?limit=${this.itemsPerPage}&page=${this.currentPage}`;

    forkJoin([
      this.selectedFilter !== 'Cachorros' ? this.http.get<CatApiResponse[]>(catApiUrl) : of([]),
      this.selectedFilter !== 'Gatos' ? this.http.get<DogApiResponse[]>(dogApiUrl) : of([])
    ]).subscribe({
      next: ([cats = [], dogs = []]) => {
        const newPets = [
          ...cats.map((cat: CatApiResponse) => this.mapCatToPet(cat)),
          ...dogs.map((dog: DogApiResponse) => this.mapDogToPet(dog))
        ];

        this.pets = [...this.pets, ...newPets];
        this.currentPage++;
        this.loading = false;
        this.hasMorePets = newPets.length > 0;
      },
      error: (err: any) => {
        console.error('Error al cargar mascotas:', err);
        this.loading = false;
      }
    });
  }

  private mapCatToPet(cat: CatApiResponse): Pet {
    return {
      id: cat.id,
      name: cat.name,
      breed: cat.breed_group || 'Desconocido',
      temperament: cat.temperament || 'Temperamento no disponible',
      imageUrl: cat.image?.url || 'assets/cat-placeholder.jpg',
      type: 'cat',
      age: this.getRandomAge()
    };
  }

  private mapDogToPet(dog: DogApiResponse): Pet {
    return {
      id: dog.id,
      name: dog.name,
      breed: dog.breed_group || 'Desconocido',
      temperament: dog.temperament || 'Temperamento no disponible',
      imageUrl: dog.image?.url || 'assets/dog-placeholder.jpg',
      type: 'dog',
      age: this.getRandomAge()
    };
  }

  private getRandomAge(): string {
    const ages = ['1-2 años', '3-5 años', '6-8 años', '9+ años'];
    return ages[Math.floor(Math.random() * ages.length)];
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !this.loading) {
      this.loadPets();
    }
  }

  adotarPet(pet: Pet) {
    alert(`Você selecionou ${pet.name} (${pet.type === 'cat' ? 'Gato' : 'Cachorro'}) para adoção!`);
  }

  favoritarPet(petId: string) {
    console.log(`Pet ${petId} favoritado!`);
  }

  changeFilter(filter: string) {
    this.selectedFilter = filter;
    this.pets = [];
    this.currentPage = 1;
    this.hasMorePets = true;
    this.loadPets();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filterOptions.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }


  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }
}