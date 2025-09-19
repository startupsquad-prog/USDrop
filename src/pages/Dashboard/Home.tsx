
import ShineButton from '../../components/ShineButton';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type AirtableImage = {
  url: string;
  filename: string;
};

type Product = {
  id: string;
  fields: {
    product_name: string;
    product_images?: AirtableImage[];
    description?: string;
    cost_price?: string;
    selling_price?: string;
    category?: string;
  };
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', 'Automotive', 'Fashion', 'Fitness', 'Home', 'Other', 'Tech'];

  useEffect(() => {
    const fetchProducts = async () => {
      const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
      const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
      const apiKey = import.meta.env.VITE_AIRTABLE_TOKEN;

      try {
        const response = await axios.get(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          params: {
            maxRecords: 100,
            view: 'Grid view',
          },
        });

        setProducts(response.data.records);
        setFilteredProducts(response.data.records);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.fields.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) => product.fields.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for Products"
          className="px-4 py-2 w-full border rounded-md shadow-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Category</h3>
 <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isSelected =
          selectedCategory === category || (category === 'All' && !selectedCategory);

        return (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category === 'All' ? null : category)
            }
            className={`
              px-4 py-2 rounded-lg border font-medium transition duration-200
              ${
                isSelected
                  ? 'bg-white text-black border-black'
                  : 'bg-blue-600 text-white border-blue-600 hover:bg-white hover:text-black hover:border-black'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>

      </div>

      {/* Product List */}
      <h2 className="text-2xl font-bold mb-6">Product Complements & Upsales</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const {
            product_name,
            product_images,
            cost_price,
            selling_price,
            category,
          } = product.fields;

          return (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow p-4 flex flex-col"
            >
              {/* Product Image */}
              {product_images && product_images.length > 0 && (
                <img
                  src={product_images[0].url}
                  alt={product_images[0].filename}
                  className="w-full h-40 object-contain mb-4 rounded"
                />
              )}

              {/* Product Info */}
              <h3 className="text-lg font-semibold text-gray-800">{product_name}</h3>

              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Cost Price:</span>{' '}
                  <span className="text-blue-600">{cost_price}</span>
                </p>
                <p>
                  <span className="font-medium">Selling Price:</span>{' '}
                  <span className="text-green-600">{selling_price}</span>
                </p>
                <p>
                  <span className="font-medium">Category:</span>{' '}
                  <span className="text-gray-500">{category}</span>
                </p>
              </div>

              {/* Show Details Button */}
              <ShineButton
                onClick={() => navigate(`/products/${product.id}`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Show Details
              </ShineButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
