import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Documents loaders
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import axios from "axios";
import { jinaEmbed } from "./emedding";

export const jinaLoader = async (
  path: string,
  pineconeInstance: any,
  name?: string,
  workspaceId?: string
): Promise<any> => {
  const response = await axios.get(`https://r.jina.ai/${path}`);
  const data = response.data;
  const text = data.split("Markdown Content:")[1];
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunkedDocs = await splitter.splitText(text);

  const docs = chunkedDocs.map((chunk: any, index: number) => {
    const id = Math.random().toString(36).substring(7);
    return {
      pageContent: chunk,
      text: chunk,
      pageNumber: index + 1,
      metadata: {
        doc_name: name || "Document",
        doc_id: id,
        workspaceId,
      },
    };
  });
  await jinaEmbed(docs, pineconeInstance);
  return docs;
};

export const pdfLoader = async (filePath: string): Promise<any> => {
  try {
    const loader = new PDFLoader(filePath, {
      splitPages: false,
    });

    const docs = await loader.load();

    if (docs.length === 0) {
      return "Unable to load document";
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await splitter.splitDocuments(docs);

    return chunkedDocs;
  } catch (error) {
    console.error("Error loading PDF document", error);
    return "Error loading PDF document";
  }
};

// export const textLoader = async (path: string): Promise<string> => {
//   const loader = new TextLoader(path);
//   const docs = await loader.load();

//   if (docs.length === 0) {
//     return "Unable to load document";
//   }

//   const text = docs[0].pageContent;

//   return "";
// };

// export const csvLoader = async (path: string): Promise<string> => {
//   const loader = new CSVLoader(path);
//   const docs = await loader.load();

//   if (docs.length === 0) {
//     return "Unable to load document";
//   }

//   const text = docs[0].pageContent;

//   return "";
// };
