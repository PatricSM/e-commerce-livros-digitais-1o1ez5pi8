CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  file_url TEXT,
  pages INTEGER,
  language TEXT,
  publisher TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access
CREATE POLICY "Public products are viewable by everyone." 
  ON products FOR SELECT 
  USING (true);

-- Allow authenticated users (admins) to insert, update, and delete
CREATE POLICY "Authenticated users can insert products." 
  ON products FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products." 
  ON products FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products." 
  ON products FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some seed data
INSERT INTO products (title, author, price, description, category, cover_url, pages, language, publisher)
VALUES 
  ('O Guia do Mochileiro das Galáxias', 'Douglas Adams', 29.90, 'Uma aventura espacial hilária que segue Arthur Dent, um terráqueo comum, enquanto ele viaja pelo universo após a destruição da Terra.', 'Ficção Científica', 'https://img.usecurling.com/p/300/450?q=galaxy%20book%20cover', 208, 'Português', 'Arqueiro'),
  ('Dom Casmurro', 'Machado de Assis', 15.50, 'Um clássico da literatura brasileira que explora o ciúme e a dúvida de Bentinho em relação à fidelidade de Capitu.', 'Romance', 'https://img.usecurling.com/p/300/450?q=vintage%20book%20cover', 256, 'Português', 'Penguin'),
  ('Clean Code', 'Robert C. Martin', 89.90, 'Um manual de agilidade de software. Aprenda a escrever código limpo e a refatorar código legado.', 'Tecnologia', 'https://img.usecurling.com/p/300/450?q=code%20book', 464, 'Inglês', 'Alta Books'),
  ('O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', 59.90, 'O início da jornada épica de Frodo Baggins para destruir o Um Anel e salvar a Terra-média.', 'Fantasia', 'https://img.usecurling.com/p/300/450?q=fantasy%20ring%20book', 576, 'Português', 'HarperCollins'),
  ('Pai Rico, Pai Pobre', 'Robert Kiyosaki', 45.00, 'O que os ricos ensinam a seus filhos sobre dinheiro que os pobres e a classe média não ensinam.', 'Negócios', 'https://img.usecurling.com/p/300/450?q=money%20book', 336, 'Português', 'Alta Books'),
  ('1984', 'George Orwell', 22.90, 'Uma distopia assustadora sobre um regime totalitário que vigia cada movimento de seus cidadãos.', 'Ficção', 'https://img.usecurling.com/p/300/450?q=eye%20book%20cover', 416, 'Português', 'Companhia das Letras'),
  ('Sapiens: Uma Breve História da Humanidade', 'Yuval Noah Harari', 54.90, 'Uma exploração fascinante da história da nossa espécie, desde os primórdios até o presente.', 'História', 'https://img.usecurling.com/p/300/450?q=human%20history%20book', 472, 'Português', 'L&PM'),
  ('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 39.90, 'Harry Potter descobre que é um bruxo e começa sua educação mágica em Hogwarts.', 'Fantasia', 'https://img.usecurling.com/p/300/450?q=magic%20wizard%20book', 223, 'Português', 'Rocco');
