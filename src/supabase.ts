export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      drawers: {
        Row: {
          created_at: string
          drawer_id: string
          drawer_type: Database["public"]["Enums"]["drawer_type"]
          name: string
        }
        Insert: {
          created_at?: string
          drawer_id?: string
          drawer_type: Database["public"]["Enums"]["drawer_type"]
          name: string
        }
        Update: {
          created_at?: string
          drawer_id?: string
          drawer_type?: Database["public"]["Enums"]["drawer_type"]
          name?: string
        }
        Relationships: []
      }
      "drawers.drivers": {
        Row: {
          created_at: string
          drawer_id: string
          driver_id: string | null
        }
        Insert: {
          created_at?: string
          drawer_id?: string
          driver_id?: string | null
        }
        Update: {
          created_at?: string
          drawer_id?: string
          driver_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drawers.drivers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drawers.drivers_id_fkey"
            columns: ["drawer_id"]
            isOneToOne: true
            referencedRelation: "drawers"
            referencedColumns: ["drawer_id"]
          },
        ]
      }
      orders: {
        Row: {
          business_date: string
          created_at: string
          drawer_id: string | null
          order_id: string
          order_number: number | null
          order_type: Database["public"]["Enums"]["order_type"]
          phone: string | null
          total_in_cents: number
        }
        Insert: {
          business_date: string
          created_at?: string
          drawer_id?: string | null
          order_id?: string
          order_number?: number | null
          order_type?: Database["public"]["Enums"]["order_type"]
          phone?: string | null
          total_in_cents?: number
        }
        Update: {
          business_date?: string
          created_at?: string
          drawer_id?: string | null
          order_id?: string
          order_number?: number | null
          order_type?: Database["public"]["Enums"]["order_type"]
          phone?: string | null
          total_in_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_drawer_id_fkey"
            columns: ["drawer_id"]
            isOneToOne: false
            referencedRelation: "drawers"
            referencedColumns: ["drawer_id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      drawer_type: "driver" | "register" | "third_party"
      order_type: "delivery" | "pickup"
      payment_type: "cash" | "card" | "third_party"
      third_party: "DoorDash" | "Grubhub" | "Pizzamico" | "UberEats"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
