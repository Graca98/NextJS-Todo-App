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

