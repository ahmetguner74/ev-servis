-- Kullanıcılar için Extension'lar
create extension if not exists "uuid-ossp";

-- Profil tablosu
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  email text unique not null,
  phone text,
  avatar_url text,
  address text,
  role text not null default 'USER' check (role in ('USER', 'PROVIDER', 'ADMIN')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hizmet Kategorileri tablosu
create table if not exists service_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text,
  icon text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hizmetler tablosu
create table if not exists services (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  price decimal(10, 2) not null,
  category uuid references service_categories(id) not null,
  image_url text,
  provider_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Randevular tablosu
create table if not exists appointments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  service_id uuid references services(id) not null,
  provider_id uuid references profiles(id) not null,
  appointment_date timestamp with time zone not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Değerlendirmeler tablosu
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  service_id uuid references services(id) not null,
  provider_id uuid references profiles(id) not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mesajlar tablosu
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Otomatik profil oluşturma için tetikleyici fonksiyon
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'USER');
  return new;
end;
$$ language plpgsql security definer;

-- Yeni kullanıcı kayıtlarını izleyen tetikleyici
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sütun güncelleme tetikleyicisi
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Profillerin güncelleme tarihini izleyen tetikleyici
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Hizmetlerin güncelleme tarihini izleyen tetikleyici
create trigger services_updated_at
  before update on public.services
  for each row execute procedure public.handle_updated_at();

-- Randevuların güncelleme tarihini izleyen tetikleyici
create trigger appointments_updated_at
  before update on public.appointments
  for each row execute procedure public.handle_updated_at(); 