import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiFilter, FiMapPin, FiUser, FiLogOut, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    state: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    quantity: '',
    description: '',
    state: '',
    contact: '',
    image: null
  });
  const [showProductForm, setShowProductForm] = useState(false);

  // Load mock products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockProducts = [
        {
          id: '1',
          sellerId: 'seller123',
          sellerName: 'Organic Farms Co.',
          name: 'Organic Tomatoes',
          category: 'vegetables',
          price: 45,
          quantity: '100 kg',
          description: 'Fresh organic tomatoes from our greenhouse',
          state: 'Maharashtra',
          contact: '9876543210',
          image: 'https://images.unsplash.com/photo-1592841200221-a6896f81b5b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          postedOn: '2023-05-15'
        },
        {
          id: '2',
          sellerId: 'seller456',
          sellerName: 'Grain Masters',
          name: 'Basmati Rice',
          category: 'grains',
          price: 85,
          quantity: '500 kg',
          description: 'Premium quality basmati rice, freshly harvested',
          state: 'Punjab',
          contact: '8765432109',
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          postedOn: '2023-05-10'
        },
      ];
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);

  // Filter products based on search and filters
  useEffect(() => {
    let results = products;
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter(product => product.category === filters.category);
    }
    
    // Apply price range filter
    results = results.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // Apply state filter
    if (filters.state) {
      results = results.filter(product =>
        product.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }
    
    setFilteredProducts(results);
  }, [searchTerm, filters, products]);

  // User authentication functions
  const handleLogin = (userType) => {
    setCurrentUser({
      id: userType === 'seller' ? 'seller123' : 'buyer123',
      name: userType === 'seller' ? 'Organic Farms Co.' : 'FreshMart Buyer',
      type: userType
    });
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Product management functions
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProductItem = {
      ...newProduct,
      id: `product${products.length + 1}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      postedOn: new Date().toISOString().split('T')[0],
      price: Number(newProduct.price)
    };
    
    setProducts([...products, newProductItem]);
    setNewProduct({
      name: '',
      category: 'vegetables',
      price: '',
      quantity: '',
      description: '',
      state: '',
      contact: '',
      image: null
    });
    setShowProductForm(false);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity,
      description: product.description,
      state: product.state,
      contact: product.contact,
      image: product.image
    });
    setShowProductForm(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <FiShoppingCart className="text-green-600 text-3xl mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">AgriTech Marketplace</h1>
        </div>
        
        {/* User Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-600" />
                <span className="text-sm font-medium">
                  {currentUser.name} ({currentUser.type})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition w-full md:w-auto"
            >
              Login
            </button>
          )}
          
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, category..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-2 text-gray-500 hover:text-green-600"
              aria-label="Toggle filters"
            >
              <FiFilter />
            </button>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Login Type</h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleLogin('buyer')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <FiShoppingCart />
                  Continue as Buyer
                  <span className="text-sm opacity-80">(Browse products)</span>
                </button>
                <button
                  onClick={() => handleLogin('seller')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FiUser />
                  Continue as Seller
                  <span className="text-sm opacity-80">(Manage products)</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-4 mb-6 overflow-hidden"
          >
            <h3 className="font-medium text-gray-700 mb-3">Filter Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                    min="0"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max price"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                    min="0"
                  />
                </div>
              </div>
              
              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="Filter by state"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Button (for sellers) */}
      {currentUser?.type === 'seller' && (
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            onClick={() => setShowProductForm(true)}
          >
            <FiPlus />
            Add New Product
          </motion.button>
        </div>
      )}

      {/* Add/Edit Product Form */}
      <AnimatePresence>
        {showProductForm && currentUser?.type === 'seller' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {newProduct.id ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>
                
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    min="0"
                    required
                  />
                </div>
                
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    placeholder="e.g., 100 kg, 50 units"
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newProduct.state}
                    onChange={(e) => setNewProduct({ ...newProduct, state: e.target.value })}
                    required
                  />
                </div>
                
                {/* Contact Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newProduct.contact}
                    onChange={(e) => setNewProduct({ ...newProduct, contact: e.target.value })}
                    required
                  />
                </div>
                
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image {!newProduct.image && '(optional)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    onChange={handleImageUpload}
                  />
                  {newProduct.image && (
                    <div className="mt-2">
                      <img 
                        src={newProduct.image} 
                        alt="Preview" 
                        className="h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                  onClick={() => setShowProductForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  {newProduct.id ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full capitalize">
                    {product.category}
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                    <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">{product.quantity}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FiMapPin className="mr-1" />
                      <span>{product.state}</span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="font-medium">Seller:</span> {product.sellerName}
                      <br />
                      <span className="font-medium">Contact:</span> {product.contact}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      {currentUser?.type === 'buyer' && (
                        <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-1 text-sm">
                          <FiShoppingCart />
                          Contact Seller
                        </button>
                      )}
                      
                      {currentUser?.type === 'seller' && currentUser.id === product.sellerId && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-1 text-sm"
                          >
                            <FiEdit />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-1 text-sm"
                          >
                            <FiTrash2 />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
              <FaLeaf className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm || filters.category !== 'all' || filters.state
                  ? "Try adjusting your search or filters"
                  : "No products available in the marketplace"}
              </p>
              {currentUser?.type === 'seller' && (
                <button
                  onClick={() => setShowProductForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <FiPlus className="mr-1" />
                  Add Your First Product
                </button>
              )}
              {!currentUser && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Login to add products
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;