import ShineButton from "../../components/ShineButton";
import React, { useState, useEffect, ChangeEvent } from "react";

const Calculator: React.FC = () => {
  // Input states
  const [sellingPrice, setSellingPrice] = useState<number>(39.99);
  const [numSales, setNumSales] = useState<number>(1000);
  const [productCost, setProductCost] = useState<number>(15.14);
  const [shippingCost, setShippingCost] = useState<number>(3.5);
  const [otherFees, setOtherFees] = useState<number>(0);
  const [adSpend, setAdSpend] = useState<number>(0);

  // Output states
  const [netProfit, setNetProfit] = useState<number>(0);
  const [potentialProfit, setPotentialProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<string>("0%");
  const [pcRatio, setPcRatio] = useState<string>("0X");
  const [breakevenROAS, setBreakevenROAS] = useState<string>("0");
  const [targetROAS, setTargetROAS] = useState<string>("-");

  // Auto-calculate on input change
  useEffect(() => {
    const totalCost = productCost + shippingCost + otherFees;
    const netProfitCalc = sellingPrice - totalCost;
    const potentialProfitCalc = netProfitCalc * numSales;

    const profitMarginCalc =
      sellingPrice > 0
        ? ((netProfitCalc / sellingPrice) * 100).toFixed(1)
        : "0";

    const pcRatioCalc =
      productCost > 0 ? (sellingPrice / productCost).toFixed(2) : "0";

    const breakevenROASCalc =
      netProfitCalc > 0
        ? (totalCost / netProfitCalc).toFixed(2)
        : "N/A";

    setNetProfit(netProfitCalc);
    setPotentialProfit(potentialProfitCalc);
    setProfitMargin(`${profitMarginCalc}%`);
    setPcRatio(`${pcRatioCalc}X`);
    setBreakevenROAS(breakevenROASCalc);
    setTargetROAS("-"); // Placeholder for future logic
  }, [sellingPrice, numSales, productCost, shippingCost, otherFees, adSpend]);

  const resetCalc = () => {
    setSellingPrice(0);
    setNumSales(0);
    setProductCost(0);
    setShippingCost(0);
    setOtherFees(0);
    setAdSpend(0);
  };

  const handleNumberChange = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setter(isNaN(value) ? 0 : value);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-blue-100/70 via-white/60 to-white/40 border border-blue-200 backdrop-blur-lg shadow-xl transition-all hover:scale-[1.01] duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow-md">
          💰 Estimated Profit Calculator
        </h1>
        <ShineButton
          onClick={resetCalc}
          className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          Reset
      </ShineButton>
      </div>

      {/* Selling Price + Slider */}
      <div className="mb-8">
        <label className="block text-sm text-gray-600 mb-2">
          Selling Price:{" "}
          <span className="font-semibold">${sellingPrice.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          step={0.1}
          value={sellingPrice}
          onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-700 rounded-lg appearance-none cursor-pointer transition-all"
        />
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Number of Sales", value: numSales, setter: setNumSales, step: 10 },
          { label: "Product Cost ($)", value: productCost, setter: setProductCost, step: 0.01 },
          { label: "Shipping Cost ($)", value: shippingCost, setter: setShippingCost, step: 0.01 },
          { label: "Other Fees ($)", value: otherFees, setter: setOtherFees, step: 0.01 },
          { label: "Ad Spend ($)", value: adSpend, setter: setAdSpend, step: 0.01 },
        ].map(({ label, value, setter, step }) => (
          <div key={label} className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">{label}</label>
            <input
              type="number"
              step={step}
              value={value}
              onChange={handleNumberChange(setter)}
              className="px-4 py-3 rounded-lg border border-gray-300 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            />
          </div>
        ))}
      </div>

      {/* Output Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { label: "Net Profit per Sale", value: `$${netProfit.toFixed(2)}` },
          { label: "Potential Profit", value: `$${potentialProfit.toLocaleString()}` },
          { label: "Profit Margin", value: profitMargin },
          { label: "P/C Ratio", value: pcRatio },
          { label: "Break-Even ROAS", value: breakevenROAS },
          { label: "Target ROAS", value: targetROAS },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-inner hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            <div className="text-lg font-semibold text-blue-800">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
