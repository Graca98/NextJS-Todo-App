===================================================

# 📝 Todo List App (Next.js + Supabase)

Moderní Todo aplikace s podporou kolekcí, priorit, připomenutí a filtrování.  
Postaveno pomocí Next.js (App Router), Supabase (PostgreSQL) a Tailwind CSS.

---

## 🚀 Funkce aplikace

### Kolekce
- ✅ Vytvoření nové kolekce
- ✅ Úprava názvu kolekce
- ✅ Smazání kolekce (včetně všech úkolů)
- ✅ Výběr aktivní kolekce (pro zobrazení úkolů)

### Úkoly
- ✅ Přidání úkolu do vybrané kolekce
- ✅ Úprava názvu úkolu
- ✅ Mazání úkolu
- ✅ Označení úkolu jako dokončeného
- ✅ Priorita (`low`, `medium`, `high`)
- ✅ Připomenutí, datum splnění, důležitost
- ✅ Filtrování úkolů podle stavu, data, abecedy

---

## 🛠 Technologie

- **Next.js (App Router, API Routes)**
- **Supabase (PostgreSQL, Storage)**
- **Tailwind CSS (mobile-first design)**
- **React Swipeable (gesta pro mobil)**
- **React Icons**

---

## 🌐 API dokumentace

### Kolekce (`/api/collections`)
| Metoda | Popis |
|--------|-------|
| GET    | Získání všech kolekcí |
| POST   | Přidání nové kolekce |
| PATCH  | Úprava názvu kolekce |
| DELETE | Smazání kolekce podle ID |

### Úkoly (`/api/tasks`)
| Metoda | Popis |
|--------|-------|
| GET    | Získání úkolů v kolekci (`collection_id`) |
| POST   | Přidání nového úkolu |

### Úkol (`/api/tasks/[id]`)
| Metoda | Popis |
|--------|-------|
| PATCH  | Úprava úkolu (název, stav, připomenutí...) |
| DELETE | Smazání úkolu |

---

## 💾 Databáze (Supabase PostgreSQL)

### collections
| Sloupec   | Typ          | Popis           |
|-----------|--------------|-----------------|
| id        | SERIAL        | ID kolekce      |
| user_id   | INT           | ID uživatele    |
| name      | VARCHAR(100)  | Název kolekce   |
| created_at| TIMESTAMP     | Datum vytvoření |

### tasks
| Sloupec      | Typ           | Popis          |
|--------------|---------------|----------------|
| id           | SERIAL         | ID úkolu       |
| collection_id| INT            | FK do kolekce  |
| name         | VARCHAR(255)   | Název úkolu    |
| description  | TEXT           | Popis úkolu    |
| due_date     | DATE           | Datum splnění  |
| is_completed | BOOLEAN        | Dokončeno/ne   |
| important    | BOOLEAN        | Důležitost     |
| priority     | ENUM           | Priorita       |
| reminder_at  | TIMESTAMP      | Připomenutí    |
| created_at   | TIMESTAMP      | Vytvořeno      |
| updated_at   | TIMESTAMP      | Poslední změna |

---

## 📱 Responsivita a UX

### Mobil (touch zařízení)
- Swipe gesture pro otevření/zavření sidebaru (`react-swipeable`)
- Floating Action Button (FAB) pro přidání úkolu (`+`) vpravo dole
- Větší paddingy, mezery, ikony (`min-h-12`, `text-4xl`, `gap-4`)
- Sidebar zavíratelný vždy, i na desktopu (hamburger menu)

### Desktop
- Sidebar zavíratelný kliknutím na hamburger
- Inline přidávání úkolu (nebo přes FAB na mobile)
- Přehledné rozdělení úkolů (aktivní/dokončené)
- Přehledný filtr úkolů (plánováno)

---

## ⚙ Nasazení (Netlify)

1. Zaregistruj si projekt na [Supabase](https://supabase.io)
2. Vytvoř tabulky podle sekce **Databáze**
3. Získáš:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Vytvoř `.env` nebo přímo přidej do **Netlify Environment Variables**:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. V projektu spusť build:
```bash
npm run build

