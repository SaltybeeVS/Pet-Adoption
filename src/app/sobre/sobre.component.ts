import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css']
})
export class SobreComponent {
  logoImage = '/logo.png';
  
  teamMembers = [
    {
      name: 'Vicente Sandoval',
      role: 'Fundador',
      bio: 'Apaixonado por animais desde criança, Vicente fundou o abrigo em 2015 para ajudar animais abandonados.',
      photo: '/team/vicente.jpg'
    },
    {
      name: 'Nayara Rodrigues',
      role: 'Veterinária Chefe',
      bio: 'Especialista em cuidados com animais resgatados, com mais de 10 anos de experiência.',
      photo: '/team/ana.jpg'
    },
    {
      name: 'João Otávio',
      role: 'Coordenador de Adoções',
      bio: 'Responsável por encontrar lares perfeitos para nossos animais resgatados.',
      photo: '/team/carlos.jpg'
    }
  ];

  stats = [
    { value: '500+', label: 'Animais resgatados' },
    { value: '300+', label: 'Adoções realizadas' },
    { value: '50+', label: 'Voluntários ativos' },
    { value: '10', label: 'Anos de existência' }
  ];
}