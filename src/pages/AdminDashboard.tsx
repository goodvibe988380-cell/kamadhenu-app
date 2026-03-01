import React, { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User, Order, Product, OrderStatus } from '@/types';
import { 
  getUsers, 
  addUser, 
  updateUser, 
  deleteUser,
  getProduct,
  addStock,
  getOrders,
  updateOrderStatus,
  reduceStock,
  getDashboardStats
} from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Milk, 
  LogOut, 
  Users, 
  Package, 
  ShoppingCart, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  UserPlus,
  Trash2,
  Search,
  CheckCheck,
  X,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(() => getDashboardStats());
  
  // Data states
  const [users, setUsers] = useState<User[]>(() => getUsers().filter(u => u.role === 'user'));
  const [orders, setOrders] = useState<Order[]>(() =>
    getOrders().sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );
  const [product, setProduct] = useState<Product | null>(() => getProduct());
  
  // Form states
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [stockAmount, setStockAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  const loadAllData = useCallback(() => {
    setStats(getDashboardStats());
    setUsers(getUsers().filter(u => u.role === 'user'));
    setOrders(getOrders().sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ));
    setProduct(getProduct());
  }, []);


  // Customer Management
  const handleAddCustomer = () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^\d{10}$/.test(newCustomerPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Check if phone already exists
    const existingUsers = getUsers();
    if (existingUsers.some(u => u.phone_number === newCustomerPhone)) {
      toast.error('Phone number already registered');
      return;
    }

    addUser({
      name: newCustomerName.trim(),
      phone_number: newCustomerPhone.trim(),
      role: 'user',
      is_active: true,
    });

    toast.success('Customer added successfully');
    setNewCustomerName('');
    setNewCustomerPhone('');
    setAddCustomerOpen(false);
    loadAllData();
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteUser(id);
      toast.success('Customer deleted');
      loadAllData();
    }
  };

  const handleToggleUserStatus = (userData: User) => {
    updateUser(userData.id, { is_active: !userData.is_active });
    toast.success(`Customer ${userData.is_active ? 'deactivated' : 'activated'}`);
    loadAllData();
  };

  // Stock Management
  const handleAddStock = () => {
    const amount = parseInt(stockAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    addStock(amount);
    toast.success(`Added ${amount} bags to stock`);
    setStockAmount('');
    loadAllData();
  };

  // Order Management
  const handleAcceptOrder = (order: Order) => {
    if (!product) return;

    if (order.quantity > product.stock) {
      toast.error('Insufficient stock to accept this order');
      return;
    }

    reduceStock(order.quantity);
    updateOrderStatus(order.id, 'accepted');
    toast.success('Order accepted');
    loadAllData();
  };

  const handleRejectOrder = (order: Order) => {
    updateOrderStatus(order.id, 'rejected');
    toast.success('Order rejected');
    loadAllData();
  };

  // Helpers
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" /> Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
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

  const filteredOrders = orders.filter(o => 
    o.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user_phone.includes(searchQuery)
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone_number.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Milk className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Kamadhenu Junnu</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-gray-500">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Customers
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Stock
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.currentStock}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Accepted</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.acceptedOrders}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium text-gray-800">{order.user_name}</p>
                      <p className="text-sm text-gray-500">{order.quantity} bags - {formatDate(order.created_at)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredOrders.map(order => (
              <Card key={order.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{order.user_name}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">{order.user_phone}</p>
                      <p className="text-sm text-gray-400">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="text-xl font-bold text-gray-800">{order.quantity}</p>
                      </div>
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptOrder(order)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCheck className="w-4 h-4 mr-1" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectOrder(order)}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredOrders.length === 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-8 text-center text-gray-500">
                  No orders found
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={addCustomerOpen} onOpenChange={setAddCustomerOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-green-500">
                    <UserPlus className="w-4 h-4 mr-2" /> Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Enter customer name"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="10-digit number"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                      />
                    </div>
                    <Button onClick={handleAddCustomer} className="w-full bg-gradient-to-r from-blue-500 to-green-500">
                      Add Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {filteredUsers.map(userData => (
              <Card key={userData.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{userData.name}</p>
                        <p className="text-sm text-gray-500">{userData.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={userData.is_active ? 'default' : 'secondary'}
                        className={userData.is_active ? 'bg-green-500' : 'bg-gray-400'}
                      >
                        {userData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleUserStatus(userData)}
                      >
                        {userData.is_active ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCustomer(userData.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredUsers.length === 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-8 text-center text-gray-500">
                  No customers found
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Current Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-2">Available Stock</p>
                  <p className="text-6xl font-bold text-gray-800">{product?.stock || 0}</p>
                  <p className="text-gray-500 mt-2">bags</p>
                </div>

                <div className="border-t pt-6">
                  <Label className="mb-2 block">Add Stock</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter quantity to add"
                      value={stockAmount}
                      onChange={(e) => setStockAmount(e.target.value)}
                      min="1"
                    />
                    <Button onClick={handleAddStock} className="bg-gradient-to-r from-blue-500 to-green-500">
                      <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> Kamadhenu Milk Junnu Powder</p>
                  <p><span className="font-medium">Packaging:</span> 100g x 120pc = 1 bag</p>
                  <p><span className="font-medium">Description:</span> Traditional South Indian Colostrum Milk Dessert. No Preservatives. High in Protein & Calcium.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

