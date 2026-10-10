export const CATEGORIES = [
  'Groceries', 'Eating out', 'Transport', 'Subscriptions',
  'Shopping', 'Health', 'University', 'Rent', 'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const RULES: { category: Category; keywords: string[] }[] = [
  { category: 'Groceries', keywords: ['tesco', 'sainsbury', 'lidl', 'aldi', 'co-op', 'waitrose' , 'mother group'] },
  { category: 'Eating out', keywords: ['pret', 'costa', 'starbucks', 'greggs', 'mcdonald', 'nando','pizza hut' ,'food','catering','chicken', 'bloomsbury shop','leban', 'buns from home','cafe', 'printroom cafe'] },
  { category: 'Transport', keywords: ['tfl', 'trainline', 'uber', 'ticket', 'national rail'] },
  { category: 'Subscriptions', keywords: ['spotify', 'netflix', 'prime video', 'ee', 'lycamobile','apple.com/bill'] },
  { category: 'Shopping', keywords: ['amazon', 'primark', 'whittard', 'marks&spencer','hollister','sostrene','m&s simple food', 'h&m','asos','sony','kiko milano', 'home bargains'] },
  { category: 'Health', keywords: ['boots', 'superdrug', 'pharmacy'] },
  { category: 'Rent', keywords: ['stripe'] },
];