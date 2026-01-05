export interface Profile {
    id: string;
    email: string;
    username: string | null;
    avatar_url: string | null;
    created_at: string;
}

export interface Document {
    id: string;
    user_id: string;
    title: string;
    file_path: string | null;
    content: string | null;
    created_at: string;
}

export interface DocumentSection {
    id: string;
    document_id: string;
    content: string;
    embedding: number[] | null; // 384-dimensional vector
    metadata: Record<string, unknown>;
    created_at: string;
}

export interface Room {
    id: string;
    name: string;
    created_by: string;
    is_public: boolean;
    created_at: string;
}

export interface Skill {
    id: string;
    label: string;
    category: 'frontend' | 'backend' | 'ai' | 'general';
    parents: string[];
    created_at: string;
}

export interface UserSkill {
    user_id: string;
    skill_id: string;
    status: 'locked' | 'unlocked' | 'mastered';
    xp: number;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    user_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    room_id: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
}

// Vector search result type
export interface DocumentMatch {
    id: string;
    document_id: string;
    content: string;
    similarity: number;
}

// Supabase Database type - required by createClient<Database>()
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<Profile>;
            };
            documents: {
                Row: Document;
                Insert: Omit<Document, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<Document>;
            };
            document_sections: {
                Row: DocumentSection;
                Insert: Omit<DocumentSection, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<DocumentSection>;
            };
            rooms: {
                Row: Room;
                Insert: Omit<Room, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<Room>;
            };
            skills: {
                Row: Skill;
                Insert: Omit<Skill, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<Skill>;
            };
            user_skills: {
                Row: UserSkill;
                Insert: Omit<UserSkill, 'updated_at'> & { updated_at?: string };
                Update: Partial<UserSkill>;
            };
            chat_messages: {
                Row: ChatMessage;
                Insert: Omit<ChatMessage, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<ChatMessage>;
            };
        };
        Views: Record<string, never>;
        Functions: {
            match_documents: {
                Args: {
                    query_embedding: number[];
                    match_threshold?: number;
                    match_count?: number;
                    filter_user_id?: string;
                };
                Returns: DocumentMatch[];
            };
        };
    };
}

