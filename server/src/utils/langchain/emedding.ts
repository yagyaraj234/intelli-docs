import { JinaEmbeddings } from "@langchain/community/embeddings/jina";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const JINA_API_TOKEN = process.env.JINAAI_API_KEY!;

export async function jinaEmbed(docs: any, pineconeInstance: any) {
  const embeddings = new JinaEmbeddings({
    apiKey: JINA_API_TOKEN,
    model: "jina-embeddings-v3",
  });

  const documentEmbeddings = await embeddings.embedDocuments(docs);

  const index = pineconeInstance.Index(process.env.PINECONE_INDEX_NAME!);

  await PineconeStore.fromDocuments(
    documentEmbeddings.map((embedding, index) => ({
      pageContent: docs[index].pageContent, // Replace with actual page content
      metadata: docs[index].metadata,
      embedding,
    })),
    embeddings,
    {
      pineconeIndex: index,
      textKey: "text",
    }
  );
}

export async function retrieveFromVectorStore(
  client: PineconeClient,
  query: string,
  workspaceId: string
) {
  try {
    const embeddings = new JinaEmbeddings({
      apiKey: JINA_API_TOKEN,
      model: "jina-embeddings-v3",
    });
    const index = client.Index(process.env.PINECONE_INDEX_NAME!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    const results = await vectorStore.similaritySearch(query, 5);

    const filteredResults = results.filter((result) => {
      return result.metadata.workspaceId === workspaceId;
    });

    const context = filteredResults
      .map((result) => {
        return result.pageContent;
      })
      .join(" ");
    return context;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while retrieving from vector store!");
  }
}

export const deleteFromPinecone = async (client:PineconeClient,id: string) => {
  try {
    const index = client.Index(process.env.PINECONE_INDEX_NAME!);
    await index.deleteMany({
      doc_id: id
    })
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while deleting from pinecone!");
  }
};
