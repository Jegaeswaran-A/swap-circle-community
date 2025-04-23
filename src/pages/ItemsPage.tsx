
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import ItemCard from "@/components/items/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Item {
  _id: string;
  title: string;
  description: string;
  condition: string;
  category: string;
  imageUrl: string;
  owner: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
}

// Sample data to display when backend connection fails
const sampleItems: Item[] = [
  {
    _id: "1",
    title: "Vintage Camera",
    description: "A beautiful vintage camera in excellent condition",
    condition: "Good",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    owner: {
      _id: "user1",
      username: "johndoe",
      email: "john@example.com"
    },
    createdAt: "2023-04-15"
  },
  {
    _id: "2",
    title: "Mountain Bike",
    description: "Barely used mountain bike, perfect for trails",
    condition: "Excellent",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop",
    owner: {
      _id: "user2",
      username: "janedoe",
      email: "jane@example.com"
    },
    createdAt: "2023-04-10"
  },
  {
    _id: "3",
    title: "Acoustic Guitar",
    description: "Beautiful acoustic guitar with great sound",
    condition: "Like New",
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=1000&auto=format&fit=crop",
    owner: {
      _id: "user3",
      username: "bobsmith",
      email: "bob@example.com"
    },
    createdAt: "2023-04-05"
  },
  {
    _id: "4",
    title: "Coffee Table Book",
    description: "Interesting coffee table book about architecture",
    condition: "Good",
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
    owner: {
      _id: "user4",
      username: "sarahlee",
      email: "sarah@example.com"
    },
    createdAt: "2023-03-28"
  }
];

const ItemsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
        setUsingDemoData(false);
      } catch (err) {
        console.error("Error fetching items:", err);
        // Use sample data when API is not available
        setItems(sampleItems);
        setFilteredItems(sampleItems);
        setUsingDemoData(true);
        setError("Could not connect to the server. Showing demo data instead.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Filter items based on search term and category
    let results = items;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        item =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }
    
    if (categoryFilter) {
      results = results.filter(item => item.category === categoryFilter);
    }
    
    setFilteredItems(results);
  }, [searchTerm, categoryFilter, items]);

  // Extract unique categories
  const categories = Array.from(new Set(items.map(item => item.category))).sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading items...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {usingDemoData && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-700">
            Using demo data - Unable to connect to the backend server. Please follow the setup instructions in README-SETUP.md.
          </p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Explore Items</h1>
        <Link to="/add-item">
          <Button>Add New Item</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl mb-2">No items found</h2>
          <p className="text-gray-500 mb-4">
            {searchTerm || categoryFilter
              ? "Try adjusting your search or filters"
              : "Be the first to add an item!"}
          </p>
          <Link to="/add-item">
            <Button>Add New Item</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              description={item.description}
              condition={item.condition}
              category={item.category}
              imageUrl={item.imageUrl}
              owner={item.owner}
              isOwner={user?.id === item.owner._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
