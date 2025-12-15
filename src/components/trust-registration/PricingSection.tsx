import AddToCartButton from "@/components/ui/AddToCartButton";
import AddToWishlistButton from "@/components/ui/AddToWishlistButton";

const PricingSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Bengaluru</h3>
            <div></div>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            <li className="flex items-center"><span className="text-green-500 mr-2">&gt;</span> Trust Deed Preparation</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">&gt;</span> INR 500 Stamp Paper</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">&gt;</span> Trust PAN Card</li>
          </ul>
         <div className="flex gap-2 mt-4">
                  <AddToCartButton
                    serviceId="Chennai Trade License"
                    serviceName="Chennai"
                    price={2999}
                    className="flex-1 bg-white text-green-600 border border-green-600 hover:bg-green-50"
                    variant="outline"
                  >
                    ADD TO CART - ₹5,999
                  </AddToCartButton>
                  <AddToWishlistButton
                    serviceId="Chennai Trade License"
                    serviceName="Chennai"
                    price={5999}
                  />
                </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Mumbai</h3>
            <div></div>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            <li className="flex items-center"><span className="text-green-500 mr-2">&gt;</span> Trust Deed Preparation</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">&gt;</span> INR 500 Stamp Paper</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">&gt;</span> Trust PAN Card</li>
          </ul>
        <div className="flex gap-2 mt-4">
                  <AddToCartButton
                    serviceId="Chennai Trade License"
                    serviceName="Chennai"
                    price={5999}
                    className="flex-1 bg-white text-green-600 border border-green-600 hover:bg-green-50"
                    variant="outline"
                  >
                    ADD TO CART - ₹5,999
                  </AddToCartButton>
                  <AddToWishlistButton
                    serviceId="Chennai Trade License"
                    serviceName="Chennai"
                    price={5999}
                  />
                </div>
                </div>
      </div>
      <div className="flex justify-between text-sm text-blue-600 mt-4">
        <a href="#" className="hover:underline">Terms and conditions</a>
        <a href="#" className="hover:underline">Refer a Friend</a>
      </div>
    </div>
  )
}

export default PricingSection;
