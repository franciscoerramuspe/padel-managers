import React from 'react';
import { FaCreditCard } from 'react-icons/fa';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

interface PaymentCardSliderProps {
  paymentMethods: PaymentMethod[];
}

const PaymentCardSlider: React.FC<PaymentCardSliderProps> = ({ paymentMethods }) => {
  if (paymentMethods.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg flex items-center justify-center">
        <FaCreditCard className="text-4xl text-gray-400 mr-4" />
        <p className="text-gray-500">No payment methods added yet</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-4 pb-4">
      {paymentMethods.map((method) => (
        <div key={method.id} className="flex-shrink-0">
          <Cards
            number={method.cardNumber}
            expiry={method.expiryDate}
            name={method.cardHolder}
            cvc=""
          />
          {method.isDefault && (
            <p className="text-sm text-green-600 mt-2">Default Payment Method</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentCardSlider;
