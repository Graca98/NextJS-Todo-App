# Todo Appka vytvořená přes NextJS

!!! Předělat !!!
npm install @supabase/supabase-js
npm install react-swipeable


todo:
| Návrh                           | Efekt                        | Inspirace            |
| ------------------------------- | ---------------------------- | -------------------- |
| Empty states                    | Přehlednost, přívětivost     | Todoist, Things      |
| Barvy kolekcí, štítky           | Vizuální odlišení            | Trello, Notion       |
| Drag & Drop                     | Intuitivní přesouvání        | Trello, ClickUp      |
| Progress kolekcí                | Gamifikace, motivace         | Todoist, Habitica    |
| Tmavý režim                     | Moderní vzhled, pohodlí očí  | Všude                |
| Animace, microinteractions      | Prémiový pocit               | Apple Reminders      |
| Mobile First design             | Lepší použitelnost na mobile | Google Tasks, Notion |
| Vyhledávání, filtry             | Efektivnější práce           | Asana, Todoist       |
| Personalizace UI                | Uživatelský komfort          | ClickUp, Notion      |
| Realtime update (SWR, Supabase) | Moderní UX                   | Trello, Notion       |



## Link: https://graca98.github.io/NextJS-Todo-App/


## Hlavní Funkce
Umožňuje uživatelům přidávat, editovat a mazat úkoly.
Každý úkol má přidružené datum a čas v českém formátu, což zlepšuje lokalizaci a uživatelskou přívětivost.

**Seřazení Úkolů:**
Umožňuje seřadit úkoly podle data a času od nejstaršího po nejnovější.
Poskytuje možnost seřazení úkolů abecedně, což usnadňuje organizaci a vyhledávání.

**Interaktivní Uživatelské Rozhraní:**
Využívá komponenty jako modální okna a dropdown menu pro interaktivní a intuitivní ovládání.
Integruje ikony a animace, které zlepšují vizuální stránku aplikace a uživatelskou zkušenost.

**Persistencia Dat:**
Data o úkolech jsou ukládána do localStorage, což umožňuje udržení stavu i po obnovení stránky.
Implementuje efektivní načítání a ukládání úkolů s robustním ošetřením chyb.

**Responsive Design:**
Design aplikace je responsivní a přizpůsobivý různým velikostem obrazovek, což umožňuje pohodlné používání na různých zařízeních.

**Uživatelské Upozornění a Validace:**
Zobrazuje upozornění, pokud je pokus o vložení prázdného úkolu, a pomáhá udržet data konzistentní a validní.

## Technologický Stack
Next.js: Moderní React framework pro server-side rendering a statické generování stránek.
React: Knihovna pro vytváření uživatelských rozhraní.
UUID: Knihovna pro generování jedinečných identifikátorů pro úkoly.
React Icons: Knihovna pro integraci ikon do React aplikací.
Local Storage: Využívání webového úložiště pro persistenci dat bez nutnosti databáze.

## Todo:
Interaktivní Sidebar: (prozatím schovaný v aplikaci)
Sidebar, který lze zobrazit nebo skrýt, poskytuje další navigační možnosti bez ztráty prostoru na hlavní obsahové oblasti.
Integrace s API: Možnost synchronizace úkolů s cloudovým úložištěm pro zálohování a sdílení mezi více zařízeními.
Přidání autentizace: Zabezpečení úkolů uživatelskými účty.
Rozšíření funkcí filtrů: Přidání dalších filtrů pro lepší třídění a vyhledávání úkolů.



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

