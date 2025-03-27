import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-informacao',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './informacao.component.html',
  styleUrls: ['./informacao.component.css']
})
export class InformacaoComponent {
  steps = [
    {
      title: '1. Visita ao Abrigo',
      icon: 'home',
      description: 'Agende uma visita para conhecer nossos animais disponíveis para adoção.'
    },
    {
      title: '2. Conexão com o Animal',
      icon: 'favorite',
      description: 'Conheça os animais e encontre aquele que mais combina com você.'
    },
    {
      title: '3. Processo de Adoção',
      icon: 'description',
      description: 'Preencha o formulário de adoção e forneça os documentos necessários.'
    },
    {
      title: '4. Avaliação',
      icon: 'check_circle',
      description: 'Nossa equipe fará uma avaliação para garantir o melhor lar para o animal.'
    },
    {
      title: '5. Lar Novo!',
      icon: 'pets',
      description: 'Leve seu novo amigo para casa e comecem uma vida juntos!'
    }
  ];

  contactInfo = {
    phone: '(11) 98765-4321',
    email: 'adocoes@adote-me.com.br'
  };
}