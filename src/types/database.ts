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
            chat_messages: {
                Row: {
                    content: string
                    created_at: string | null
                    id: string
                    metadata: Json | null
                    role: string
                    room_id: string | null
                    user_id: string
                }
                Insert: {
                    content: string
                    created_at?: string | null
                    id?: string
                    metadata?: Json | null
                    role: string
                    room_id?: string | null
                    user_id: string
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    id?: string
                    metadata?: Json | null
                    role?: string
                    room_id?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "chat_messages_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: false
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    },
                ]
            }
            document_sections: {
                Row: {
                    content: string
                    created_at: string | null
                    document_id: string
                    embedding: string | null
                    id: string
                    metadata: Json | null
                }
                Insert: {
                    content: string
                    created_at?: string | null
                    document_id: string
                    embedding?: string | null
                    id?: string
                    metadata?: Json | null
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    document_id?: string
                    embedding?: string | null
                    id?: string
                    metadata?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "document_sections_document_id_fkey"
                        columns: ["document_id"]
                        isOneToOne: false
                        referencedRelation: "documents"
                        referencedColumns: ["id"]
                    },
                ]
            }
            documents: {
                Row: {
                    content: string | null
                    created_at: string
                    embedding: string | null
                    file_path: string
                    id: string
                    title: string
                    user_id: string
                }
                Insert: {
                    content?: string | null
                    created_at?: string
                    embedding?: string | null
                    file_path: string
                    id?: string
                    title: string
                    user_id: string
                }
                Update: {
                    content?: string | null
                    created_at?: string
                    embedding?: string | null
                    file_path?: string
                    id?: string
                    title?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "documents_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    email: string
                    id: string
                    level: number | null
                    total_xp: number | null
                    username: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    email: string
                    id: string
                    level?: number | null
                    total_xp?: number | null
                    username?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string
                    id?: string
                    level?: number | null
                    total_xp?: number | null
                    username?: string | null
                }
                Relationships: []
            }
            room_members: {
                Row: {
                    id: string
                    joined_at: string
                    room_id: string
                    user_id: string
                    role: 'owner' | 'admin' | 'member' | null
                }
                Insert: {
                    id?: string
                    joined_at?: string
                    room_id: string
                    user_id: string
                    role?: 'owner' | 'admin' | 'member'
                }
                Update: {
                    id?: string
                    joined_at?: string
                    room_id?: string
                    user_id?: string
                    role?: 'owner' | 'admin' | 'member'
                }
                Relationships: [
                    {
                        foreignKeyName: "room_members_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: false
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "room_members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            room_notes: {
                Row: {
                    content: string | null
                    created_at: string
                    id: string
                    room_id: string
                    updated_at: string
                }
                Insert: {
                    content?: string | null
                    created_at?: string
                    id?: string
                    room_id: string
                    updated_at?: string
                }
                Update: {
                    content?: string | null
                    created_at?: string
                    id?: string
                    room_id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "room_notes_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: true
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    },
                ]
            }
            rooms: {
                Row: {
                    created_at: string
                    created_by: string | null
                    id: string
                    is_public: boolean | null
                    name: string
                    invite_code: string | null
                    description: string | null
                }
                Insert: {
                    created_at?: string
                    created_by?: string | null
                    id?: string
                    is_public?: boolean | null
                    name: string
                    invite_code?: string | null
                    description?: string | null
                }
                Update: {
                    created_at?: string
                    created_by?: string | null
                    id?: string
                    is_public?: boolean | null
                    name?: string
                    invite_code?: string | null
                    description?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "rooms_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            skills: {
                Row: {
                    category: string
                    created_at: string
                    id: string
                    label: string
                    parents: string[] | null
                }
                Insert: {
                    category: string
                    created_at?: string
                    id?: string
                    label: string
                    parents?: string[] | null
                }
                Update: {
                    category?: string
                    created_at?: string
                    id?: string
                    label?: string
                    parents?: string[] | null
                }
                Relationships: []
            }
            user_skills: {
                Row: {
                    skill_id: string
                    status: string | null
                    user_id: string
                    xp: number | null
                }
                Insert: {
                    skill_id: string
                    status?: string | null
                    user_id: string
                    xp?: number | null
                }
                Update: {
                    skill_id?: string
                    status?: string | null
                    user_id?: string
                    xp?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_skills_skill_id_fkey"
                        columns: ["skill_id"]
                        isOneToOne: false
                        referencedRelation: "skills"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_skills_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            match_documents: {
                Args: {
                    query_embedding: string
                    match_threshold: number
                    match_count: number
                    filter_user_id: string
                }
                Returns: {
                    id: string
                    document_id: string
                    content: string
                    metadata: Json
                    similarity: number
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for convenience
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Commonly used types
export type Profile = Tables<'profiles'>
export type Document = Tables<'documents'>
export type DocumentSection = Tables<'document_sections'>
export type Room = Tables<'rooms'>
export type RoomMember = Tables<'room_members'>
export type RoomNote = Tables<'room_notes'>
export type Skill = Tables<'skills'>
export type UserSkill = Tables<'user_skills'>
export type ChatMessage = Tables<'chat_messages'>

// Match documents return type
export interface DocumentMatch {
    id: string
    document_id: string
    content: string
    metadata: Json
    similarity: number
}
