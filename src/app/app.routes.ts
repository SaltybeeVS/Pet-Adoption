import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { SobreComponent } from './sobre/sobre.component';
import { InformacaoComponent } from './informacao/informacao.component';
import { LoginComponent } from './login/login.component';
import { AdocaoComponent } from './adocao/adocao.component';

export const routes: Routes = [
    {path: 'cadastro', component:CadastroComponent},
    {path: 'sobre', component:SobreComponent},
    {path: 'informacao', component:InformacaoComponent},
    {path: 'login', component:LoginComponent},
    {path: 'adocao',component:AdocaoComponent},
    {path: '**', redirectTo:'adocao'}//pagina principal
];
