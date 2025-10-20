"use client";

import { StatusEnum } from "../../../common";
import { usePayment } from "../../../hooks";
import { formatCurrency } from "../../../utils";

export default function PaymentsPage() {
  const {
    orderId,
    amount,
    statusPayment,
    paymentType,
    registerPayment,
    manualPayment,
  } = usePayment();

  if (!orderId || !amount) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      {(paymentType === "auto" || paymentType === "") && (
        <div className="card" style={{ width: "30rem" }}>
          <div className="card-body">
            <h4 className="card-title">
              Payment Details{" "}
              <span style={{ fontSize: "1.2rem", color: "gray" }}>
                (automatic)
              </span>
            </h4>
            <div className="row align-items-start">
              <span className="col">
                Order ID: <b>{orderId}</b>
              </span>
              <span className="col">
                Amount: <b>{formatCurrency(amount, "USD")}</b>
              </span>
            </div>
            {statusPayment && (
              <div className="row align-items-start">
                <div>
                  <span>Status: </span>
                  <span
                    className={
                      statusPayment === "processed"
                        ? "badge text-bg-success"
                        : "badge text-bg-secondary"
                    }
                  >
                    {StatusEnum[statusPayment as keyof typeof StatusEnum]}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="card-footer">
            {statusPayment !== "processed" && (
              <button
                type="button"
                onClick={() => registerPayment()}
                className="btn btn-success"
                disabled={!!statusPayment}
              >
                {statusPayment ? "Waiting..." : "Automatic Payment"}
              </button>
            )}
          </div>
        </div>
      )}

      {(paymentType === "manual" || paymentType === "") && (
        <div className="card" style={{ width: "30rem", marginTop: "20px" }}>
          <div className="card-body">
            <h4 className="card-title">
              Payment Details{" "}
              <span style={{ fontSize: "1.2rem", color: "gray" }}>
                (manual)
              </span>
            </h4>
            <div className="row align-items-start">
              <span className="col">
                Order ID: <b>{orderId}</b>
              </span>
              <span className="col">
                Amount: <b>{formatCurrency(amount, "USD")}</b>
              </span>
            </div>
            {statusPayment && (
              <div className="row align-items-start">
                <div>
                  <span>Status: </span>
                  <span
                    className={
                      statusPayment === "processed"
                        ? "badge text-bg-success"
                        : "badge text-bg-secondary"
                    }
                  >
                    {StatusEnum[statusPayment as keyof typeof StatusEnum]}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="card-footer">
            {statusPayment !== "processed" && (
              <button
                type="button"
                onClick={() => manualPayment()}
                className="btn btn-primary"
                disabled={!!statusPayment}
              >
                {statusPayment ? "Waiting..." : "Manual Payment"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
