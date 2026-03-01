import React, { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Product, Order } from '@/types';
import { getProduct, addOrder, getOrdersByUser } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Milk, 
  LogOut, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Package, 
  History,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [product, setProduct] = useState<Product | null>(() => getProduct());
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState<Order[]>(() =>
    user
      ? getOrdersByUser(user.phone_number).sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      : []
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'product' | 'orders'>('product');

  const loadData = useCallback(() => {
    const prod = getProduct();
    setProduct(prod);
    
    if (user) {
      const userOrders = getOrdersByUser(user.phone_number);
      setOrders(userOrders.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
      return;
    }

    setOrders([]);
  }, [user]);


  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handlePlaceOrder = () => {
    if (!product || !user) return;
    
    if (quantity > product.stock) {
      toast.error('Requested quantity exceeds available stock');
      return;
    }

    setLoading(true);
    
    // Create order
    addOrder({
      user_phone: user.phone_number,
      user_name: user.name,
      quantity,
      status: 'pending',
    });

    toast.success('Order placed successfully!');
    setQuantity(1);
    loadData();
    setLoading(false);
    setActiveTab('orders');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Milk className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Kamadhenu Junnu</h1>
              <p className="text-xs text-gray-500">Order Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.phone_number}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-gray-500">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('product')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'product'
                ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4" />
            Product
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="w-4 h-4" />
            My Orders
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'product' ? (
          <div className="space-y-6">
            {/* Product Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full md:w-48 h-48 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                    <img 
                      src="/product-image.png" 
                      alt="Kamadhenu Milk Junnu Powder"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Kamadhenu Milk Junnu Powder
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      100g x 120pc = 1 bag
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Traditional South Indian Colostrum Milk Dessert</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>No Preservatives</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>High in Protein & Calcium</span>
                      </div>
                    </div>

                    {/* Stock Badge */}
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`text-sm px-3 py-1 ${
                          product && product.stock > 0 
                            ? 'bg-green-50 text-green-700 border-green-300' 
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Available Stock: {product?.stock || 0} bags
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Section */}
              <CardContent className="p-6">
                {product && product.stock > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-medium">Select Quantity</Label>
                      <span className="text-sm text-gray-500">Min: 1 bag</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-12 h-12 rounded-full"
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                      
                      <div className="flex-1 text-center">
                        <span className="text-3xl font-bold text-gray-800">{quantity}</span>
                        <p className="text-sm text-gray-500">bag(s)</p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-12 h-12 rounded-full"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    {quantity > product.stock && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>
                          Requested quantity exceeds available stock
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={loading || quantity > product.stock}
                      className="w-full h-14 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold text-lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </div>
                ) : (
                  <Alert variant="destructive" className="text-center">
                    <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                    <AlertDescription className="text-lg font-medium">
                      Out of Stock
                    </AlertDescription>
                    <p className="text-sm mt-1">Please check back later</p>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Orders List */}
            {orders.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Orders Yet</h3>
                  <p className="text-gray-500 mb-4">Place your first order from the Product tab</p>
                  <Button 
                    onClick={() => setActiveTab('product')}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  >
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            Order #{order.id.slice(-6)}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="text-xl font-bold text-gray-800">{order.quantity}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Bags</p>
                          <p className="text-lg font-medium text-gray-800">
                            {order.quantity * 120} <span className="text-xs">pcs</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
