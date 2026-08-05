export interface Product {
  id: string | number;
  nombre?: string;
  title?: string;
  name?: string;
  descripcion?: string;
  description?: string;
  precio?: number;
  price?: number;
  precio_anterior?: number;
  original_price?: number;
  imagen_url?: string;
  image?: string;
  images?: string[];
  categoria?: string;
  category?: string;
  subcategoria?: string;
  subCategory?: string;
  stock?: number;
  destacado?: boolean;
  is_featured?: boolean;
  nuevo?: boolean;
  envio_gratis?: boolean;
  talles?: string[];
  colores?: string[];
  rating?: number;
  reviews_count?: number;
  created_at?: string;
}

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  imagen?: string;
  count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface StoreConfig {
  id?: number;
  nombre_tienda?: string;
  titulo_tienda?: string;
  descripcion_tienda?: string;
  texto_bienvenida?: string;
  banner_url?: string;
  color_primario?: string;
  color_secundario?: string;
  whatsapp_numero?: string;
  telefono_whatsapp?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  envio_gratis_minimo?: number;
  monto_envio_gratis?: number;
  cuotas_sin_interes?: number;
  texto_cuotas?: string;
  descuento_transferencia?: number;
  email_contacto?: string;
  direccion?: string;
  ubicacion?: string;
  banner_anuncio?: string;
  barra_anuncio?: string;
  logo_url?: string;
  preguntas_frecuentes?: string;
  texto_preguntas_frecuentes?: string;
  medios_pago_info?: string;
  texto_medios_pago?: string;
  seguimiento_envios_info?: string;
  texto_seguimiento_envio?: string;
  politicas_cambio_info?: string;
  texto_politicas?: string;
  mostrar_newsletter?: boolean;
  mostrar_envio_gratis?: boolean;
  mostrar_cuotas?: boolean;
  mostrar_descuento_transferencia?: boolean;
  mostrar_preguntas_frecuentes?: boolean;
  mostrar_medios_pago?: boolean;
  mostrar_seguimiento_envio?: boolean;
  mostrar_garantia?: boolean;
}

export interface FilterState {
  category: string;
  search: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating';
  onlyInStock: boolean;
  onlyFreeShipping: boolean;
  onlyOnSale: boolean;
}

export interface CustomerOrder {
  id?: string;
  created_at?: string;
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  metodo_pago: string;
  metodo_envio: string;
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  items: CartItem[];
  estado: string;
}
