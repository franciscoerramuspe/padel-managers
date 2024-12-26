import React, { useState } from 'react';
import { FaTimes, FaCreditCard } from 'react-icons/fa';
import Payment from 'payment';
import Image from 'next/image';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPaymentMethod: (method: PaymentMethod) => void;
}

interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onAddPaymentMethod }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      cardNumber,
      expiryDate,
      cardHolder,
      isDefault: false,
    };
    onAddPaymentMethod(newMethod);
    onClose();
  };

  const cardType = Payment.fns.cardType(cardNumber);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Payment Method</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(Payment.fns.formatCardNumber(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10"
                placeholder="1234 5678 9012 3456"
              />
              <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {cardType && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Image
                    src={`/assets/card-icons/${cardType.toLowerCase()}.png`}
                    alt={cardType}
                    width={32}
                    height={20}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(Payment.fns.formatExpiry(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="MM/YY"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
          <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
              Card Holder
            </label>
            <input
              type="text"
              id="cardHolder"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="John Doe"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Payment Method
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
