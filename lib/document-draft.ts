export type DocumentDraft = {
  title: string;
  body: string;
  recipient: string;
  attachments: string[];
  paymentMethod: string;
  paymentStatus: "draft" | "demo-paid";
};

export const documentDraftKey = "buroia-document-draft";

export const emptyDocumentDraft: DocumentDraft = {
  title: "Lettre de demande d'emploi",
  body: "",
  recipient: "Madame, Monsieur,",
  attachments: [],
  paymentMethod: "Mobile Money",
  paymentStatus: "draft",
};
