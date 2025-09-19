
import { useState, useEffect } from "react";

interface Metrics {
  monthly_revenue: string;
  monthly_sales: string;
  roi_percent: string;
  ad_spend: string;
  orders: string;
  avg_price: string;
  product: string;  // this is the linked field in metrics
  date?: string;
}

interface MetricCard {
  title: string;
  value: string;
  icon: string;
}

interface MetricsDashboardProps {
  productId: string;
  productName?: string;  // optional, in case you need name
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ productId, productName }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAMES;

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError("");

      try {
        console.log("Fetching metrics for productId:", productId, "productName:", productName);

        // Try filter by ID first
        let url = `https://api.airtable.com/v0/${baseId}/${tableName}` +
          `?filterByFormula=({product} = '${productId}')` +
          `&sort[0][field]=date&sort[0][direction]=desc`;

        let response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = await response.json();

        console.log("Response by ID filter:", data);

        if (!data.records || data.records.length === 0) {
          // Try filter by name, if productName is given
          if (productName) {
            const url2 = `https://api.airtable.com/v0/${baseId}/${tableName}` +
              `?filterByFormula=({product} = '${productName}')` +
              `&sort[0][field]=date&sort[0][direction]=desc`;
            let response2 = await fetch(url2, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            let data2 = await response2.json();
            console.log("Response by name filter:", data2);
            data = data2;
          }
        }

        const record = data.records?.[0];

        if (!record || !record.fields) {
          setError("No metrics data found.");
        } else {
          setMetrics(record.fields as Metrics);
        }
      } catch (err: any) {
        console.error("Error in fetching metrics:", err);
        setError(err.message || "Failed to fetch metrics.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchMetrics();
    }
  }, [token, baseId, tableName, productId, productName]);

  const metricCards: MetricCard[] = metrics
    ? [
        {
          title: "Ø Monthly Revenue",
          value: metrics.monthly_revenue,
          icon: "💰",
        },
        {
          title: "Ø Monthly Sales",
          value: metrics.monthly_sales,
          icon: "📈",
        },
        {
          title: "ROI",
          value: `${metrics.roi_percent}%`,
          icon: "💹",
        },
        {
          title: "Ad Spend",
          value: metrics.ad_spend,
          icon: "🧾",
        },
        {
          title: "Orders",
          value: metrics.orders,
          icon: "📦",
        },
        {
          title: "Avg. Price",
          value: metrics.avg_price,
          icon: "💵",
        },
        {
          title: "Product",
          value: metrics.product,
          icon: "🛠️",
        },
        {
          title: "Date",
          value: metrics.date || "N/A",
          icon: "📅",
        },
      ]
    : [];

  return (

    <div className="mt-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Competition & Key Metrics</h1>
  {loading && (
    <p className="text-center text-gray-500 text-lg animate-pulse">
      Loading metrics...
    </p>
  )}

  {!loading && error && (
    <p className="text-center text-red-600 font-semibold text-lg">
      {error}
    </p>
  )}

  {!loading && !error && metrics && (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {metricCards.map((card, i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-white/60 to-blue-50 backdrop-blur-md border border-blue-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-blue-700 uppercase tracking-wider">
              {card.title}
            </span>
            <span className="text-xl">{card.icon}</span>
          </div>
          <div className="text-2xl font-bold text-black">{card.value}</div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default MetricsDashboard;
