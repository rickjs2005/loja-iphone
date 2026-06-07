/**
 * Tipos do banco.
 *
 * Estes tipos refletem o schema em supabase/migrations. Quando você tiver o
 * projeto Supabase rodando, pode regenerá-los automaticamente com:
 *
 *   supabase gen types typescript --project-id <REF> > src/types/database.types.ts
 *
 * (ou --local se estiver usando `supabase start`). Mantenha este arquivo como a
 * fonte de verdade de tipos para toda a camada de dados.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_cents: number;
          stock: number;
          installments: number;
          category: string;
          accessory_category: string | null;
          battery_health: number | null;
          condition: string | null;
          is_active: boolean;
          sort_order: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_cents: number;
          stock?: number;
          installments?: number;
          category?: string;
          accessory_category?: string | null;
          battery_health?: number | null;
          condition?: string | null;
          is_active?: boolean;
          sort_order?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          stock?: number;
          installments?: number;
          category?: string;
          accessory_category?: string | null;
          battery_health?: number | null;
          condition?: string | null;
          is_active?: boolean;
          sort_order?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      store_settings: {
        Row: {
          id: number;
          address: string | null;
          hours: string | null;
          maps_url: string | null;
          payment_methods: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          address?: string | null;
          hours?: string | null;
          maps_url?: string | null;
          payment_methods?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          address?: string | null;
          hours?: string | null;
          maps_url?: string | null;
          payment_methods?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_images: {
        Row: {
          id: string;
          section: string;
          url: string;
          sort_order: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          url: string;
          sort_order?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          url?: string;
          sort_order?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

// Atalhos úteis para a camada de dados.
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type ProductImageRow =
  Database["public"]["Tables"]["product_images"]["Row"];
export type ProductImageInsert =
  Database["public"]["Tables"]["product_images"]["Insert"];
export type StoreSettingsRow =
  Database["public"]["Tables"]["store_settings"]["Row"];
export type SiteImageRow = Database["public"]["Tables"]["site_images"]["Row"];
export type SiteSection = "loja" | "entrega";
