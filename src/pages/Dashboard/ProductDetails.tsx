import ShineButton from '../../components/ShineButton';
import Calculator from './Calculator';
import MetricsDashboard from './MetricsDashboard';
import Reviews from './Review';
import Support from './Support';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

type AirtableImage = {
  url: string;
  filename: string;
};

type ProductDetailsType = {
  product_name: string;
  product_images?: AirtableImage[];
  description?: string;
  category?: string;
  cost_price?: string | number;
  selling_price?: string | number;
  profit_per_sale?: string;
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailsType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
      const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
      const apiKey = import.meta.env.VITE_AIRTABLE_TOKEN;

      try {
        const response = await axios.get(`https://api.airtable.com/v0/${baseId}/${tableName}/${id}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        setProduct(response.data.fields);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const parsePrice = (price: string | number | undefined) => {
    if (typeof price === 'string') {
      return Number(price.replace(/[^0-9.-]+/g, ''));
    }
    if (typeof price === 'number') {
      return price;
    }
    return 0;
  };

  if (!product) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const cost = parsePrice(product.cost_price);
  const selling = parsePrice(product.selling_price);
  const profit = selling - cost;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow">
      <ShineButton
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 "
      >
        ← Back to products
      </ShineButton>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex flex-col items-center md:w-1/2">
          {product.product_images && product.product_images.length > 0 && (
            <>
              <img
                src={product.product_images[0].url}
                alt={product.product_images[0].filename}
                className="w-full max-w-sm rounded object-contain"
              />
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.product_images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={img.filename}
                    className="w-16 h-16 object-cover rounded border cursor-pointer"
                    onClick={() => {
                      setProduct((prev) =>
                        prev && {
                          ...prev,
                          product_images: [
                            product.product_images![idx],
                            ...product.product_images!.filter((_, i) => i !== idx),
                          ],
                        }
                      );
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold mb-2">{product.product_name}</h1>
          {product.description && (
            <p className="text-gray-700 mb-38 mt-5 whitespace-pre-line text-xl">{product.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-2xl">
            <div>
              <span className="font-semibold text-2xl">Cost Price:</span>{' '}
              <span className="text-blue-600">${cost.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-semibold">Selling Price:</span>{' '}
              <span className="text-green-600">${selling.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-semibold">Profit per Sale:</span>{' '}
              <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profit.toFixed(2)}
              </span>
            </div>
            {product.category && (
              <div>
                <span className="font-semibold">Category:</span> {product.category}
              </div>
            )}
          </div>
        </div>
      </div>
     <Support/>
      <Calculator />
      {/* <MetricsDashboard productId={id} /> */}
      <MetricsDashboard productId={id} productName={product.product_name} />
<Reviews productId={id} productName={product.product_name} />

    </div>
  );
};

export default ProductDetails;
