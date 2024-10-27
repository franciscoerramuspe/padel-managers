import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="w-full max-w-md"
    >
      {paymentMethods.length > 0 ? (
        paymentMethods.map((method) => (
          <SwiperSlide key={method.id}>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
              <div className="mb-4">
                <p className="text-lg font-semibold">{method.cardHolder}</p>
                <p className="text-2xl mt-2">
                  **** **** **** {method.cardNumber.slice(-4)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p>Expires: {method.expiryDate}</p>
                {method.isDefault && (
                  <span className="bg-green-500 text-xs font-semibold px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <div className="bg-gray-200 p-6 rounded-lg shadow-lg text-gray-500 flex items-center justify-center h-48">
            <p className="text-center">No payment methods added yet</p>
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default PaymentCardSlider;
