
import { CidadeFull } from './../cidades.model';
import { CidadesService } from './../cidades.service';
import { Estado } from '../../estados/estados.model';
import { EstadosService } from '../../estados/estados.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/login.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { Pais } from '../../paises/paises.model';
import { PaisesService } from '../../paises/paises.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-estado-create',
    templateUrl: './estados_new.component.html',
    styleUrls: ['./estados_new.component.css'],
    providers: [MessageService]
})

export class CidadesNewComponent implements OnInit {
    estados: Estado[];
    selectedEstado: Estado | undefined;

    paises: Pais[];
    selectedPais: Pais | undefined;

    formGroup: FormGroup | undefined;

    //Breadcrumb
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    //Objeto principal do form
    cidades: CidadeFull | undefined
        
    constructor(private loginService: LoginService, private cidadesService: CidadesService,private estadosService: EstadosService, private paisesService: PaisesService, private router: Router, public messageService: MessageService,) {
        setTimeout(() => {
            this.loginService.validateSession()
             if (!this.loginService.sessionIsValid){
                this.messageService.add({ severity: 'error', summary: 'Sessão encerrada', detail: 'Deslogado por inatividade' });
            }
        }, 500)			 
    }

    
    ngOnInit(): void {
        this.paisesService.read().subscribe(paises => {
            this.paises = paises   
        });
           
        this.formGroup = new FormGroup({
            selectedPais: new FormControl<object | null>(null)
        });

        // Componente Breadcrumb
        this.items = [{ label: 'Estados', routerLink: '/app/cidades' }, { label: 'Novo Registro' }]
        this.home = { icon: 'pi pi-home', routerLink: '/app/dashboard' }        
    }
    
    create(): void {

        this.cidades.nome = this.cidades.nome.toUpperCase().trim();
        this.cidades.distancia_km = this.cidades.distancia_km
        this.cidades.valor_pedagio = this.cidades.valor_pedagio
        this.cidades.pais_id = this.selectedPais.pais_id;
        this.cidades.estado_id = this.selectedEstado.estado_id;

        this.cidadesService.create(this.cidades).subscribe({
            next: () => {
                this.messageService.add({key: 'tst', severity: 'success', summary: 'SUCESSO', detail: 'Registro gravado com sucesso!' });
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
        this.router.navigate(['/app/cidades'])
    }
    

}