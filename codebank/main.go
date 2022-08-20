package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/taekoelias/imersao-fullcycle-9/codebank/domain"
	"github.com/taekoelias/imersao-fullcycle-9/codebank/dto"
	"github.com/taekoelias/imersao-fullcycle-9/codebank/infrastructure/repository"
	"github.com/taekoelias/imersao-fullcycle-9/codebank/usecase"
)

func main() {
	db := setupDb()
	defer db.Close()

	cc := domain.NewCreditCard()
	cc.Number = "1234"
	cc.Name = "Wesley"
	cc.ExpirationYear = 2021
	cc.ExpirationMonth = 7
	cc.CVV = 123
	cc.Limit = 1000
	cc.Balance = 0
	/*
		repo := repository.NewTransactionRepositoryDatabase(db)
		err := repo.CreateCreditCard(*cc)
		if err != nil {
			fmt.Println(err)
		}
	*/
	dto := dto.NewTransaction()
	dto.Number = cc.Number
	dto.Name = cc.Name
	dto.ExpirationMonth = cc.ExpirationMonth
	dto.ExpirationYear = cc.ExpirationYear
	dto.CVV = cc.CVV
	dto.Store = "Loja"
	dto.Description = "Compras"
	dto.Amount = 5000.0

	processTransactionUseCase := setupTransactionUseCase(db)
	t, err := processTransactionUseCase.ProcessTransaction(*dto)

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(t)
}

func setupTransactionUseCase(db *sql.DB) usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepositoryDatabase(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)
	return useCase
}

func setupDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"db",
		5432,
		"postgres",
		"root",
		"codebank",
	)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("error connection to database")
	}

	return db
}
