import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../service/web3.service';
import AccountWeb3Model from '../model/account.web3.model';

@Component({
  selector: 'app-transaccion',
  templateUrl: './transaccion.component.html',
  styleUrls: ['./transaccion.component.css']
})
export class TransaccionComponent implements OnInit {
  destinatario: string = '';
  prestatario: string = '';
  monto: number = 0;
  interes: number = 0;
  idPrestamo: number = 0;

  accountInfo: AccountWeb3Model = new AccountWeb3Model();

  constructor(private web3Service: Web3Service) { }

  async ngOnInit(): Promise<void> {
    await this.web3Service.connectAccount();
    this.accountInfo = await this.web3Service.getAccountInfo();
    if (await this.web3Service.isConnected()) {
      console.log('La cuenta está conectada');
    } else {
      console.log('La cuenta no está conectada');
    }
  }

  connectAccount() {
    this.web3Service.connectAccount().then(() => {
      this.web3Service.getAccountInfo().then(account => {
        this.accountInfo = account;
      });
    });
  }

  solicitarPrestamo(destinatario: string, monto: number, interes: number) {
    this.web3Service.solicitarPrestamo(destinatario, monto, interes).then(result => {
      console.log(result);
    }).catch(error => {
      console.error(error);
    });
  }

  aceptarPrestamo(prestatario: string) {
    this.web3Service.aceptarPrestamo(prestatario).then(result => {
      console.log(result);
    }).catch(error => {
      console.error(error);
    });
  }

  aceptarPrestamoDestinatario(prestatario: string) {
    this.web3Service.aceptarPrestamoDestinatario(prestatario).then(result => {
      console.log(result);
    }).catch(error => {
      console.error(error);
    });
  }

  pagarPrestamo(monto: number) {
    this.web3Service.pagarPrestamo(monto).then(result => {
      console.log(result);
    }).catch(error => {
      console.error(error);
    });
  }

  consultarPrestamo(prestatario: string) {
    this.web3Service.consultarPrestamo(prestatario).then(result => {
      console.log(result);
    }).catch(error => {
      console.error(error);
    });
  }
}
