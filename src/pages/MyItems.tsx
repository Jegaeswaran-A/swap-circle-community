
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ItemCard from "@/components/items/ItemCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const MyItems = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchMyItems = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch your items");
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [user, token, navigate]);

  const handleEdit = (id: string) => {
    navigate(`/edit-item/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/items/${itemToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Remove the item from the state
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemToDelete));
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your items...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">My Items</h1>
        <Link to="/add-item">
          <Button>Add New Item</Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl mb-2">You haven't added any items yet</h2>
          <p className="text-gray-500 mb-4">Start by adding items you would like to swap</p>
          <Link to="/add-item">
            <Button>Add Your First Item</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              description={item.description}
              condition={item.condition}
              category={item.category}
              imageUrl={item.imageUrl}
              owner={item.owner}
              isOwner={true}
              onEdit={() => handleEdit(item._id)}
              onDelete={() => handleDeleteClick(item._id)}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyItems;
