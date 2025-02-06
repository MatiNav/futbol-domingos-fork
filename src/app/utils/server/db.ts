import { CollectionMapping } from "@/app/constants/types";
import clientPromise from "@/lib/mongodb";

export async function getCollection<T extends keyof CollectionMapping>(
  collectionName: T
) {
  const db = (await clientPromise).db("futbol");
  return db.collection<CollectionMapping[T]>(collectionName);
}
