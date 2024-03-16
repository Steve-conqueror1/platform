export interface Config {
  port: string;
}

export interface Document {
  title: string;
  content: string;
  creatorId: string;
  status: "draft" | "published";
  lastUpdateAuthorId: number;
  documentId: number;
  version: number;
  dateCreated: string;
}

export interface DocumentVersion {
  content: string;
  document_id: number;
  version_number: number;
}
