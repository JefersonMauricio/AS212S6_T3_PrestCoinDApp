import { Inject, Injectable } from '@angular/core';
import { WEB3 } from '../core/web3';
import { Subject } from 'rxjs';
import Web3 from 'web3';
import AccountWeb3Model from '../model/account.web3.model';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  public accountsObservable = new Subject<AccountWeb3Model[]>();
  private accountsLoaded: AccountWeb3Model[] = [];
  public web3js: any;
  public contract: any;

  constructor(@Inject(WEB3) public web3: Web3) {
    window.addEventListener('load', () => {
      console.log("Observing accounts!!")
      setInterval(() => this.refreshAccounts(), 1000);
    });
  }

  async connectAccount(): Promise<void> {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        this.web3js = new Web3(window.ethereum);
        this.initializeContract();
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else if (window.web3) {
      this.web3js = new Web3(window.web3.currentProvider);
      this.initializeContract();
    } else {
      alert('¿Sin web3? ¡Deberías considerar probar MetaMask!');
    }
  }

  private initializeContract() {
    const contractABI: any[] = [
      [
        {
          "inputs": [],
          "name": "aceptarPrestamo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_prestatario",
              "type": "address"
            }
          ],
          "name": "aceptarPrestamoDestinatario",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "remitente",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "monto",
              "type": "uint256"
            }
          ],
          "name": "FondosRecibidos",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "pagarPrestamo",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "prestatario",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "prestamista",
              "type": "address"
            }
          ],
          "name": "PrestamoAceptado",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "prestatario",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "prestamista",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "monto",
              "type": "uint256"
            }
          ],
          "name": "PrestamoPagado",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "prestatario",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "destinatario",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "monto",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "interes",
              "type": "uint256"
            }
          ],
          "name": "PrestamoSolicitado",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_destinatario",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_monto",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_interes",
              "type": "uint256"
            }
          ],
          "name": "solicitarPrestamo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "remitente",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "monto",
              "type": "uint256"
            }
          ],
          "name": "TransaccionNoReconocida",
          "type": "event"
        },
        {
          "stateMutability": "payable",
          "type": "fallback"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "prestamos",
          "outputs": [
            {
              "internalType": "address",
              "name": "prestatario",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "destinatario",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "prestamista",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "monto",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interes",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "aceptado",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "pagado",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    ];
    const contractAddress = ""; // Dirección de tu contrato
    this.contract = new this.web3js.eth.Contract(contractABI, contractAddress);
  }

  public isConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.web3js) {
        resolve(true);
      }
      resolve(false);
    });
  }

  public async refreshAccounts() {
    const accs = await this.web3.eth.getAccounts();
    if (accs.length === 0) {
      console.warn('No account connected');
      return;
    }
    if (this.accountsLoaded.length === 0 || this.accountsLoaded.length !== accs.length || this.accountsLoaded[0].address !== accs[0]) {
      console.log('Observed new accounts!');
      let accountsTmp: AccountWeb3Model[] = [];
      for (let i = 0; i < accs.length; i++) {
        const currentBalance = await this.web3.eth.getBalance(accs[i]);
        accountsTmp.push(new AccountWeb3Model().build(accs[i], Number(currentBalance)));
      }
      this.accountsLoaded = accountsTmp;
      this.accountsObservable.next(this.accountsLoaded);
      console.log(this.accountsLoaded);
    }
  }

  async getAccountInfo(): Promise<AccountWeb3Model> {
    const accounts = await this.web3js.eth.getAccounts();
    if (accounts.length > 0) {
      const balance = await this.web3js.eth.getBalance(accounts[0]);
      return new AccountWeb3Model().build(accounts[0], Number(balance));
    }
    return new AccountWeb3Model();
  }

  async solicitarPrestamo(destinatario: string, monto: number, interes: number) {
    const accounts = await this.web3js.eth.getAccounts();
    return this.contract.methods.solicitarPrestamo(destinatario, monto, interes).send({ from: accounts[0] });
  }

  async aceptarPrestamo(prestatario: string) {
    const accounts = await this.web3js.eth.getAccounts();
    return this.contract.methods.aceptarPrestamo(prestatario).send({ from: accounts[0] });
  }

  async aceptarPrestamoDestinatario(prestatario: string) {
    const accounts = await this.web3js.eth.getAccounts();
    return this.contract.methods.aceptarPrestamoDestinatario(prestatario).send({ from: accounts[0] });
  }

  async pagarPrestamo(monto: number) {
    const accounts = await this.web3js.eth.getAccounts();
    return this.contract.methods.pagarPrestamo().send({ from: accounts[0], value: monto });
  }

  async consultarPrestamo(prestatario: string) {
    const accounts = await this.web3js.eth.getAccounts();
    return this.contract.methods.prestamos(prestatario).call({ from: accounts[0] });
  }
}
