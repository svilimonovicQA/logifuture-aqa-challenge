import { user } from "../../fixtures/mocks/data/user";
import { transaction } from "../../fixtures/mocks/data/transaction";
describe("Wallet API tests", () => {
  let authToken: string;
  let walletId: string;
  let userId: string;

  beforeEach(() => {
    // Login to get the auth token
    cy.userAuth(user.username, user.password, user.serviceId).then(
      (response) => {
        authToken = response.body.data.token;
        userId = response.body.data.userId;

        // Get user info to get the walletId
        cy.getUserInfo(userId, authToken).then((userResponse) => {
          walletId = userResponse.body.wallet.walletId;
        });
      }
    );
  });

  it("should return wallet information when making a GET request to /wallet/:walletId", () => {
    cy.getWallet(walletId, authToken).then((response) => {
      // Verify response status
      expect(response.status).to.eq(200);

      // Verify essential wallet properties
      expect(response.body).to.have.property("walletId").and.eq(walletId);
      expect(response.body)
        .to.have.property("currencyClips")
        .and.to.be.an("array");

      // If currencyClips exist, verify essential clip properties
      if (response.body.currencyClips.length > 0) {
        const clip = response.body.currencyClips[0];
        expect(clip).to.have.all.keys([
          "currency",
          "balance",
          "lastTransaction",
          "transactionCount",
        ]);
      }
    });
  });
  it("should process a credit transaction with immediate approval", () => {
    cy.postTransaction(walletId, transaction, authToken).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.status).to.eq("finished");
      expect(response.body.outcome).to.eq("approved");
    });
  });

  it("should handle pending transactions correctly", () => {
    transaction.currency = "USD";
    transaction.amount = 1500; // Amount > 1000 to trigger pending status
    transaction.type = "debit";

    cy.postTransaction(walletId, transaction, authToken).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.status).to.eq("pending");

      // Get transaction status
      const transactionId = response.body.transactionId;
      cy.getTransaction(walletId, transactionId, authToken).then(
        (statusResponse) => {
          expect(statusResponse.body.status).to.be.oneOf([
            "pending",
            "finished",
          ]);
        }
      );
    });
  });

  it("should validate transaction request body", () => {
    const invalidTransactions = [
      { currency: "INVALID", amount: 100, type: "credit" as "credit" },
      { currency: "EUR", amount: -100, type: "debit" as "debit" },
      { currency: "USD", amount: 0, type: "credit" as "credit" },
    ];

    invalidTransactions.forEach((transaction) => {
      cy.postTransaction(walletId, transaction, authToken).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property("error");
      });
    });
  });

  it("should update wallet balance after successful transaction", () => {
    const transaction: {
      currency: string;
      amount: number;
      type: "credit" | "debit";
    } = {
      currency: "EUR",
      amount: 100,
      type: "credit",
    };

    // Get initial balance
    cy.getWallet(walletId, authToken).then((initialWallet) => {
      const initialBalance =
        initialWallet.body.currencyClips.find((clip) => clip.currency === "EUR")
          ?.balance || 0;

      // Perform transaction
      cy.postTransaction(walletId, transaction, authToken).then(
        (txResponse) => {
          expect(txResponse.body.status).to.eq("finished");
          expect(txResponse.body.outcome).to.eq("approved");

          // Check updated balance
          cy.getWallet(walletId, authToken).then((updatedWallet) => {
            const newBalance = updatedWallet.body.currencyClips.find(
              (clip) => clip.currency === "EUR"
            ).balance;
            expect(newBalance).to.eq(initialBalance + 100);
          });
        }
      );
    });
  });
});
