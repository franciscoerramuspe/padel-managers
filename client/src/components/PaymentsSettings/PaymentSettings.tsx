import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AddPaymentModal from './AddPaymentModal';
import PaymentCardSlider from './PaymentCardSlider';

interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

const PaymentSettings: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPaymentMethod = (newMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Payment Methods</h2>
      <PaymentCardSlider paymentMethods={paymentMethods} />
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
      >
        <FaPlus className="mr-2" />
        Add Payment Method
      </button>
      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPaymentMethod={handleAddPaymentMethod}
      />
    </div>
  );
};

export default PaymentSettings;
