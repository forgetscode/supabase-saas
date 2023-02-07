export interface Lesson {
    id: number;
    created_at: Date;
    title: string;
    description: string;
    fun: boolean;
  }
  
export interface profile {
    id: number;
    created_at: Date;
    is_subscribed: boolean;
    interval: string;
    stripe_customer: string;
    email: string;
}

export interface premium_content {
  id: number;
  created_at: Date;
  video_url: string;
}

export interface product {
  id: string;
  name: string;
  price: number;
  interval: string;
  currency: string;
}