export interface Supervisor {
  id?: number;
  noms: string;
  telephone: string;
  email: string;
  bureau?: string | null;
  faculteId: number;
}
