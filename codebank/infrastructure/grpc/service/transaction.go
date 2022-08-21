package service

import (
	"context"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/taekoelias/imersao-fullcycle-9/codebank/dto"
	"github.com/taekoelias/imersao-fullcycle-9/codebank/infrastructure/grpc/pb"
	"github.com/taekoelias/imersao-fullcycle-9/codebank/usecase"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type TransactionService struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
	pb.UnimplementedPaymentServiceServer
}

func NewTransactionService() *TransactionService {
	return &TransactionService{}
}

func (t *TransactionService) Payment(ctx context.Context, in *pb.PaymentRequest) (*empty.Empty, error) {
	transactionDto := dto.Transaction{
		Number:          in.GetCreditCard().GetNumber(),
		Name:            in.GetCreditCard().GetName(),
		ExpirationMonth: in.GetCreditCard().GetExpirationMonth(),
		ExpirationYear:  in.GetCreditCard().GetExpirationYear(),
		CVV:             in.GetCreditCard().GetCvv(),
		Store:           in.GetStore(),
		Description:     in.GetDescription(),
		Amount:          in.GetAmount(),
	}

	transaction, err := t.ProcessTransactionUseCase.ProcessTransaction(transactionDto)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, err.Error())
	}

	if transaction.Status != "approved" {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, "transaction rejected by the bank")
	}

	return &empty.Empty{}, nil
}
