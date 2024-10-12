import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

let pineconeClientInstance: PineconeClient | null = null;
// Create a new Pinecone index
async function createIndex(
  pinecone: PineconeClient,
  indexName: string | undefined
) {
  try {
    await pinecone.createIndex({
      name: indexName || "", // Adjust to your index name
      dimension: 1024, // Adjust to your vector dimension
      metric: "cosine", // or 'euclidean', 'dotproduct'
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    console.log("Index created successfully!");
  } catch (error) {
    console.error("Error creating index:", error);
  }
}

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pineconeClient = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY! || "",
    });

    const indexName = process.env.PINECONE_INDEX_NAME!;

    const existingIndexes = await pineconeClient.listIndexes();

    //   @ts-ignore
    if (!existingIndexes.indexes.find((i) => i.name === indexName)) {
      createIndex(pineconeClient, indexName);
    } else {
      console.log("Your index already exists. nice !!");
    }

    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}
