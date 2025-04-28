"use client";

import { useQuery } from "@tanstack/react-query";

type Collection = {
  id: number;
  name: string;
};

type CollectionsListProps = {
  onSelect: (collectionId: number) => void;
};

export default function CollectionsList({ onSelect }: CollectionsListProps) {
  const { data: collections, isLoading } = useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: async () => {
      const res = await fetch('/api/collections');
      return res.json();
    },
  });

  if (isLoading) return <p>Načítám kolekce...</p>;

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {collections?.map((collection) => (
        <button
          key={collection.id}
          className="px-4 py-2 border rounded hover:bg-gray-200 transition"
          onClick={() => onSelect(collection.id)}
        >
          {collection.name}
        </button>
      ))}
    </div>
  );
}
