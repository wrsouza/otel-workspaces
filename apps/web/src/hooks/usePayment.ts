import { useEffect, useState } from "react";
import { getRandomFloat, getRandomInt } from "../utils";

export function usePayment() {
  const [orderId, setOrderId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [statusPayment, setStatusPayment] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");

  useEffect(() => {
    if (!orderId && !amount) {
      setOrderId(getRandomInt(100000, 999999).toString());
      setAmount(getRandomFloat(1000, 5000));
    }
  }, []);

  const registerPayment = async (): Promise<void> => {
    setPaymentType("auto");
    const response = await fetch("/api/register-payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, amount }),
    });
    const result = await response.json();
    setStatusPayment(result.status);
    checkPaymentStatus();
  };

  const manualPayment = async (): Promise<void> => {
    setPaymentType("manual");
    setStatusPayment("processing");
    const response = await fetch("/api/manual-payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, amount }),
    });
    const result = await response.json();
    setStatusPayment(result.status);
  };

  const checkPaymentStatus = async (): Promise<void> => {
    const eventSource = new EventSource(`api/payment-status/${orderId}`);
    eventSource.onmessage = ({ data }) => {
      const result = JSON.parse(data);
      console.log("status", result.status);
      if (result.status !== "processing") {
        setStatusPayment(result.status);
        eventSource.close();
      }
    };
  };

  return {
    orderId,
    amount,
    statusPayment,
    paymentType,
    registerPayment,
    manualPayment,
  };
}
