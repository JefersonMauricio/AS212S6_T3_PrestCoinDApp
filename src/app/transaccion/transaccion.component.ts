import { Web3Service } from './../service/web3.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-transaccion',
  templateUrl: './transaccion.component.html',
  styleUrls: ['./transaccion.component.css']
})
export class TransaccionComponent implements OnInit {
  transactionForm = new FormGroup({
    toAddress: new FormControl(''),
    amount: new FormControl(0),
  });

  address: string = ''; // Inicializa con una cadena vacía
  balance: number = 0; // Inicializa con 0

  constructor(private Web3Service: Web3Service) { }

  async ngOnInit() {
    this.address = await this.Web3Service.getAddress();
    this.balance = await this.Web3Service.getBalance();
    console.log('Dirección en el componente:', this.address);
    console.log('Saldo en el componente:', this.balance);
  }

  async sendTransaction() {
    const toAddress = this.transactionForm?.get('toAddress')?.value;
    const amount = this.transactionForm?.get('amount')?.value;
  
    if (toAddress && amount) {
      try {
        await this.Web3Service.sendTransaction(toAddress, amount);
        // Actualizar el saldo después de la transacción
        this.balance = await this.Web3Service.getBalance();
      } catch (error) {
        console.error('Error al enviar la transacción:', error);
      }
    }
  }
}