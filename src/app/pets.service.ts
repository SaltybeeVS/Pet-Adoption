import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private catApiUrl = 'https://api.thecatapi.com/v1/breeds';
  private catImagesUrl = 'https://api.thecatapi.com/v1/images/search';
  private dogApiUrl = 'https://api.thedogapi.com/v1/breeds';
  private dogImagesUrl = 'https://api.thedogapi.com/v1/images/search';

  private dogNamesPT = [
    'Toby', 'Bolinha', 'Mel', 'Nina', 'Thor', 'Luna', 'Bob', 'Bela', 'Rex', 'Dudu',
    'Pipoca', 'Fred', 'Lola', 'Zeca', 'Maya', 'Max', 'Luke', 'Jade', 'Bruce', 'Lucky'
  ];

  private catNamesPT = [
    'Mingau', 'Frajola', 'Bichano', 'Nina', 'Luna', 'Pipoca', 'Floquinho', 'Thor',
    'Mel', 'Zoe', 'Luke', 'Lili', 'Biscoito', 'Jujuba', 'Lua', 'Fofo', 'Snow'
  ];

  constructor(private http: HttpClient) { }

  getPets(limit: number, page: number): Observable<Pet[]> {
    const perTypeLimit = Math.ceil(limit / 2);
    
    return forkJoin([
      this.http.get<any[]>(`${this.dogApiUrl}?limit=${perTypeLimit}&page=${page}`),
      this.http.get<any[]>(`${this.catApiUrl}?limit=${perTypeLimit}&page=${page}`)
    ]).pipe(
      switchMap(([dogs, cats]) => {
        const dogImageRequests = dogs.map(dog => 
          this.http.get<any[]>(`${this.dogImagesUrl}?breed_ids=${dog.id}&limit=1`)
        );
        
        const catImageRequests = cats.map(cat => 
          this.http.get<any[]>(`${this.catImagesUrl}?breed_ids=${cat.id}&limit=1`)
        );

        return forkJoin([
          forkJoin(dogImageRequests),
          forkJoin(catImageRequests)
        ]).pipe(
          map(([dogImages, catImages]) => {
            const processedDogs = dogs.map((dog, i) => this.createPetObject(
              dog, 
              'dog',
              dogImages[i][0]?.url || dog.image?.url
            ));

            const processedCats = cats.map((cat, i) => this.createPetObject(
              cat,
              'cat',
              catImages[i][0]?.url
            ));

            return this.interleavePets(processedDogs, processedCats).slice(0, limit);
          })
        );
      })
    );
  }

  private createPetObject(data: any, type: 'cat' | 'dog', imageUrl?: string): Pet {
    return {
      id: data.id,
      name: this.getRandomName(type),
      originalName: data.name,
      breed: data.breed_group || data.name,
      type: type,
      imageUrl: imageUrl || this.getDefaultImage(type),
      age: this.getRandomAge(),
      location: this.getRandomLocation()
    };
  }

  private getRandomName(type: 'cat' | 'dog'): string {
    const names = type === 'cat' ? this.catNamesPT : this.dogNamesPT;
    return names[Math.floor(Math.random() * names.length)];
  }

  private getRandomAge(): string {
    const ages = ['1 ano', '2 anos', '3 anos', '4 anos', '5 anos', '6 meses', '9 meses'];
    return ages[Math.floor(Math.random() * ages.length)];
  }

  private getRandomLocation(): string {
    const locations = [
      'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 
      'Curitiba', 'Recife', 'Salvador', 'Brasília'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private interleavePets(dogs: Pet[], cats: Pet[]): Pet[] {
    const result: Pet[] = [];
    const maxLength = Math.max(dogs.length, cats.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < dogs.length) result.push(dogs[i]);
      if (i < cats.length) result.push(cats[i]);
    }
    
    return result;
  }

  private getDefaultImage(type: 'cat' | 'dog'): string {
    return type === 'cat' 
      ? 'https://placekitten.com/300/200' 
      : 'https://placedog.net/300/200';
  }
}

export interface Pet {
  id: string;
  name: string;
  originalName: string;
  breed: string;
  type: 'cat' | 'dog';
  imageUrl: string;
  age: string;
  location: string;
}