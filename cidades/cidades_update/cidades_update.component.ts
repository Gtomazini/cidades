
import { Cidade } from './../cidades.model';
import { CidadesService  } from './../cidades.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { Estado } from '../../estados/estados.model';
import { EstadosService } from '../../estados/estados.service';
import { Pais } from '../../paises/paises.model';
import { PaisesService } from '../../paises/paises.service';

@Component({
    selector: 'app-cidades-create',
    templateUrl: './cidades_update.component.html',
    styleUrls: ['./cidades_update.component.css'],
    providers: [MessageService]
})

export class CidadesUpdateComponent implements OnInit {
    
    paises: Pais[] = [];
    selectedPais: Pais

    estados: Estado[] = [];
    selectedEstado: Estado

    //Breadcrumb
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    //Objeto principal do form
    cidade: Cidade = {
        cidade_id: null,
        estado_id: null,
        pais_id: null,
        nome: "",
        distancia_km: null, 
        valor_pedagio: null
    }


    // Duas funções pra buscar o ID na API

    get_pais_id(id: number): number {
        let num: number
        for (let i = 0; i < this.paises.length; i++) {
            num = i
            if (Number(this.paises[i]['pais_id']) === id) {
                break
            }
        }    
        return num  
    } 

    get_estado_id(id: number): number {
        let num: number
        for (let i = 0; i < this.estados.length; i++) {
            num = i
            if (Number(this.estados[i]['estado_id']) === id) {
                break
            }
        }    
        return num  
    } 
  
    constructor(private loginService: LoginService, private cidadesService: CidadesService, private paisesService: PaisesService, private estadosServices: EstadosService, private router: Router, private messageService: MessageService, private route: ActivatedRoute) {
        setTimeout(() => {
            //Recursos para buscar o pais e estado à cidade relacionada, vai ser importado do services dos respectivos itens
            this.paisesService.read().subscribe(paises => {
                this.paises = paises;  
                this.selectedPais = this.paises[this.get_pais_id(this.cidade.pais_id)]
            })

            this.estadosServices.read().subscribe(paises => {
                this.paises = paises;  
                this.selectedPais = this.paises[this.get_estado_id(this.cidade.estado_id)]
            })  

            this.loginService.validateSession()
             if (!this.loginService.sessionIsValid){
                this.messageService.add({ severity: 'error', summary: 'Sessão encerrada', detail: 'Deslogado por inatividade' });
                this.router.navigate(['/auth/login'])
            }
        }, 500)		
    }
    
    ngOnInit(): void {
        // Componente Breadcrumb
        this.items = [{ label: 'Cidade', routerLink: '/app/cidades' }, { label: 'Atualização do Registro' }];
        this.home = { icon: 'pi pi-home', routerLink: '/app/dashboard' };
        //Carrega os dados do pais
        setTimeout(() => {
            const id = this.route.snapshot.paramMap.get('id')
            this.cidadesService.readById(id).subscribe(cidade => {
                this.cidade = cidade
            })          
        }, 200)         
    }
    
    update(): void {

        this.cidade.nome = this.cidade.nome.toUpperCase().trim()
        this.cidade.distancia_km = this.cidade.distancia_km
        this.cidade.valor_pedagio = this.cidade.valor_pedagio

        this.cidadesService.update(this.cidade).subscribe({
            next: () => {
                this.messageService.add({key: 'tst', severity: 'success', summary: 'SUCESSO', detail: 'Registro alterado com sucesso!' });
                setTimeout(() => {
                    this.router.navigate(['/app/cidades'])
                }, 2500)                                
            },
            complete: () => {},
            error: (e) => {
                if (e.error['message err'] !== undefined) {
                    this.messageService.add({key: 'tst', severity: 'error', summary: 'ATENÇÃO', detail: e.error['message err'] });
                } else {
                    this.messageService.add({key: 'tst', severity: 'error', summary: 'ATENÇÃO', detail: 'Não foi possível executar a ação.' });
                }
                
            }	
        })
    }
    
    cancel(): void {       
        this.router.navigate(['/app/cidade'])
    }
}