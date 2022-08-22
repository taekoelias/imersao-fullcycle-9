import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreditCard } from '../entities/credit-card.embbeded';

interface PaymentData {
  creditCard: {
    name: string;
    number: string;
    expirationMonth: number;
    expirationYear: number;
    cvv: string;
  };
  amount: number;
  description: string;
  store: string;
}

interface PaymentGrpcService{
  payment(data: PaymentData): Observable<void>
}

@Injectable()
export class PaymentService implements OnModuleInit{
  private paymentGrpcService: PaymentGrpcService;
  
  constructor(@Inject('PAYMENT_PACKAGE') private clientGrpc: ClientGrpc) {}
  
  onModuleInit() {
    this.paymentGrpcService = this.clientGrpc.getService<PaymentGrpcService>('PaymentService')
  }

  async payment(data: PaymentData) {
    try {
      return await this.paymentGrpcService.payment(data).toPromise();
    } catch (e) {
      throw new RpcException({
        code: e.code,
        message: e.message,
      });
    }
  }
}
