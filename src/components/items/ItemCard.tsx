
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ItemProps {
  id: string;
  title: string;
  description: string;
  condition: string;
  category: string;
  imageUrl: string;
  owner: {
    username: string;
    email: string;
  };
  isOwner?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const ItemCard: React.FC<ItemProps> = ({
  id,
  title,
  description,
  condition,
  category,
  imageUrl,
  owner,
  isOwner = false,
  onDelete,
  onEdit,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">{title}</CardTitle>
          <Badge variant={condition === "New" ? "default" : "secondary"}>{condition}</Badge>
        </div>
        <CardDescription className="text-sm">{category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        <p className="mt-2 text-xs text-gray-500">Listed by: {owner.username}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <Link to={`/items/${id}`} className="w-full sm:flex-1">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          {isOwner && (
            <>
              <Button variant="secondary" size="sm" className="sm:flex-1" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="sm:flex-1" onClick={onDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
