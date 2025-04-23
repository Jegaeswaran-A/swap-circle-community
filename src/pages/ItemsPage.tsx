
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import ItemCard from "@/components/items/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

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

const ItemsPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
