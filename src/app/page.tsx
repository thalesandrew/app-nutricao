'use client';

import { useState, useEffect } from 'react';
import { Search, Beef, Apple, Wheat, Carrot, Milk, Droplet, Leaf, Fish, Egg, LogOut, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface NutritionalInfo {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  saturatedFat: number;
  monounsaturatedFat: number;
  polyunsaturatedFat: number;
  cholesterol: number;
  omega3: number;
  omega6: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  vitaminB1: number;
  vitaminB2: number;
  vitaminB3: number;
  vitaminB6: number;
  vitaminB12: number;
  folicAcid: number;
  calcium: number;
  iron: number;
  magnesium: number;
  potassium: number;
  zinc: number;
  sodium: number;
  phosphorus: number;
  selenium: number;
  copper: number;
  manganese: number;
}

const foods: NutritionalInfo[] = [
  // Frutas
  { name: 'Banana', category: 'Frutas', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 27, omega6: 46, vitaminA: 64, vitaminC: 8.7, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.5, vitaminB1: 0.03, vitaminB2: 0.07, vitaminB3: 0.7, vitaminB6: 0.4, vitaminB12: 0, folicAcid: 20, calcium: 5, iron: 0.3, magnesium: 27, potassium: 358, zinc: 0.2, sodium: 1, phosphorus: 22, selenium: 1, copper: 0.08, manganese: 0.3 },
  { name: 'Maçã', category: 'Frutas', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 9, omega6: 43, vitaminA: 54, vitaminC: 4.6, vitaminD: 0, vitaminE: 0.2, vitaminK: 2.2, vitaminB1: 0.02, vitaminB2: 0.03, vitaminB3: 0.1, vitaminB6: 0.04, vitaminB12: 0, folicAcid: 3, calcium: 6, iron: 0.1, magnesium: 5, potassium: 107, zinc: 0, sodium: 1, phosphorus: 11, selenium: 0, copper: 0.03, manganese: 0.04 },
  { name: 'Uva', category: 'Frutas', calories: 69, protein: 0.7, carbs: 18.1, fat: 0.2, fiber: 0.9, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 11, omega6: 37, vitaminA: 66, vitaminC: 10.8, vitaminD: 0, vitaminE: 0.2, vitaminK: 14.6, vitaminB1: 0.07, vitaminB2: 0.07, vitaminB3: 0.2, vitaminB6: 0.09, vitaminB12: 0, folicAcid: 2, calcium: 10, iron: 0.4, magnesium: 7, potassium: 191, zinc: 0.1, sodium: 2, phosphorus: 20, selenium: 0.1, copper: 0.13, manganese: 0.07 },
  { name: 'Melancia', category: 'Frutas', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 50, vitaminA: 569, vitaminC: 8.1, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.1, vitaminB1: 0.03, vitaminB2: 0.02, vitaminB3: 0.2, vitaminB6: 0.05, vitaminB12: 0, folicAcid: 3, calcium: 7, iron: 0.2, magnesium: 10, potassium: 112, zinc: 0.1, sodium: 1, phosphorus: 11, selenium: 0.4, copper: 0.04, manganese: 0.04 },
  { name: 'Abacaxi', category: 'Frutas', calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1, fiber: 1.4, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 28, vitaminA: 58, vitaminC: 47.8, vitaminD: 0, vitaminE: 0, vitaminK: 0.7, vitaminB1: 0.08, vitaminB2: 0.03, vitaminB3: 0.5, vitaminB6: 0.11, vitaminB12: 0, folicAcid: 18, calcium: 13, iron: 0.3, magnesium: 12, potassium: 109, zinc: 0.1, sodium: 1, phosphorus: 8, selenium: 0.1, copper: 0.11, manganese: 0.9 },
  { name: 'Mamão', category: 'Frutas', calories: 43, protein: 0.5, carbs: 10.8, fat: 0.3, fiber: 1.7, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 950, vitaminC: 60.9, vitaminD: 0, vitaminE: 0.3, vitaminK: 2.6, vitaminB1: 0.02, vitaminB2: 0.03, vitaminB3: 0.4, vitaminB6: 0.04, vitaminB12: 0, folicAcid: 37, calcium: 20, iron: 0.3, magnesium: 21, potassium: 182, zinc: 0.1, sodium: 8, phosphorus: 10, selenium: 0.6, copper: 0.05, manganese: 0.04 },
  { name: 'Pera', category: 'Frutas', calories: 57, protein: 0.4, carbs: 15.2, fat: 0.1, fiber: 3.1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 25, vitaminC: 4.3, vitaminD: 0, vitaminE: 0.1, vitaminK: 4.4, vitaminB1: 0.01, vitaminB2: 0.03, vitaminB3: 0.2, vitaminB6: 0.03, vitaminB12: 0, folicAcid: 7, calcium: 9, iron: 0.2, magnesium: 7, potassium: 116, zinc: 0.1, sodium: 1, phosphorus: 12, selenium: 0.1, copper: 0.08, manganese: 0.05 },
  { name: 'Laranja', category: 'Frutas', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 25, vitaminA: 225, vitaminC: 53.2, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.09, vitaminB2: 0.04, vitaminB3: 0.3, vitaminB6: 0.06, vitaminB12: 0, folicAcid: 30, calcium: 40, iron: 0.1, magnesium: 10, potassium: 181, zinc: 0.1, sodium: 0, phosphorus: 14, selenium: 0.5, copper: 0.05, manganese: 0.03 },
  { name: 'Goiaba', category: 'Frutas', calories: 68, protein: 2.6, carbs: 14.3, fat: 1, fiber: 5.4, saturatedFat: 0.3, monounsaturatedFat: 0, polyunsaturatedFat: 0.4, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 624, vitaminC: 228.3, vitaminD: 0, vitaminE: 0.7, vitaminK: 2.6, vitaminB1: 0.07, vitaminB2: 0.04, vitaminB3: 1.1, vitaminB6: 0.11, vitaminB12: 0, folicAcid: 49, calcium: 18, iron: 0.3, magnesium: 22, potassium: 417, zinc: 0.2, sodium: 2, phosphorus: 40, selenium: 0.6, copper: 0.23, manganese: 0.15 },
  { name: 'Manga', category: 'Frutas', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 1082, vitaminC: 36.4, vitaminD: 0, vitaminE: 0.9, vitaminK: 4.2, vitaminB1: 0.03, vitaminB2: 0.04, vitaminB3: 0.7, vitaminB6: 0.12, vitaminB12: 0, folicAcid: 43, calcium: 11, iron: 0.2, magnesium: 10, potassium: 168, zinc: 0, sodium: 1, phosphorus: 14, selenium: 0.6, copper: 0.11, manganese: 0.06 },
  { name: 'Maracujá', category: 'Frutas', calories: 97, protein: 2.2, carbs: 23.4, fat: 0.7, fiber: 10.4, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.4, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 1274, vitaminC: 30, vitaminD: 0, vitaminE: 0, vitaminK: 0.7, vitaminB1: 0, vitaminB2: 0.13, vitaminB3: 1.5, vitaminB6: 0.1, vitaminB12: 0, folicAcid: 14, calcium: 12, iron: 1.6, magnesium: 29, potassium: 348, zinc: 0.1, sodium: 28, phosphorus: 68, selenium: 0.6, copper: 0.09, manganese: 0.08 },
  { name: 'Kiwi', category: 'Frutas', calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5, fiber: 3, saturatedFat: 0, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.3, cholesterol: 0, omega3: 42, omega6: 246, vitaminA: 87, vitaminC: 92.7, vitaminD: 0, vitaminE: 1.5, vitaminK: 40.3, vitaminB1: 0.03, vitaminB2: 0.03, vitaminB3: 0.3, vitaminB6: 0.06, vitaminB12: 0, folicAcid: 25, calcium: 34, iron: 0.3, magnesium: 17, potassium: 312, zinc: 0.1, sodium: 3, phosphorus: 34, selenium: 0.2, copper: 0.13, manganese: 0.1 },
  { name: 'Jabuticaba', category: 'Frutas', calories: 58, protein: 0.6, carbs: 15.3, fat: 0.1, fiber: 2.3, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 22.7, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.02, vitaminB2: 0.02, vitaminB3: 0.2, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 8, iron: 0.4, magnesium: 16, potassium: 130, zinc: 0.1, sodium: 0, phosphorus: 13, selenium: 0, copper: 0.05, manganese: 0.02 },
  { name: 'Coco', category: 'Frutas', calories: 354, protein: 3.3, carbs: 15.2, fat: 33.5, fiber: 9, saturatedFat: 29.7, monounsaturatedFat: 1.4, polyunsaturatedFat: 0.4, cholesterol: 0, omega3: 0, omega6: 366, vitaminA: 0, vitaminC: 3.3, vitaminD: 0, vitaminE: 0.2, vitaminK: 0.2, vitaminB1: 0.07, vitaminB2: 0.02, vitaminB3: 0.5, vitaminB6: 0.05, vitaminB12: 0, folicAcid: 26, calcium: 14, iron: 2.4, magnesium: 32, potassium: 356, zinc: 1.1, sodium: 20, phosphorus: 113, selenium: 10.1, copper: 0.44, manganese: 1.5 },
  { name: 'Açaí', category: 'Frutas', calories: 247, protein: 3.8, carbs: 32.5, fat: 12.2, fiber: 16.9, saturatedFat: 2.2, monounsaturatedFat: 3.2, polyunsaturatedFat: 1.3, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 1002, vitaminC: 9, vitaminD: 0, vitaminE: 2.7, vitaminK: 0, vitaminB1: 0.25, vitaminB2: 0.01, vitaminB3: 0.4, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 286, iron: 4.4, magnesium: 0, potassium: 932, zinc: 0.7, sodium: 56, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Acerola', category: 'Frutas', calories: 32, protein: 0.4, carbs: 7.7, fat: 0.3, fiber: 1.1, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 767, vitaminC: 941.4, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.02, vitaminB2: 0.06, vitaminB3: 0.4, vitaminB6: 0.01, vitaminB12: 0, folicAcid: 14, calcium: 12, iron: 0.2, magnesium: 18, potassium: 146, zinc: 0.1, sodium: 7, phosphorus: 11, selenium: 0.6, copper: 0.09, manganese: 0.02 },
  { name: 'Amora', category: 'Frutas', calories: 43, protein: 1.4, carbs: 9.6, fat: 0.5, fiber: 5.3, saturatedFat: 0, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.3, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 214, vitaminC: 21, vitaminD: 0, vitaminE: 0.9, vitaminK: 19.8, vitaminB1: 0.03, vitaminB2: 0.03, vitaminB3: 0.6, vitaminB6: 0.03, vitaminB12: 0, folicAcid: 25, calcium: 29, iron: 0.6, magnesium: 20, potassium: 162, zinc: 0.1, sodium: 1, phosphorus: 22, selenium: 0.4, copper: 0.06, manganese: 0.6 },
  { name: 'Araticum', category: 'Frutas', calories: 94, protein: 1.6, carbs: 23.6, fat: 0.6, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 15.8, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.11, vitaminB2: 0.11, vitaminB3: 0.9, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 30, iron: 0.6, magnesium: 0, potassium: 382, zinc: 0, sodium: 4, phosphorus: 32, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Bacaba', category: 'Frutas', calories: 250, protein: 2, carbs: 6.2, fat: 25, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Biribá', category: 'Frutas', calories: 73, protein: 1.3, carbs: 18.3, fat: 0.2, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 36.8, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.1, vitaminB2: 0.1, vitaminB3: 0.9, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 30, iron: 0.3, magnesium: 0, potassium: 250, zinc: 0, sodium: 4, phosphorus: 27, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Cajá', category: 'Frutas', calories: 46, protein: 1, carbs: 10.5, fat: 0.5, fiber: 1.7, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 299, vitaminC: 22.6, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.03, vitaminB2: 0.04, vitaminB3: 1.3, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 27, iron: 2.8, magnesium: 0, potassium: 162, zinc: 0, sodium: 3, phosphorus: 31, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Caqui', category: 'Frutas', calories: 70, protein: 0.6, carbs: 18.6, fat: 0.2, fiber: 3.6, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 1627, vitaminC: 7.5, vitaminD: 0, vitaminE: 0.7, vitaminK: 2.6, vitaminB1: 0.03, vitaminB2: 0.02, vitaminB3: 0.1, vitaminB6: 0.1, vitaminB12: 0, folicAcid: 8, calcium: 8, iron: 0.2, magnesium: 9, potassium: 161, zinc: 0.1, sodium: 1, phosphorus: 17, selenium: 0.6, copper: 0.11, manganese: 0.36 },
  { name: 'Carambola', category: 'Frutas', calories: 31, protein: 1, carbs: 6.7, fat: 0.3, fiber: 2.8, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 61, vitaminC: 34.4, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.01, vitaminB2: 0.02, vitaminB3: 0.4, vitaminB6: 0.02, vitaminB12: 0, folicAcid: 12, calcium: 3, iron: 0.1, magnesium: 10, potassium: 133, zinc: 0.1, sodium: 2, phosphorus: 12, selenium: 0.6, copper: 0.14, manganese: 0.04 },
  { name: 'Cereja', category: 'Frutas', calories: 63, protein: 1.1, carbs: 16, fat: 0.2, fiber: 2.1, saturatedFat: 0, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 64, vitaminC: 7, vitaminD: 0, vitaminE: 0.1, vitaminK: 2.1, vitaminB1: 0.03, vitaminB2: 0.03, vitaminB3: 0.2, vitaminB6: 0.05, vitaminB12: 0, folicAcid: 4, calcium: 13, iron: 0.4, magnesium: 11, potassium: 222, zinc: 0.1, sodium: 0, phosphorus: 21, selenium: 0, copper: 0.06, manganese: 0.07 },
  { name: 'Cidra', category: 'Frutas', calories: 25, protein: 0.5, carbs: 6.5, fat: 0.1, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 40, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Cupuaçu', category: 'Frutas', calories: 49, protein: 1.5, carbs: 10.4, fat: 1, fiber: 1.7, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 33, vitaminC: 24.5, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.04, vitaminB3: 0.6, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 22, iron: 0.7, magnesium: 0, potassium: 328, zinc: 0, sodium: 1, phosphorus: 26, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Figo', category: 'Frutas', calories: 74, protein: 0.8, carbs: 19.2, fat: 0.3, fiber: 2.9, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 142, vitaminC: 2, vitaminD: 0, vitaminE: 0.1, vitaminK: 4.7, vitaminB1: 0.06, vitaminB2: 0.05, vitaminB3: 0.4, vitaminB6: 0.11, vitaminB12: 0, folicAcid: 6, calcium: 35, iron: 0.4, magnesium: 17, potassium: 232, zinc: 0.2, sodium: 1, phosphorus: 14, selenium: 0.2, copper: 0.07, manganese: 0.13 },
  { name: 'Framboesa', category: 'Frutas', calories: 52, protein: 1.2, carbs: 11.9, fat: 0.7, fiber: 6.5, saturatedFat: 0, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.4, cholesterol: 0, omega3: 126, omega6: 249, vitaminA: 33, vitaminC: 26.2, vitaminD: 0, vitaminE: 0.9, vitaminK: 7.8, vitaminB1: 0.03, vitaminB2: 0.04, vitaminB3: 0.6, vitaminB6: 0.06, vitaminB12: 0, folicAcid: 21, calcium: 25, iron: 0.7, magnesium: 22, potassium: 151, zinc: 0.4, sodium: 1, phosphorus: 29, selenium: 0.2, copper: 0.09, manganese: 0.67 },
  { name: 'Groselha', category: 'Frutas', calories: 44, protein: 1.4, carbs: 10.2, fat: 0.6, fiber: 4.3, saturatedFat: 0, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.4, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 290, vitaminC: 27.7, vitaminD: 0, vitaminE: 0.4, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.03, vitaminB3: 0.3, vitaminB6: 0.08, vitaminB12: 0, folicAcid: 6, calcium: 33, iron: 1, magnesium: 13, potassium: 198, zinc: 0.2, sodium: 1, phosphorus: 27, selenium: 0.6, copper: 0.07, manganese: 0.14 },
  { name: 'Ingá', category: 'Frutas', calories: 64, protein: 1.4, carbs: 15.6, fat: 0.2, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Jaca', category: 'Frutas', calories: 95, protein: 1.7, carbs: 23.3, fat: 0.6, fiber: 1.5, saturatedFat: 0.2, monounsaturatedFat: 0.2, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 110, vitaminC: 13.7, vitaminD: 0, vitaminE: 0.3, vitaminK: 0, vitaminB1: 0.11, vitaminB2: 0.06, vitaminB3: 0.9, vitaminB6: 0.33, vitaminB12: 0, folicAcid: 24, calcium: 24, iron: 0.2, magnesium: 29, potassium: 448, zinc: 0.1, sodium: 2, phosphorus: 21, selenium: 0.6, copper: 0.19, manganese: 0.04 },
  { name: 'Jambo', category: 'Frutas', calories: 25, protein: 0.6, carbs: 5.7, fat: 0.3, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 17, vitaminC: 22.3, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.02, vitaminB2: 0.03, vitaminB3: 0.8, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 29, iron: 0.1, magnesium: 0, potassium: 123, zinc: 0, sodium: 0, phosphorus: 8, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Jenipapo', category: 'Frutas', calories: 78, protein: 2, carbs: 17.2, fat: 0.1, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 33.9, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.04, vitaminB3: 2.6, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 40, iron: 2.3, magnesium: 0, potassium: 260, zinc: 0, sodium: 0, phosphorus: 30, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Limão', category: 'Frutas', calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 22, vitaminC: 53, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.02, vitaminB3: 0.1, vitaminB6: 0.08, vitaminB12: 0, folicAcid: 11, calcium: 26, iron: 0.6, magnesium: 8, potassium: 138, zinc: 0.1, sodium: 2, phosphorus: 16, selenium: 0.4, copper: 0.04, manganese: 0.03 },
  { name: 'Mangaba', category: 'Frutas', calories: 43, protein: 0.5, carbs: 11.6, fat: 0.1, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 33.3, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.04, vitaminB3: 0.4, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 46, iron: 0.2, magnesium: 0, potassium: 78, zinc: 0, sodium: 0, phosphorus: 15, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Melão', category: 'Frutas', calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, fiber: 0.9, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 3382, vitaminC: 36.7, vitaminD: 0, vitaminE: 0.1, vitaminK: 2.5, vitaminB1: 0.04, vitaminB2: 0.02, vitaminB3: 0.7, vitaminB6: 0.07, vitaminB12: 0, folicAcid: 21, calcium: 9, iron: 0.2, magnesium: 12, potassium: 267, zinc: 0.2, sodium: 16, phosphorus: 15, selenium: 0.4, copper: 0.04, manganese: 0.04 },
  { name: 'Pequi', category: 'Frutas', calories: 205, protein: 2.5, carbs: 12.4, fat: 17.5, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 6000, vitaminC: 12, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.21, vitaminB3: 0.4, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 43, iron: 0.6, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Pêssego', category: 'Frutas', calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3, fiber: 1.5, saturatedFat: 0, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 326, vitaminC: 6.6, vitaminD: 0, vitaminE: 0.7, vitaminK: 2.6, vitaminB1: 0.02, vitaminB2: 0.03, vitaminB3: 0.8, vitaminB6: 0.03, vitaminB12: 0, folicAcid: 4, calcium: 6, iron: 0.3, magnesium: 9, potassium: 190, zinc: 0.2, sodium: 0, phosphorus: 20, selenium: 0.1, copper: 0.07, manganese: 0.06 },
  { name: 'Pitanga', category: 'Frutas', calories: 41, protein: 0.8, carbs: 10.2, fat: 0.4, fiber: 3.2, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 1500, vitaminC: 14, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.03, vitaminB2: 0.06, vitaminB3: 0.3, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 9, iron: 0.2, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 11, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Pitaya', category: 'Frutas', calories: 60, protein: 1.2, carbs: 13, fat: 0.4, fiber: 3, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 9, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.05, vitaminB3: 0.4, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 8, iron: 1.9, magnesium: 40, potassium: 0, zinc: 0, sodium: 0, phosphorus: 36, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Pupunha', category: 'Frutas', calories: 196, protein: 3.3, carbs: 35.7, fat: 5.2, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 3000, vitaminC: 20, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Romã', category: 'Frutas', calories: 83, protein: 1.7, carbs: 18.7, fat: 1.2, fiber: 4, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 10.2, vitaminD: 0, vitaminE: 0.6, vitaminK: 16.4, vitaminB1: 0.07, vitaminB2: 0.05, vitaminB3: 0.3, vitaminB6: 0.08, vitaminB12: 0, folicAcid: 38, calcium: 10, iron: 0.3, magnesium: 12, potassium: 236, zinc: 0.4, sodium: 3, phosphorus: 36, selenium: 0.5, copper: 0.16, manganese: 0.12 },
  { name: 'Siriguela', category: 'Frutas', calories: 76, protein: 0.9, carbs: 18.8, fat: 0.7, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 46.4, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.1, vitaminB2: 0.04, vitaminB3: 0.3, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 28, iron: 2.1, magnesium: 0, potassium: 228, zinc: 0, sodium: 0, phosphorus: 37, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Tâmara', category: 'Frutas', calories: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 6.7, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 149, vitaminC: 0, vitaminD: 0, vitaminE: 0.1, vitaminK: 2.7, vitaminB1: 0.05, vitaminB2: 0.06, vitaminB3: 1.6, vitaminB6: 0.25, vitaminB12: 0, folicAcid: 15, calcium: 64, iron: 0.9, magnesium: 54, potassium: 696, zinc: 0.4, sodium: 1, phosphorus: 62, selenium: 0, copper: 0.36, manganese: 0.3 },
  { name: 'Tamarindo', category: 'Frutas', calories: 239, protein: 2.8, carbs: 62.5, fat: 0.6, fiber: 5.1, saturatedFat: 0.3, monounsaturatedFat: 0.2, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 30, vitaminC: 3.5, vitaminD: 0, vitaminE: 0.1, vitaminK: 2.8, vitaminB1: 0.43, vitaminB2: 0.15, vitaminB3: 1.9, vitaminB6: 0.07, vitaminB12: 0, folicAcid: 14, calcium: 74, iron: 2.8, magnesium: 92, potassium: 628, zinc: 0.1, sodium: 28, phosphorus: 113, selenium: 1.3, copper: 0.09, manganese: 0.06 },
  { name: 'Tangerina', category: 'Frutas', calories: 53, protein: 0.8, carbs: 13.3, fat: 0.3, fiber: 1.8, saturatedFat: 0, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 681, vitaminC: 26.7, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.06, vitaminB2: 0.04, vitaminB3: 0.4, vitaminB6: 0.08, vitaminB12: 0, folicAcid: 16, calcium: 37, iron: 0.2, magnesium: 12, potassium: 166, zinc: 0.1, sodium: 2, phosphorus: 20, selenium: 0.1, copper: 0.04, manganese: 0.04 },
  { name: 'Tucumã', category: 'Frutas', calories: 262, protein: 5.2, carbs: 13.1, fat: 22.3, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 7000, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },

  // Proteínas
  { name: 'Peito de frango', category: 'Proteínas', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, saturatedFat: 1, monounsaturatedFat: 1.2, polyunsaturatedFat: 0.8, cholesterol: 85, omega3: 60, omega6: 660, vitaminA: 21, vitaminC: 1.6, vitaminD: 0.1, vitaminE: 0.3, vitaminK: 0.3, vitaminB1: 0.07, vitaminB2: 0.12, vitaminB3: 13.7, vitaminB6: 0.6, vitaminB12: 0.3, folicAcid: 4, calcium: 15, iron: 1, magnesium: 29, potassium: 256, zinc: 1, sodium: 74, phosphorus: 228, selenium: 27.6, copper: 0.05, manganese: 0.02 },
  { name: 'Ovo', category: 'Proteínas', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, saturatedFat: 3.3, monounsaturatedFat: 4.1, polyunsaturatedFat: 1.9, cholesterol: 373, omega3: 74, omega6: 1188, vitaminA: 540, vitaminC: 0, vitaminD: 2, vitaminE: 1.1, vitaminK: 0.3, vitaminB1: 0.04, vitaminB2: 0.46, vitaminB3: 0.1, vitaminB6: 0.17, vitaminB12: 0.9, folicAcid: 47, calcium: 56, iron: 1.8, magnesium: 12, potassium: 138, zinc: 1.3, sodium: 142, phosphorus: 198, selenium: 30.7, copper: 0.07, manganese: 0.03 },
  { name: 'Salmão', category: 'Proteínas', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, saturatedFat: 3.1, monounsaturatedFat: 3.8, polyunsaturatedFat: 3.9, cholesterol: 55, omega3: 2260, omega6: 341, vitaminA: 149, vitaminC: 3.9, vitaminD: 11, vitaminE: 1.2, vitaminK: 0.1, vitaminB1: 0.23, vitaminB2: 0.38, vitaminB3: 8.5, vitaminB6: 0.8, vitaminB12: 3.2, folicAcid: 25, calcium: 12, iron: 0.8, magnesium: 29, potassium: 363, zinc: 0.6, sodium: 59, phosphorus: 252, selenium: 36.5, copper: 0.25, manganese: 0.02 },
  { name: 'Feijão Preto', category: 'Proteínas', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.24, vitaminB2: 0.06, vitaminB3: 0.5, vitaminB6: 0.07, vitaminB12: 0, folicAcid: 149, calcium: 27, iron: 2.1, magnesium: 70, potassium: 355, zinc: 1.2, sodium: 2, phosphorus: 140, selenium: 2.2, copper: 0.24, manganese: 0.44 },
  { name: 'Grão-de-Bico', category: 'Proteínas', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, saturatedFat: 0.3, monounsaturatedFat: 0.6, polyunsaturatedFat: 1.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 27, vitaminC: 1.3, vitaminD: 0, vitaminE: 0.4, vitaminK: 4, vitaminB1: 0.12, vitaminB2: 0.06, vitaminB3: 0.5, vitaminB6: 0.14, vitaminB12: 0, folicAcid: 172, calcium: 49, iron: 2.9, magnesium: 48, potassium: 291, zinc: 1.5, sodium: 7, phosphorus: 168, selenium: 3.7, copper: 0.35, manganese: 1.03 },
  { name: 'Tofu', category: 'Proteínas', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, saturatedFat: 0.7, monounsaturatedFat: 1.1, polyunsaturatedFat: 2.7, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 85, vitaminC: 0.1, vitaminD: 0, vitaminE: 0.01, vitaminK: 2.4, vitaminB1: 0.08, vitaminB2: 0.05, vitaminB3: 0.2, vitaminB6: 0.05, vitaminB12: 0, folicAcid: 15, calcium: 350, iron: 5.4, magnesium: 30, potassium: 121, zinc: 0.8, sodium: 7, phosphorus: 97, selenium: 8.9, copper: 0.19, manganese: 0.61 },
  { name: 'Tilápia', category: 'Proteínas', calories: 96, protein: 20.1, carbs: 0, fat: 1.7, fiber: 0, saturatedFat: 0.6, monounsaturatedFat: 0.5, polyunsaturatedFat: 0.4, cholesterol: 50, omega3: 150, omega6: 100, vitaminA: 0, vitaminC: 0, vitaminD: 3.1, vitaminE: 0.4, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.07, vitaminB3: 3.9, vitaminB6: 0.16, vitaminB12: 1.6, folicAcid: 10, calcium: 10, iron: 0.6, magnesium: 27, potassium: 302, zinc: 0.3, sodium: 52, phosphorus: 170, selenium: 41.8, copper: 0.07, manganese: 0.02 },
  { name: 'Camarão', category: 'Proteínas', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 189, omega3: 315, omega6: 28, vitaminA: 180, vitaminC: 0, vitaminD: 0, vitaminE: 1.2, vitaminK: 0, vitaminB1: 0.03, vitaminB2: 0.03, vitaminB3: 2.6, vitaminB6: 0.16, vitaminB12: 1.1, folicAcid: 18, calcium: 70, iron: 2.4, magnesium: 34, potassium: 259, zinc: 1.6, sodium: 566, phosphorus: 244, selenium: 38, copper: 0.26, manganese: 0.03 },
  { name: 'Sardinha', category: 'Proteínas', calories: 208, protein: 24.6, carbs: 0, fat: 11.5, fiber: 0, saturatedFat: 1.5, monounsaturatedFat: 3.9, polyunsaturatedFat: 5.1, cholesterol: 142, omega3: 1480, omega6: 170, vitaminA: 108, vitaminC: 0, vitaminD: 4.8, vitaminE: 2, vitaminK: 2.6, vitaminB1: 0.08, vitaminB2: 0.23, vitaminB3: 5.2, vitaminB6: 0.17, vitaminB12: 8.9, folicAcid: 10, calcium: 382, iron: 2.9, magnesium: 39, potassium: 397, zinc: 1.3, sodium: 307, phosphorus: 490, selenium: 52.7, copper: 0.19, manganese: 0.11 },
  { name: 'Carne de porco', category: 'Proteínas', calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0, saturatedFat: 5, monounsaturatedFat: 6.2, polyunsaturatedFat: 1.2, cholesterol: 80, omega3: 57, omega6: 1140, vitaminA: 2, vitaminC: 0.7, vitaminD: 0.5, vitaminE: 0.3, vitaminK: 0, vitaminB1: 0.64, vitaminB2: 0.23, vitaminB3: 4.4, vitaminB6: 0.4, vitaminB12: 0.7, folicAcid: 5, calcium: 19, iron: 0.9, magnesium: 28, potassium: 423, zinc: 2.4, sodium: 62, phosphorus: 246, selenium: 38.1, copper: 0.08, manganese: 0.01 },
  { name: 'Filé mignon bovino', category: 'Proteínas', calories: 179, protein: 26, carbs: 0, fat: 8, fiber: 0, saturatedFat: 3.1, monounsaturatedFat: 3.4, polyunsaturatedFat: 0.3, cholesterol: 71, omega3: 31, omega6: 240, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.5, vitaminB1: 0.09, vitaminB2: 0.18, vitaminB3: 6.4, vitaminB6: 0.6, vitaminB12: 2.6, folicAcid: 8, calcium: 18, iron: 2.6, magnesium: 23, potassium: 318, zinc: 4.5, sodium: 55, phosphorus: 217, selenium: 26.5, copper: 0.09, manganese: 0.01 },
  { name: 'Alcatra bovina', category: 'Proteínas', calories: 183, protein: 27, carbs: 0, fat: 7.5, fiber: 0, saturatedFat: 3, monounsaturatedFat: 3.2, polyunsaturatedFat: 0.3, cholesterol: 70, omega3: 30, omega6: 250, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.4, vitaminB1: 0.08, vitaminB2: 0.17, vitaminB3: 6.2, vitaminB6: 0.58, vitaminB12: 2.5, folicAcid: 7, calcium: 17, iron: 2.5, magnesium: 22, potassium: 315, zinc: 4.3, sodium: 54, phosphorus: 215, selenium: 26, copper: 0.08, manganese: 0.01 },
  { name: 'Contrafilé bovino', category: 'Proteínas', calories: 217, protein: 26, carbs: 0, fat: 12, fiber: 0, saturatedFat: 5, monounsaturatedFat: 5.2, polyunsaturatedFat: 0.5, cholesterol: 75, omega3: 35, omega6: 300, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.5, vitaminB1: 0.09, vitaminB2: 0.18, vitaminB3: 6.5, vitaminB6: 0.6, vitaminB12: 2.7, folicAcid: 8, calcium: 19, iron: 2.7, magnesium: 24, potassium: 320, zinc: 4.6, sodium: 56, phosphorus: 220, selenium: 27, copper: 0.09, manganese: 0.01 },
  { name: 'Picanha bovina', category: 'Proteínas', calories: 234, protein: 25, carbs: 0, fat: 15, fiber: 0, saturatedFat: 6.2, monounsaturatedFat: 6.5, polyunsaturatedFat: 0.6, cholesterol: 78, omega3: 40, omega6: 350, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.6, vitaminB1: 0.09, vitaminB2: 0.19, vitaminB3: 6.6, vitaminB6: 0.61, vitaminB12: 2.8, folicAcid: 8, calcium: 20, iron: 2.8, magnesium: 25, potassium: 325, zinc: 4.7, sodium: 57, phosphorus: 222, selenium: 27.5, copper: 0.09, manganese: 0.01 },
  { name: 'Coxão mole bovino', category: 'Proteínas', calories: 176, protein: 27, carbs: 0, fat: 7, fiber: 0, saturatedFat: 2.8, monounsaturatedFat: 3, polyunsaturatedFat: 0.3, cholesterol: 69, omega3: 29, omega6: 230, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.4, vitaminB1: 0.08, vitaminB2: 0.17, vitaminB3: 6.1, vitaminB6: 0.57, vitaminB12: 2.4, folicAcid: 7, calcium: 16, iron: 2.4, magnesium: 21, potassium: 310, zinc: 4.2, sodium: 53, phosphorus: 212, selenium: 25.5, copper: 0.08, manganese: 0.01 },
  { name: 'Coxão duro bovino', category: 'Proteínas', calories: 171, protein: 27.5, carbs: 0, fat: 6, fiber: 0, saturatedFat: 2.4, monounsaturatedFat: 2.6, polyunsaturatedFat: 0.2, cholesterol: 68, omega3: 28, omega6: 220, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.3, vitaminB1: 0.08, vitaminB2: 0.16, vitaminB3: 6, vitaminB6: 0.56, vitaminB12: 2.3, folicAcid: 7, calcium: 15, iron: 2.3, magnesium: 20, potassium: 305, zinc: 4.1, sodium: 52, phosphorus: 210, selenium: 25, copper: 0.07, manganese: 0.01 },
  { name: 'Maminha bovina', category: 'Proteínas', calories: 210, protein: 26, carbs: 0, fat: 11, fiber: 0, saturatedFat: 4.5, monounsaturatedFat: 4.8, polyunsaturatedFat: 0.4, cholesterol: 74, omega3: 33, omega6: 280, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.5, vitaminB1: 0.09, vitaminB2: 0.18, vitaminB3: 6.4, vitaminB6: 0.59, vitaminB12: 2.6, folicAcid: 8, calcium: 18, iron: 2.6, magnesium: 23, potassium: 318, zinc: 4.5, sodium: 55, phosphorus: 218, selenium: 26.5, copper: 0.09, manganese: 0.01 },
  { name: 'Patinho bovino', category: 'Proteínas', calories: 169, protein: 28, carbs: 0, fat: 5.5, fiber: 0, saturatedFat: 2.2, monounsaturatedFat: 2.4, polyunsaturatedFat: 0.2, cholesterol: 67, omega3: 27, omega6: 210, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.3, vitaminB1: 0.08, vitaminB2: 0.16, vitaminB3: 5.9, vitaminB6: 0.55, vitaminB12: 2.2, folicAcid: 7, calcium: 14, iron: 2.2, magnesium: 19, potassium: 300, zinc: 4, sodium: 51, phosphorus: 208, selenium: 24.5, copper: 0.07, manganese: 0.01 },
  { name: 'Acém bovino', category: 'Proteínas', calories: 198, protein: 26, carbs: 0, fat: 10, fiber: 0, saturatedFat: 4, monounsaturatedFat: 4.3, polyunsaturatedFat: 0.4, cholesterol: 72, omega3: 32, omega6: 270, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.4, vitaminB1: 0.08, vitaminB2: 0.17, vitaminB3: 6.3, vitaminB6: 0.58, vitaminB12: 2.5, folicAcid: 7, calcium: 17, iron: 2.5, magnesium: 22, potassium: 313, zinc: 4.4, sodium: 54, phosphorus: 214, selenium: 26, copper: 0.08, manganese: 0.01 },
  { name: 'Cupim bovino', category: 'Proteínas', calories: 271, protein: 23, carbs: 0, fat: 20, fiber: 0, saturatedFat: 8.3, monounsaturatedFat: 8.7, polyunsaturatedFat: 0.8, cholesterol: 82, omega3: 45, omega6: 400, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.3, vitaminK: 1.7, vitaminB1: 0.1, vitaminB2: 0.2, vitaminB3: 6.8, vitaminB6: 0.63, vitaminB12: 2.9, folicAcid: 9, calcium: 22, iron: 3, magnesium: 27, potassium: 335, zinc: 5, sodium: 59, phosphorus: 228, selenium: 28, copper: 0.1, manganese: 0.01 },
  { name: 'Coração bovino', category: 'Proteínas', calories: 112, protein: 17.7, carbs: 0.1, fat: 3.9, fiber: 0, saturatedFat: 1.1, monounsaturatedFat: 0.9, polyunsaturatedFat: 0.9, cholesterol: 124, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 2, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.38, vitaminB2: 0.91, vitaminB3: 7.5, vitaminB6: 0.28, vitaminB12: 8.6, folicAcid: 3, calcium: 7, iron: 4.3, magnesium: 21, potassium: 287, zinc: 1.7, sodium: 98, phosphorus: 212, selenium: 21.8, copper: 0.4, manganese: 0.04 },
  { name: 'Fígado bovino', category: 'Proteínas', calories: 135, protein: 20.4, carbs: 3.9, fat: 3.6, fiber: 0, saturatedFat: 1.2, monounsaturatedFat: 0.5, polyunsaturatedFat: 0.5, cholesterol: 275, omega3: 113, omega6: 254, vitaminA: 16899, vitaminC: 1.3, vitaminD: 1.2, vitaminE: 0.4, vitaminK: 3.1, vitaminB1: 0.18, vitaminB2: 2.76, vitaminB3: 13.2, vitaminB6: 1.08, vitaminB12: 59.3, folicAcid: 290, calcium: 5, iron: 4.9, magnesium: 18, potassium: 313, zinc: 4, sodium: 69, phosphorus: 387, selenium: 39.7, copper: 9.76, manganese: 0.31 },
  { name: 'Língua bovina', category: 'Proteínas', calories: 224, protein: 16, carbs: 3.7, fat: 16, fiber: 0, saturatedFat: 6.9, monounsaturatedFat: 7.6, polyunsaturatedFat: 0.6, cholesterol: 87, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 3.2, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.06, vitaminB2: 0.28, vitaminB3: 3.7, vitaminB6: 0.13, vitaminB12: 3.2, folicAcid: 6, calcium: 6, iron: 2.2, magnesium: 13, potassium: 164, zinc: 3.5, sodium: 55, phosphorus: 134, selenium: 11.8, copper: 0.11, manganese: 0.02 },
  { name: 'Rabo bovino', category: 'Proteínas', calories: 337, protein: 18, carbs: 0, fat: 30, fiber: 0, saturatedFat: 12.5, monounsaturatedFat: 13.2, polyunsaturatedFat: 1.2, cholesterol: 95, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.3, vitaminK: 0, vitaminB1: 0.05, vitaminB2: 0.15, vitaminB3: 3.2, vitaminB6: 0.2, vitaminB12: 2, folicAcid: 5, calcium: 25, iron: 2, magnesium: 15, potassium: 200, zinc: 3, sodium: 60, phosphorus: 150, selenium: 15, copper: 0.08, manganese: 0.01 },
  { name: 'Costela bovina', category: 'Proteínas', calories: 289, protein: 24, carbs: 0, fat: 21, fiber: 0, saturatedFat: 8.7, monounsaturatedFat: 9.2, polyunsaturatedFat: 0.8, cholesterol: 85, omega3: 43, omega6: 420, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.3, vitaminK: 1.8, vitaminB1: 0.1, vitaminB2: 0.21, vitaminB3: 7, vitaminB6: 0.65, vitaminB12: 3, folicAcid: 9, calcium: 23, iron: 3.1, magnesium: 28, potassium: 340, zinc: 5.2, sodium: 60, phosphorus: 230, selenium: 29, copper: 0.1, manganese: 0.01 },
  { name: 'Lombo suíno', category: 'Proteínas', calories: 143, protein: 27, carbs: 0, fat: 3.5, fiber: 0, saturatedFat: 1.2, monounsaturatedFat: 1.5, polyunsaturatedFat: 0.4, cholesterol: 69, omega3: 40, omega6: 320, vitaminA: 2, vitaminC: 0.5, vitaminD: 0.4, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.96, vitaminB2: 0.28, vitaminB3: 5.4, vitaminB6: 0.5, vitaminB12: 0.6, folicAcid: 4, calcium: 16, iron: 0.8, magnesium: 26, potassium: 410, zinc: 2.2, sodium: 58, phosphorus: 240, selenium: 37, copper: 0.07, manganese: 0.01 },
  { name: 'Pernil suíno', category: 'Proteínas', calories: 225, protein: 26, carbs: 0, fat: 13, fiber: 0, saturatedFat: 4.6, monounsaturatedFat: 5.8, polyunsaturatedFat: 1.1, cholesterol: 78, omega3: 55, omega6: 1100, vitaminA: 2, vitaminC: 0.6, vitaminD: 0.5, vitaminE: 0.3, vitaminK: 0, vitaminB1: 0.72, vitaminB2: 0.25, vitaminB3: 4.8, vitaminB6: 0.42, vitaminB12: 0.68, folicAcid: 5, calcium: 18, iron: 0.9, magnesium: 27, potassium: 415, zinc: 2.3, sodium: 60, phosphorus: 242, selenium: 37.5, copper: 0.08, manganese: 0.01 },
  { name: 'Costelinha suína', category: 'Proteínas', calories: 361, protein: 20, carbs: 0, fat: 30, fiber: 0, saturatedFat: 11, monounsaturatedFat: 13.5, polyunsaturatedFat: 2.8, cholesterol: 90, omega3: 70, omega6: 2500, vitaminA: 3, vitaminC: 0.8, vitaminD: 0.6, vitaminE: 0.4, vitaminK: 0, vitaminB1: 0.45, vitaminB2: 0.2, vitaminB3: 3.8, vitaminB6: 0.32, vitaminB12: 0.55, folicAcid: 4, calcium: 22, iron: 1.1, magnesium: 22, potassium: 280, zinc: 2, sodium: 65, phosphorus: 200, selenium: 32, copper: 0.07, manganese: 0.01 },
  { name: 'Bacon', category: 'Proteínas', calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0, saturatedFat: 14, monounsaturatedFat: 18.8, polyunsaturatedFat: 4.6, cholesterol: 110, omega3: 200, omega6: 4000, vitaminA: 0, vitaminC: 0, vitaminD: 0.8, vitaminE: 0.1, vitaminK: 0, vitaminB1: 0.64, vitaminB2: 0.14, vitaminB3: 11.1, vitaminB6: 0.23, vitaminB12: 0.7, folicAcid: 1, calcium: 11, iron: 1.4, magnesium: 29, potassium: 565, zinc: 2.9, sodium: 1717, phosphorus: 533, selenium: 39.3, copper: 0.12, manganese: 0.02 },
  { name: 'Coração de frango', category: 'Proteínas', calories: 153, protein: 15.6, carbs: 0.7, fat: 9.3, fiber: 0, saturatedFat: 2.7, monounsaturatedFat: 2.5, polyunsaturatedFat: 2.3, cholesterol: 136, omega3: 0, omega6: 0, vitaminA: 41, vitaminC: 7.3, vitaminD: 0, vitaminE: 0.5, vitaminK: 0, vitaminB1: 0.24, vitaminB2: 0.92, vitaminB3: 4.3, vitaminB6: 0.29, vitaminB12: 6.6, folicAcid: 63, calcium: 12, iron: 5.9, magnesium: 17, potassium: 176, zinc: 2.1, sodium: 54, phosphorus: 153, selenium: 26.5, copper: 0.29, manganese: 0.04 },
  { name: 'Fígado de frango', category: 'Proteínas', calories: 119, protein: 16.9, carbs: 0.7, fat: 4.8, fiber: 0, saturatedFat: 1.6, monounsaturatedFat: 1.1, polyunsaturatedFat: 0.9, cholesterol: 345, omega3: 0, omega6: 0, vitaminA: 11078, vitaminC: 17.9, vitaminD: 0.4, vitaminE: 0.7, vitaminK: 0, vitaminB1: 0.15, vitaminB2: 1.78, vitaminB3: 9.4, vitaminB6: 0.64, vitaminB12: 16.6, folicAcid: 578, calcium: 8, iron: 8.5, magnesium: 19, potassium: 230, zinc: 2.7, sodium: 71, phosphorus: 297, selenium: 54.6, copper: 0.35, manganese: 0.26 },
  { name: 'Moela de frango', category: 'Proteínas', calories: 94, protein: 17.7, carbs: 0, fat: 2.1, fiber: 0, saturatedFat: 0.6, monounsaturatedFat: 0.5, polyunsaturatedFat: 0.5, cholesterol: 223, omega3: 0, omega6: 0, vitaminA: 17, vitaminC: 3.2, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.15, vitaminB3: 3.9, vitaminB6: 0.13, vitaminB12: 1.5, folicAcid: 4, calcium: 12, iron: 3.3, magnesium: 15, potassium: 158, zinc: 2.7, sodium: 77, phosphorus: 148, selenium: 26.4, copper: 0.12, manganese: 0.03 },
  { name: 'Coxa de frango', category: 'Proteínas', calories: 209, protein: 18, carbs: 0, fat: 15, fiber: 0, saturatedFat: 4.3, monounsaturatedFat: 6.2, polyunsaturatedFat: 3.2, cholesterol: 93, omega3: 90, omega6: 2700, vitaminA: 56, vitaminC: 0, vitaminD: 0.2, vitaminE: 0.3, vitaminK: 2.5, vitaminB1: 0.09, vitaminB2: 0.18, vitaminB3: 5.7, vitaminB6: 0.3, vitaminB12: 0.4, folicAcid: 6, calcium: 11, iron: 1.1, magnesium: 20, potassium: 222, zinc: 1.8, sodium: 84, phosphorus: 152, selenium: 18.5, copper: 0.07, manganese: 0.02 },
  { name: 'Rins bovino', category: 'Proteínas', calories: 99, protein: 17, carbs: 0, fat: 3, fiber: 0, saturatedFat: 0.9, monounsaturatedFat: 0.7, polyunsaturatedFat: 0.5, cholesterol: 387, omega3: 0, omega6: 0, vitaminA: 237, vitaminC: 11, vitaminD: 0, vitaminE: 0.2, vitaminK: 0, vitaminB1: 0.42, vitaminB2: 1.88, vitaminB3: 7.4, vitaminB6: 0.43, vitaminB12: 27.5, folicAcid: 77, calcium: 14, iron: 4.6, magnesium: 16, potassium: 262, zinc: 1.9, sodium: 182, phosphorus: 258, selenium: 141.2, copper: 0.42, manganese: 0.13 },
  { name: 'Carneiro', category: 'Proteínas', calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, saturatedFat: 8.8, monounsaturatedFat: 8.8, polyunsaturatedFat: 1.5, cholesterol: 97, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.1, vitaminK: 4.6, vitaminB1: 0.15, vitaminB2: 0.25, vitaminB3: 6.2, vitaminB6: 0.13, vitaminB12: 2.6, folicAcid: 18, calcium: 17, iron: 1.9, magnesium: 23, potassium: 310, zinc: 4.5, sodium: 72, phosphorus: 188, selenium: 26.4, copper: 0.11, manganese: 0.02 },
  { name: 'Chambão de vitela (ossobuco)', category: 'Proteínas', calories: 168, protein: 26, carbs: 0, fat: 6.5, fiber: 0, saturatedFat: 2.6, monounsaturatedFat: 2.8, polyunsaturatedFat: 0.3, cholesterol: 68, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.3, vitaminB1: 0.08, vitaminB2: 0.16, vitaminB3: 6, vitaminB6: 0.55, vitaminB12: 2.3, folicAcid: 7, calcium: 15, iron: 2.3, magnesium: 20, potassium: 305, zinc: 4.1, sodium: 52, phosphorus: 210, selenium: 25, copper: 0.07, manganese: 0.01 },
  { name: 'Ostras', category: 'Proteínas', calories: 68, protein: 7, carbs: 3.9, fat: 2.5, fiber: 0, saturatedFat: 0.6, monounsaturatedFat: 0.3, polyunsaturatedFat: 0.9, cholesterol: 50, omega3: 370, omega6: 40, vitaminA: 223, vitaminC: 8, vitaminD: 0.3, vitaminE: 0.9, vitaminK: 0.3, vitaminB1: 0.08, vitaminB2: 0.23, vitaminB3: 1.6, vitaminB6: 0.05, vitaminB12: 16, folicAcid: 9, calcium: 45, iron: 5.1, magnesium: 22, potassium: 168, zinc: 78.6, sodium: 211, phosphorus: 135, selenium: 63.7, copper: 4.45, manganese: 0.37 },
  { name: 'Vieiras', category: 'Proteínas', calories: 88, protein: 16.8, carbs: 2.4, fat: 0.8, fiber: 0, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.3, cholesterol: 24, omega3: 200, omega6: 20, vitaminA: 6, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.01, vitaminB2: 0.02, vitaminB3: 1.2, vitaminB6: 0.07, vitaminB12: 1.4, folicAcid: 16, calcium: 24, iron: 0.3, magnesium: 22, potassium: 205, zinc: 0.9, sodium: 392, phosphorus: 334, selenium: 12.8, copper: 0.02, manganese: 0.02 },
  { name: 'Mexilhões', category: 'Proteínas', calories: 86, protein: 11.9, carbs: 3.7, fat: 2.2, fiber: 0, saturatedFat: 0.4, monounsaturatedFat: 0.5, polyunsaturatedFat: 0.6, cholesterol: 28, omega3: 370, omega6: 40, vitaminA: 240, vitaminC: 8, vitaminD: 0, vitaminE: 0.6, vitaminK: 0.1, vitaminB1: 0.16, vitaminB2: 0.21, vitaminB3: 1.6, vitaminB6: 0.05, vitaminB12: 12, folicAcid: 42, calcium: 26, iron: 3.9, magnesium: 34, potassium: 268, zinc: 1.6, sodium: 369, phosphorus: 197, selenium: 44.8, copper: 0.09, manganese: 3.4 },
  { name: 'Lula', category: 'Proteínas', calories: 92, protein: 15.6, carbs: 3.1, fat: 1.4, fiber: 0, saturatedFat: 0.4, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.5, cholesterol: 233, omega3: 488, omega6: 9, vitaminA: 11, vitaminC: 4.7, vitaminD: 0, vitaminE: 1.2, vitaminK: 0, vitaminB1: 0.02, vitaminB2: 0.41, vitaminB3: 2.2, vitaminB6: 0.06, vitaminB12: 1.3, folicAcid: 5, calcium: 32, iron: 0.7, magnesium: 33, potassium: 246, zinc: 1.5, sodium: 44, phosphorus: 221, selenium: 44.8, copper: 1.89, manganese: 0.04 },
  { name: 'Polvo', category: 'Proteínas', calories: 82, protein: 14.9, carbs: 2.2, fat: 1, fiber: 0, saturatedFat: 0.2, monounsaturatedFat: 0.2, polyunsaturatedFat: 0.3, cholesterol: 48, omega3: 219, omega6: 24, vitaminA: 90, vitaminC: 5, vitaminD: 0, vitaminE: 1.2, vitaminK: 0, vitaminB1: 0.03, vitaminB2: 0.04, vitaminB3: 2.1, vitaminB6: 0.36, vitaminB12: 20, folicAcid: 16, calcium: 53, iron: 5.3, magnesium: 30, potassium: 350, zinc: 1.7, sodium: 230, phosphorus: 186, selenium: 44.8, copper: 0.44, manganese: 0.03 },
  { name: 'Carne de soja', category: 'Proteínas', calories: 336, protein: 52, carbs: 33.5, fat: 1.2, fiber: 18, saturatedFat: 0.2, monounsaturatedFat: 0.3, polyunsaturatedFat: 0.7, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.2, vitaminB2: 0.1, vitaminB3: 0.5, vitaminB6: 0.1, vitaminB12: 0, folicAcid: 0, calcium: 200, iron: 8, magnesium: 100, potassium: 800, zinc: 3, sodium: 10, phosphorus: 300, selenium: 0, copper: 0.5, manganese: 1 },
  { name: 'Atum', category: 'Proteínas', calories: 144, protein: 23.3, carbs: 0, fat: 4.9, fiber: 0, saturatedFat: 1.3, monounsaturatedFat: 1.6, polyunsaturatedFat: 1.6, cholesterol: 38, omega3: 1298, omega6: 28, vitaminA: 655, vitaminC: 0, vitaminD: 3.8, vitaminE: 0.4, vitaminK: 0, vitaminB1: 0.24, vitaminB2: 0.25, vitaminB3: 8.7, vitaminB6: 0.46, vitaminB12: 9.4, folicAcid: 2, calcium: 8, iron: 0.7, magnesium: 50, potassium: 252, zinc: 0.6, sodium: 39, phosphorus: 191, selenium: 36.5, copper: 0.09, manganese: 0.01 },

  // Laticínios
  { name: 'Leite Desnatado', category: 'Laticínios', calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 2, omega3: 0, omega6: 0, vitaminA: 10, vitaminC: 0, vitaminD: 0.1, vitaminE: 0, vitaminK: 0.1, vitaminB1: 0.04, vitaminB2: 0.18, vitaminB3: 0.1, vitaminB6: 0.04, vitaminB12: 0.5, folicAcid: 5, calcium: 125, iron: 0, magnesium: 11, potassium: 150, zinc: 0.4, sodium: 44, phosphorus: 101, selenium: 3.3, copper: 0.01, manganese: 0 },
  { name: 'Leite integral', category: 'Laticínios', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, saturatedFat: 1.9, monounsaturatedFat: 0.8, polyunsaturatedFat: 0.2, cholesterol: 10, omega3: 0, omega6: 0, vitaminA: 46, vitaminC: 0, vitaminD: 0.1, vitaminE: 0.1, vitaminK: 0.3, vitaminB1: 0.04, vitaminB2: 0.18, vitaminB3: 0.1, vitaminB6: 0.04, vitaminB12: 0.5, folicAcid: 5, calcium: 113, iron: 0, magnesium: 10, potassium: 143, zinc: 0.4, sodium: 43, phosphorus: 93, selenium: 3.3, copper: 0.01, manganese: 0 },
  { name: 'Queijo Cottage', category: 'Laticínios', calories: 98, protein: 11.1, carbs: 3.4, fat: 4.3, fiber: 0, saturatedFat: 1.7, monounsaturatedFat: 1, polyunsaturatedFat: 0.1, cholesterol: 15, omega3: 0, omega6: 0, vitaminA: 140, vitaminC: 0, vitaminD: 0, vitaminE: 0.1, vitaminK: 0, vitaminB1: 0.03, vitaminB2: 0.16, vitaminB3: 0.1, vitaminB6: 0.05, vitaminB12: 0.4, folicAcid: 12, calcium: 83, iron: 0.1, magnesium: 8, potassium: 104, zinc: 0.4, sodium: 364, phosphorus: 159, selenium: 9.7, copper: 0.03, manganese: 0 },
  { name: 'Ricota', category: 'Laticínios', calories: 174, protein: 11.3, carbs: 3.2, fat: 13, fiber: 0, saturatedFat: 8.3, monounsaturatedFat: 3.6, polyunsaturatedFat: 0.4, cholesterol: 51, omega3: 0, omega6: 0, vitaminA: 297, vitaminC: 0, vitaminD: 0.2, vitaminE: 0.1, vitaminK: 0.9, vitaminB1: 0.01, vitaminB2: 0.19, vitaminB3: 0.1, vitaminB6: 0.04, vitaminB12: 0.3, folicAcid: 12, calcium: 207, iron: 0.4, magnesium: 11, potassium: 105, zinc: 1.2, sodium: 84, phosphorus: 158, selenium: 14.5, copper: 0.02, manganese: 0.01 },
  { name: 'Queijo minas', category: 'Laticínios', calories: 264, protein: 17.4, carbs: 3.1, fat: 20.8, fiber: 0, saturatedFat: 13.3, monounsaturatedFat: 6, polyunsaturatedFat: 0.6, cholesterol: 68, omega3: 0, omega6: 0, vitaminA: 660, vitaminC: 0, vitaminD: 0.3, vitaminE: 0.2, vitaminK: 2.3, vitaminB1: 0.02, vitaminB2: 0.28, vitaminB3: 0.1, vitaminB6: 0.05, vitaminB12: 0.8, folicAcid: 10, calcium: 579, iron: 0.2, magnesium: 19, potassium: 81, zinc: 2.3, sodium: 621, phosphorus: 346, selenium: 14.5, copper: 0.02, manganese: 0.01 },
  { name: 'Queijo Mussarela', category: 'Laticínios', calories: 280, protein: 19.4, carbs: 3.1, fat: 21.6, fiber: 0, saturatedFat: 13.2, monounsaturatedFat: 6.6, polyunsaturatedFat: 0.8, cholesterol: 79, omega3: 0, omega6: 0, vitaminA: 676, vitaminC: 0, vitaminD: 0.4, vitaminE: 0.2, vitaminK: 2.3, vitaminB1: 0.03, vitaminB2: 0.32, vitaminB3: 0.1, vitaminB6: 0.04, vitaminB12: 1.2, folicAcid: 7, calcium: 505, iron: 0.2, magnesium: 20, potassium: 95, zinc: 2.5, sodium: 486, phosphorus: 354, selenium: 17, copper: 0.01, manganese: 0.01 },
  { name: 'Manteiga', category: 'Laticínios', calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1, fiber: 0, saturatedFat: 51.4, monounsaturatedFat: 21, polyunsaturatedFat: 3, cholesterol: 215, omega3: 315, omega6: 2170, vitaminA: 2499, vitaminC: 0, vitaminD: 1.5, vitaminE: 2.3, vitaminK: 7, vitaminB1: 0, vitaminB2: 0.03, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0.2, folicAcid: 3, calcium: 24, iron: 0, magnesium: 2, potassium: 24, zinc: 0.1, sodium: 11, phosphorus: 24, selenium: 1, copper: 0, manganese: 0 },
  { name: 'Iorgute natural', category: 'Laticínios', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, saturatedFat: 2.1, monounsaturatedFat: 0.9, polyunsaturatedFat: 0.1, cholesterol: 13, omega3: 0, omega6: 0, vitaminA: 99, vitaminC: 0.5, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.2, vitaminB1: 0.03, vitaminB2: 0.14, vitaminB3: 0.1, vitaminB6: 0.03, vitaminB12: 0.4, folicAcid: 7, calcium: 121, iron: 0.1, magnesium: 12, potassium: 155, zinc: 0.6, sodium: 46, phosphorus: 95, selenium: 2.2, copper: 0.01, manganese: 0 },
  { name: 'Iorgute grego', category: 'Laticínios', calories: 97, protein: 9, carbs: 3.9, fat: 5, fiber: 0, saturatedFat: 3.2, monounsaturatedFat: 1.3, polyunsaturatedFat: 0.1, cholesterol: 19, omega3: 0, omega6: 0, vitaminA: 146, vitaminC: 0.8, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.2, vitaminB1: 0.04, vitaminB2: 0.23, vitaminB3: 0.2, vitaminB6: 0.05, vitaminB12: 0.8, folicAcid: 7, calcium: 115, iron: 0, magnesium: 11, potassium: 141, zinc: 0.5, sodium: 36, phosphorus: 135, selenium: 9.7, copper: 0.01, manganese: 0 },

  // Oleaginosas e Sementes
  { name: 'Castanha de caju', category: 'Oleaginosas', calories: 553, protein: 18.2, carbs: 30.2, fat: 43.8, fiber: 3.3, saturatedFat: 7.8, monounsaturatedFat: 23.8, polyunsaturatedFat: 7.8, cholesterol: 0, omega3: 62, omega6: 7782, vitaminA: 0, vitaminC: 0.5, vitaminD: 0, vitaminE: 0.9, vitaminK: 34.1, vitaminB1: 0.42, vitaminB2: 0.06, vitaminB3: 1.1, vitaminB6: 0.42, vitaminB12: 0, folicAcid: 25, calcium: 37, iron: 6.7, magnesium: 292, potassium: 660, zinc: 5.8, sodium: 12, phosphorus: 593, selenium: 19.9, copper: 2.2, manganese: 1.7 },
  { name: 'Amêndoas', category: 'Oleaginosas', calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, saturatedFat: 3.8, monounsaturatedFat: 31.6, polyunsaturatedFat: 12.3, cholesterol: 0, omega3: 0, omega6: 12060, vitaminA: 2, vitaminC: 0, vitaminD: 0, vitaminE: 25.6, vitaminK: 0, vitaminB1: 0.21, vitaminB2: 1.14, vitaminB3: 3.6, vitaminB6: 0.14, vitaminB12: 0, folicAcid: 44, calcium: 269, iron: 3.7, magnesium: 270, potassium: 733, zinc: 3.1, sodium: 1, phosphorus: 481, selenium: 4.1, copper: 1, manganese: 2.2 },
  { name: 'Manteiga de Amendoim', category: 'Oleaginosas', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, saturatedFat: 10.3, monounsaturatedFat: 23.7, polyunsaturatedFat: 14.2, cholesterol: 0, omega3: 0, omega6: 14000, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 8.3, vitaminK: 0, vitaminB1: 0.1, vitaminB2: 0.1, vitaminB3: 13.4, vitaminB6: 0.4, vitaminB12: 0, folicAcid: 92, calcium: 43, iron: 1.9, magnesium: 168, potassium: 649, zinc: 2.5, sodium: 17, phosphorus: 335, selenium: 5.6, copper: 0.42, manganese: 1.5 },
  { name: 'Linhaça', category: 'Oleaginosas', calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2, fiber: 27.3, saturatedFat: 3.7, monounsaturatedFat: 7.5, polyunsaturatedFat: 28.7, cholesterol: 0, omega3: 22813, omega6: 5911, vitaminA: 0, vitaminC: 0.6, vitaminD: 0, vitaminE: 0.3, vitaminK: 4.3, vitaminB1: 1.64, vitaminB2: 0.16, vitaminB3: 3.1, vitaminB6: 0.47, vitaminB12: 0, folicAcid: 87, calcium: 255, iron: 5.7, magnesium: 392, potassium: 813, zinc: 4.3, sodium: 30, phosphorus: 642, selenium: 25.4, copper: 1.22, manganese: 2.5 },
  { name: 'Chia', category: 'Oleaginosas', calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, saturatedFat: 3.3, monounsaturatedFat: 2.3, polyunsaturatedFat: 23.7, cholesterol: 0, omega3: 17830, omega6: 5835, vitaminA: 54, vitaminC: 1.6, vitaminD: 0, vitaminE: 0.5, vitaminK: 0, vitaminB1: 0.62, vitaminB2: 0.17, vitaminB3: 8.8, vitaminB6: 0, vitaminB12: 0, folicAcid: 49, calcium: 631, iron: 7.7, magnesium: 335, potassium: 407, zinc: 4.6, sodium: 16, phosphorus: 860, selenium: 55.2, copper: 0.92, manganese: 2.7 },
  { name: 'Nozes', category: 'Oleaginosas', calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7, saturatedFat: 6.1, monounsaturatedFat: 8.9, polyunsaturatedFat: 47.2, cholesterol: 0, omega3: 9080, omega6: 38090, vitaminA: 20, vitaminC: 1.3, vitaminD: 0, vitaminE: 0.7, vitaminK: 2.7, vitaminB1: 0.34, vitaminB2: 0.15, vitaminB3: 1.1, vitaminB6: 0.54, vitaminB12: 0, folicAcid: 98, calcium: 98, iron: 2.9, magnesium: 158, potassium: 441, zinc: 3.1, sodium: 2, phosphorus: 346, selenium: 4.9, copper: 1.59, manganese: 3.4 },
  { name: 'Pistache', category: 'Oleaginosas', calories: 560, protein: 20.2, carbs: 27.2, fat: 45.3, fiber: 10.6, saturatedFat: 5.4, monounsaturatedFat: 23.3, polyunsaturatedFat: 13.5, cholesterol: 0, omega3: 263, omega6: 13200, vitaminA: 516, vitaminC: 5.6, vitaminD: 0, vitaminE: 2.3, vitaminK: 13.2, vitaminB1: 0.87, vitaminB2: 0.16, vitaminB3: 1.3, vitaminB6: 1.7, vitaminB12: 0, folicAcid: 51, calcium: 105, iron: 3.9, magnesium: 121, potassium: 1025, zinc: 2.2, sodium: 1, phosphorus: 490, selenium: 7, copper: 1.3, manganese: 1.2 },
  { name: 'Caju', category: 'Oleaginosas', calories: 553, protein: 18.2, carbs: 30.2, fat: 43.8, fiber: 3.3, saturatedFat: 7.8, monounsaturatedFat: 23.8, polyunsaturatedFat: 7.8, cholesterol: 0, omega3: 62, omega6: 7782, vitaminA: 0, vitaminC: 0.5, vitaminD: 0, vitaminE: 0.9, vitaminK: 34.1, vitaminB1: 0.42, vitaminB2: 0.06, vitaminB3: 1.1, vitaminB6: 0.42, vitaminB12: 0, folicAcid: 25, calcium: 37, iron: 6.7, magnesium: 292, potassium: 660, zinc: 5.8, sodium: 12, phosphorus: 593, selenium: 19.9, copper: 2.2, manganese: 1.7 },
  { name: 'Avelã', category: 'Oleaginosas', calories: 628, protein: 15, carbs: 16.7, fat: 60.8, fiber: 9.7, saturatedFat: 4.5, monounsaturatedFat: 45.7, polyunsaturatedFat: 7.9, cholesterol: 0, omega3: 0, omega6: 7800, vitaminA: 20, vitaminC: 6.3, vitaminD: 0, vitaminE: 15, vitaminK: 14.2, vitaminB1: 0.64, vitaminB2: 0.11, vitaminB3: 1.8, vitaminB6: 0.56, vitaminB12: 0, folicAcid: 113, calcium: 114, iron: 4.7, magnesium: 163, potassium: 680, zinc: 2.5, sodium: 0, phosphorus: 290, selenium: 2.4, copper: 1.73, manganese: 6.2 },
  { name: 'Macadâmia', category: 'Oleaginosas', calories: 718, protein: 7.9, carbs: 13.8, fat: 75.8, fiber: 8.6, saturatedFat: 12, monounsaturatedFat: 58.9, polyunsaturatedFat: 1.5, cholesterol: 0, omega3: 0, omega6: 1300, vitaminA: 0, vitaminC: 1.2, vitaminD: 0, vitaminE: 0.5, vitaminK: 0, vitaminB1: 1.2, vitaminB2: 0.16, vitaminB3: 2.5, vitaminB6: 0.28, vitaminB12: 0, folicAcid: 11, calcium: 85, iron: 3.7, magnesium: 130, potassium: 368, zinc: 1.3, sodium: 5, phosphorus: 188, selenium: 3.6, copper: 0.76, manganese: 4.1 },
  { name: 'Amendoim', category: 'Oleaginosas', calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2, fiber: 8.5, saturatedFat: 6.8, monounsaturatedFat: 24.4, polyunsaturatedFat: 15.6, cholesterol: 0, omega3: 0, omega6: 15560, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 8.3, vitaminK: 0, vitaminB1: 0.64, vitaminB2: 0.14, vitaminB3: 12.1, vitaminB6: 0.35, vitaminB12: 0, folicAcid: 240, calcium: 92, iron: 4.6, magnesium: 168, potassium: 705, zinc: 3.3, sodium: 18, phosphorus: 376, selenium: 7.2, copper: 1.14, manganese: 1.9 },

  // Carboidratos
  { name: 'Arroz integral', category: 'Carboidratos', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, saturatedFat: 0.2, monounsaturatedFat: 0.3, polyunsaturatedFat: 0.3, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.1, vitaminK: 0, vitaminB1: 0.18, vitaminB2: 0.02, vitaminB3: 2.6, vitaminB6: 0.15, vitaminB12: 0, folicAcid: 4, calcium: 10, iron: 0.4, magnesium: 43, potassium: 86, zinc: 0.6, sodium: 1, phosphorus: 83, selenium: 9.8, copper: 0.08, manganese: 0.97 },
  { name: 'Arroz parboilizado', category: 'Carboidratos', calories: 123, protein: 2.9, carbs: 25.6, fat: 1, fiber: 0.6, saturatedFat: 0.3, monounsaturatedFat: 0.3, polyunsaturatedFat: 0.3, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.26, vitaminB2: 0.02, vitaminB3: 2.3, vitaminB6: 0.15, vitaminB12: 0, folicAcid: 4, calcium: 10, iron: 1.4, magnesium: 19, potassium: 35, zinc: 0.6, sodium: 1, phosphorus: 68, selenium: 11.2, copper: 0.08, manganese: 0.47 },
  { name: 'Feijão carioca', category: 'Carboidratos', calories: 77, protein: 4.8, carbs: 13.6, fat: 0.5, fiber: 8.5, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.15, vitaminB2: 0.06, vitaminB3: 0.5, vitaminB6: 0.06, vitaminB12: 0, folicAcid: 149, calcium: 27, iron: 1.3, magnesium: 40, potassium: 256, zinc: 0.9, sodium: 2, phosphorus: 88, selenium: 2.2, copper: 0.24, manganese: 0.44 },
  { name: 'Pão Integral', category: 'Carboidratos', calories: 247, protein: 13.4, carbs: 41, fat: 3.4, fiber: 6.9, saturatedFat: 0.7, monounsaturatedFat: 0.8, polyunsaturatedFat: 1.4, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.5, vitaminK: 0, vitaminB1: 0.35, vitaminB2: 0.23, vitaminB3: 4.3, vitaminB6: 0.22, vitaminB12: 0, folicAcid: 40, calcium: 107, iron: 3.6, magnesium: 76, potassium: 248, zinc: 2, sodium: 527, phosphorus: 212, selenium: 39.7, copper: 0.26, manganese: 2.1 },
  { name: 'Batata Inglesa', category: 'Carboidratos', calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 2, vitaminC: 19.7, vitaminD: 0, vitaminE: 0, vitaminK: 2, vitaminB1: 0.08, vitaminB2: 0.03, vitaminB3: 1.1, vitaminB6: 0.3, vitaminB12: 0, folicAcid: 15, calcium: 12, iron: 0.8, magnesium: 23, potassium: 421, zinc: 0.3, sodium: 6, phosphorus: 57, selenium: 0.4, copper: 0.11, manganese: 0.15 },
  { name: 'Batata-doce', category: 'Carboidratos', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, fiber: 3, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 14187, vitaminC: 2.4, vitaminD: 0, vitaminE: 0.3, vitaminK: 1.8, vitaminB1: 0.08, vitaminB2: 0.06, vitaminB3: 0.6, vitaminB6: 0.21, vitaminB12: 0, folicAcid: 11, calcium: 30, iron: 0.6, magnesium: 25, potassium: 337, zinc: 0.3, sodium: 55, phosphorus: 47, selenium: 0.6, copper: 0.15, manganese: 0.26 },
  { name: 'Aveia', category: 'Carboidratos', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, saturatedFat: 1.2, monounsaturatedFat: 2.2, polyunsaturatedFat: 2.5, cholesterol: 0, omega3: 111, omega6: 2424, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.4, vitaminK: 2, vitaminB1: 0.76, vitaminB2: 0.14, vitaminB3: 1, vitaminB6: 0.12, vitaminB12: 0, folicAcid: 56, calcium: 54, iron: 4.7, magnesium: 177, potassium: 429, zinc: 4, sodium: 2, phosphorus: 523, selenium: 28.9, copper: 0.63, manganese: 4.9 },
  { name: 'Lentilha', category: 'Carboidratos', calories: 116, protein: 9, carbs: 20.1, fat: 0.4, fiber: 7.9, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 8, vitaminC: 1.5, vitaminD: 0, vitaminE: 0.1, vitaminK: 1.7, vitaminB1: 0.17, vitaminB2: 0.07, vitaminB3: 1.1, vitaminB6: 0.18, vitaminB12: 0, folicAcid: 181, calcium: 19, iron: 3.3, magnesium: 36, potassium: 369, zinc: 1.3, sodium: 2, phosphorus: 180, selenium: 2.8, copper: 0.25, manganese: 0.49 },
  { name: 'Mandioca', category: 'Carboidratos', calories: 160, protein: 1.4, carbs: 38.1, fat: 0.3, fiber: 1.8, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 13, vitaminC: 20.6, vitaminD: 0, vitaminE: 0.2, vitaminK: 1.9, vitaminB1: 0.09, vitaminB2: 0.05, vitaminB3: 0.9, vitaminB6: 0.09, vitaminB12: 0, folicAcid: 27, calcium: 16, iron: 0.3, magnesium: 21, potassium: 271, zinc: 0.3, sodium: 14, phosphorus: 27, selenium: 0.7, copper: 0.1, manganese: 0.38 },
  { name: 'Inhame', category: 'Carboidratos', calories: 118, protein: 1.5, carbs: 27.9, fat: 0.2, fiber: 4.1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 138, vitaminC: 17.1, vitaminD: 0, vitaminE: 0.4, vitaminK: 2.3, vitaminB1: 0.11, vitaminB2: 0.03, vitaminB3: 0.6, vitaminB6: 0.29, vitaminB12: 0, folicAcid: 23, calcium: 17, iron: 0.5, magnesium: 21, potassium: 816, zinc: 0.2, sodium: 9, phosphorus: 55, selenium: 0.7, copper: 0.18, manganese: 0.4 },

  // Vegetais
  { name: 'Cenoura', category: 'Vegetais', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 2, omega6: 115, vitaminA: 16706, vitaminC: 5.9, vitaminD: 0, vitaminE: 0.7, vitaminK: 13.2, vitaminB1: 0.07, vitaminB2: 0.06, vitaminB3: 1, vitaminB6: 0.14, vitaminB12: 0, folicAcid: 19, calcium: 33, iron: 0.3, magnesium: 12, potassium: 320, zinc: 0.2, sodium: 69, phosphorus: 35, selenium: 0.1, copper: 0.05, manganese: 0.14 },
  { name: 'Beterraba', category: 'Vegetais', calories: 43, protein: 1.6, carbs: 9.6, fat: 0.2, fiber: 2.8, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 33, vitaminC: 4.9, vitaminD: 0, vitaminE: 0, vitaminK: 0.2, vitaminB1: 0.03, vitaminB2: 0.04, vitaminB3: 0.3, vitaminB6: 0.07, vitaminB12: 0, folicAcid: 109, calcium: 16, iron: 0.8, magnesium: 23, potassium: 325, zinc: 0.4, sodium: 78, phosphorus: 40, selenium: 0.7, copper: 0.08, manganese: 0.33 },
  { name: 'Tomate', category: 'Vegetais', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 833, vitaminC: 13.7, vitaminD: 0, vitaminE: 0.5, vitaminK: 7.9, vitaminB1: 0.04, vitaminB2: 0.02, vitaminB3: 0.6, vitaminB6: 0.08, vitaminB12: 0, folicAcid: 15, calcium: 10, iron: 0.3, magnesium: 11, potassium: 237, zinc: 0.2, sodium: 5, phosphorus: 24, selenium: 0, copper: 0.06, manganese: 0.11 },
  { name: 'Couve', category: 'Vegetais', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, fiber: 2, saturatedFat: 0.1, monounsaturatedFat: 0.1, polyunsaturatedFat: 0.5, cholesterol: 0, omega3: 180, omega6: 138, vitaminA: 9990, vitaminC: 120, vitaminD: 0, vitaminE: 1.5, vitaminK: 704.8, vitaminB1: 0.11, vitaminB2: 0.13, vitaminB3: 1, vitaminB6: 0.27, vitaminB12: 0, folicAcid: 141, calcium: 150, iron: 1.5, magnesium: 47, potassium: 491, zinc: 0.6, sodium: 38, phosphorus: 92, selenium: 0.9, copper: 0.29, manganese: 0.78 },
  { name: 'Alface', category: 'Vegetais', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 7405, vitaminC: 9.2, vitaminD: 0, vitaminE: 0.2, vitaminK: 126.3, vitaminB1: 0.07, vitaminB2: 0.08, vitaminB3: 0.4, vitaminB6: 0.09, vitaminB12: 0, folicAcid: 38, calcium: 36, iron: 0.9, magnesium: 13, potassium: 194, zinc: 0.2, sodium: 28, phosphorus: 29, selenium: 0.6, copper: 0.03, manganese: 0.25 },
  { name: 'Pepino', category: 'Vegetais', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 105, vitaminC: 2.8, vitaminD: 0, vitaminE: 0, vitaminK: 16.4, vitaminB1: 0.03, vitaminB2: 0.03, vitaminB3: 0.1, vitaminB6: 0.04, vitaminB12: 0, folicAcid: 7, calcium: 16, iron: 0.3, magnesium: 13, potassium: 147, zinc: 0.2, sodium: 2, phosphorus: 24, selenium: 0.3, copper: 0.04, manganese: 0.08 },
  { name: 'Cebola', category: 'Vegetais', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 2, vitaminC: 7.4, vitaminD: 0, vitaminE: 0, vitaminK: 0.4, vitaminB1: 0.05, vitaminB2: 0.03, vitaminB3: 0.1, vitaminB6: 0.12, vitaminB12: 0, folicAcid: 19, calcium: 23, iron: 0.2, magnesium: 10, potassium: 146, zinc: 0.2, sodium: 4, phosphorus: 29, selenium: 0.5, copper: 0.04, manganese: 0.13 },
  { name: 'Abóbora', category: 'Vegetais', calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 8513, vitaminC: 9, vitaminD: 0, vitaminE: 1.1, vitaminK: 1.1, vitaminB1: 0.05, vitaminB2: 0.11, vitaminB3: 0.6, vitaminB6: 0.06, vitaminB12: 0, folicAcid: 16, calcium: 21, iron: 0.8, magnesium: 12, potassium: 340, zinc: 0.3, sodium: 1, phosphorus: 44, selenium: 0.3, copper: 0.13, manganese: 0.13 },
  { name: 'Berinjela', category: 'Vegetais', calories: 25, protein: 1, carbs: 5.9, fat: 0.2, fiber: 3, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 23, vitaminC: 2.2, vitaminD: 0, vitaminE: 0.3, vitaminK: 3.5, vitaminB1: 0.04, vitaminB2: 0.04, vitaminB3: 0.6, vitaminB6: 0.08, vitaminB12: 0, folicAcid: 22, calcium: 9, iron: 0.2, magnesium: 14, potassium: 229, zinc: 0.2, sodium: 2, phosphorus: 24, selenium: 0.3, copper: 0.08, manganese: 0.23 },
  { name: 'Couve-flor', category: 'Vegetais', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 48.2, vitaminD: 0, vitaminE: 0.1, vitaminK: 15.5, vitaminB1: 0.05, vitaminB2: 0.06, vitaminB3: 0.5, vitaminB6: 0.18, vitaminB12: 0, folicAcid: 57, calcium: 22, iron: 0.4, magnesium: 15, potassium: 299, zinc: 0.3, sodium: 30, phosphorus: 44, selenium: 0.6, copper: 0.04, manganese: 0.16 },
  { name: 'Alho poró', category: 'Vegetais', calories: 61, protein: 1.5, carbs: 14.2, fat: 0.3, fiber: 1.8, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 1667, vitaminC: 12, vitaminD: 0, vitaminE: 0.9, vitaminK: 47, vitaminB1: 0.06, vitaminB2: 0.03, vitaminB3: 0.4, vitaminB6: 0.23, vitaminB12: 0, folicAcid: 64, calcium: 59, iron: 2.1, magnesium: 28, potassium: 180, zinc: 0.1, sodium: 20, phosphorus: 35, selenium: 1, copper: 0.12, manganese: 0.48 },
  { name: 'Pimentão vermelho', category: 'Vegetais', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 3131, vitaminC: 127.7, vitaminD: 0, vitaminE: 1.6, vitaminK: 4.9, vitaminB1: 0.05, vitaminB2: 0.09, vitaminB3: 1, vitaminB6: 0.29, vitaminB12: 0, folicAcid: 46, calcium: 7, iron: 0.4, magnesium: 12, potassium: 211, zinc: 0.3, sodium: 4, phosphorus: 26, selenium: 0.1, copper: 0.02, manganese: 0.11 },
  { name: 'Abobrinha', category: 'Vegetais', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 200, vitaminC: 17.9, vitaminD: 0, vitaminE: 0.1, vitaminK: 4.3, vitaminB1: 0.05, vitaminB2: 0.09, vitaminB3: 0.5, vitaminB6: 0.16, vitaminB12: 0, folicAcid: 24, calcium: 16, iron: 0.4, magnesium: 18, potassium: 261, zinc: 0.3, sodium: 8, phosphorus: 38, selenium: 0.2, copper: 0.05, manganese: 0.18 },
  { name: 'Rúcula', category: 'Vegetais', calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.3, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 2373, vitaminC: 15, vitaminD: 0, vitaminE: 0.4, vitaminK: 108.6, vitaminB1: 0.04, vitaminB2: 0.09, vitaminB3: 0.3, vitaminB6: 0.07, vitaminB12: 0, folicAcid: 97, calcium: 160, iron: 1.5, magnesium: 47, potassium: 369, zinc: 0.5, sodium: 27, phosphorus: 52, selenium: 0.3, copper: 0.08, manganese: 0.32 },
  { name: 'Espinafre', category: 'Vegetais', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 138, omega6: 26, vitaminA: 9377, vitaminC: 28.1, vitaminD: 0, vitaminE: 2, vitaminK: 482.9, vitaminB1: 0.08, vitaminB2: 0.19, vitaminB3: 0.7, vitaminB6: 0.2, vitaminB12: 0, folicAcid: 194, calcium: 99, iron: 2.7, magnesium: 79, potassium: 558, zinc: 0.5, sodium: 79, phosphorus: 49, selenium: 1, copper: 0.13, manganese: 0.9 },
  { name: 'Vagem', category: 'Vegetais', calories: 31, protein: 1.8, carbs: 7, fat: 0.2, fiber: 2.7, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 690, vitaminC: 12.2, vitaminD: 0, vitaminE: 0.4, vitaminK: 43, vitaminB1: 0.08, vitaminB2: 0.1, vitaminB3: 0.7, vitaminB6: 0.14, vitaminB12: 0, folicAcid: 33, calcium: 37, iron: 1, magnesium: 25, potassium: 211, zinc: 0.2, sodium: 6, phosphorus: 38, selenium: 0.6, copper: 0.07, manganese: 0.21 },
  { name: 'Quiabo', category: 'Vegetais', calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, fiber: 3.2, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 716, vitaminC: 23, vitaminD: 0, vitaminE: 0.3, vitaminK: 31.3, vitaminB1: 0.2, vitaminB2: 0.06, vitaminB3: 1, vitaminB6: 0.22, vitaminB12: 0, folicAcid: 60, calcium: 82, iron: 0.6, magnesium: 57, potassium: 299, zinc: 0.6, sodium: 7, phosphorus: 61, selenium: 0.7, copper: 0.11, manganese: 0.99 },
  { name: 'Milho', category: 'Vegetais', calories: 86, protein: 3.3, carbs: 18.7, fat: 1.4, fiber: 2, saturatedFat: 0.2, monounsaturatedFat: 0.4, polyunsaturatedFat: 0.6, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 187, vitaminC: 6.8, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.3, vitaminB1: 0.16, vitaminB2: 0.06, vitaminB3: 1.8, vitaminB6: 0.05, vitaminB12: 0, folicAcid: 42, calcium: 2, iron: 0.5, magnesium: 37, potassium: 270, zinc: 0.5, sodium: 15, phosphorus: 89, selenium: 0.6, copper: 0.05, manganese: 0.16 },
  { name: 'Ervilha', category: 'Vegetais', calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4, fiber: 5.7, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 765, vitaminC: 40, vitaminD: 0, vitaminE: 0.1, vitaminK: 24.8, vitaminB1: 0.27, vitaminB2: 0.13, vitaminB3: 2.1, vitaminB6: 0.17, vitaminB12: 0, folicAcid: 65, calcium: 25, iron: 1.5, magnesium: 33, potassium: 244, zinc: 1.2, sodium: 5, phosphorus: 108, selenium: 1.8, copper: 0.18, manganese: 0.41 },
  { name: 'Cogumelo Champignon', category: 'Vegetais', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 2.1, vitaminD: 0.2, vitaminE: 0, vitaminK: 0, vitaminB1: 0.08, vitaminB2: 0.4, vitaminB3: 3.6, vitaminB6: 0.1, vitaminB12: 0, folicAcid: 17, calcium: 3, iron: 0.5, magnesium: 9, potassium: 318, zinc: 0.5, sodium: 5, phosphorus: 86, selenium: 9.3, copper: 0.32, manganese: 0.05 },
  { name: 'Chuchu', category: 'Vegetais', calories: 19, protein: 0.8, carbs: 4.5, fat: 0.1, fiber: 1.7, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 12, vitaminC: 7.7, vitaminD: 0, vitaminE: 0.1, vitaminK: 4.6, vitaminB1: 0.03, vitaminB2: 0.03, vitaminB3: 0.5, vitaminB6: 0.08, vitaminB12: 0, folicAcid: 93, calcium: 17, iron: 0.3, magnesium: 12, potassium: 125, zinc: 0.7, sodium: 2, phosphorus: 18, selenium: 0.2, copper: 0.12, manganese: 0.19 },
  { name: 'Nabo', category: 'Vegetais', calories: 28, protein: 0.9, carbs: 6.4, fat: 0.1, fiber: 1.8, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 21, vitaminD: 0, vitaminE: 0, vitaminK: 0.1, vitaminB1: 0.04, vitaminB2: 0.03, vitaminB3: 0.4, vitaminB6: 0.09, vitaminB12: 0, folicAcid: 15, calcium: 30, iron: 0.3, magnesium: 11, potassium: 191, zinc: 0.3, sodium: 67, phosphorus: 27, selenium: 0.7, copper: 0.09, manganese: 0.13 },
  { name: 'Almeirão', category: 'Vegetais', calories: 23, protein: 1.7, carbs: 4.7, fat: 0.3, fiber: 3.1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 5850, vitaminC: 24, vitaminD: 0, vitaminE: 2.3, vitaminK: 0, vitaminB1: 0.06, vitaminB2: 0.1, vitaminB3: 0.4, vitaminB6: 0.07, vitaminB12: 0, folicAcid: 110, calcium: 100, iron: 1.2, magnesium: 36, potassium: 420, zinc: 0.4, sodium: 45, phosphorus: 40, selenium: 0.9, copper: 0.08, manganese: 0.42 },
  { name: 'Acelga', category: 'Vegetais', calories: 19, protein: 1.8, carbs: 3.7, fat: 0.2, fiber: 1.6, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 6116, vitaminC: 30, vitaminD: 0, vitaminE: 1.9, vitaminK: 830, vitaminB1: 0.04, vitaminB2: 0.09, vitaminB3: 0.4, vitaminB6: 0.1, vitaminB12: 0, folicAcid: 14, calcium: 51, iron: 1.8, magnesium: 81, potassium: 379, zinc: 0.4, sodium: 213, phosphorus: 46, selenium: 0.9, copper: 0.18, manganese: 0.37 },
  { name: 'Agrião', category: 'Vegetais', calories: 11, protein: 2.3, carbs: 1.3, fat: 0.1, fiber: 0.5, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 3191, vitaminC: 43, vitaminD: 0, vitaminE: 1, vitaminK: 250, vitaminB1: 0.09, vitaminB2: 0.12, vitaminB3: 0.2, vitaminB6: 0.13, vitaminB12: 0, folicAcid: 9, calcium: 120, iron: 0.2, magnesium: 21, potassium: 330, zinc: 0.1, sodium: 41, phosphorus: 60, selenium: 0.3, copper: 0.08, manganese: 0.24 },
  { name: 'Alho', category: 'Vegetais', calories: 149, protein: 6.4, carbs: 33.1, fat: 0.5, fiber: 2.1, saturatedFat: 0.1, monounsaturatedFat: 0, polyunsaturatedFat: 0.2, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 9, vitaminC: 31.2, vitaminD: 0, vitaminE: 0, vitaminK: 1.7, vitaminB1: 0.2, vitaminB2: 0.11, vitaminB3: 0.7, vitaminB6: 1.24, vitaminB12: 0, folicAcid: 3, calcium: 181, iron: 1.7, magnesium: 25, potassium: 401, zinc: 1.2, sodium: 17, phosphorus: 153, selenium: 14.2, copper: 0.3, manganese: 1.67 },
  { name: 'Alcachofra', category: 'Vegetais', calories: 47, protein: 3.3, carbs: 10.5, fat: 0.2, fiber: 5.4, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 13, vitaminC: 11.7, vitaminD: 0, vitaminE: 0.2, vitaminK: 14.8, vitaminB1: 0.07, vitaminB2: 0.07, vitaminB3: 1.1, vitaminB6: 0.12, vitaminB12: 0, folicAcid: 68, calcium: 44, iron: 1.3, magnesium: 60, potassium: 370, zinc: 0.5, sodium: 94, phosphorus: 90, selenium: 0.2, copper: 0.23, manganese: 0.26 },
  { name: 'Aspargo', category: 'Vegetais', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 756, vitaminC: 5.6, vitaminD: 0, vitaminE: 1.1, vitaminK: 41.6, vitaminB1: 0.14, vitaminB2: 0.14, vitaminB3: 1, vitaminB6: 0.09, vitaminB12: 0, folicAcid: 52, calcium: 24, iron: 2.1, magnesium: 14, potassium: 202, zinc: 0.5, sodium: 2, phosphorus: 52, selenium: 2.3, copper: 0.19, manganese: 0.16 },
  { name: 'Chicória', category: 'Vegetais', calories: 23, protein: 1.7, carbs: 4.7, fat: 0.3, fiber: 3.1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 5717, vitaminC: 24, vitaminD: 0, vitaminE: 2.3, vitaminK: 298, vitaminB1: 0.06, vitaminB2: 0.1, vitaminB3: 0.4, vitaminB6: 0.11, vitaminB12: 0, folicAcid: 110, calcium: 100, iron: 0.9, magnesium: 30, potassium: 420, zinc: 0.4, sodium: 45, phosphorus: 47, selenium: 0.9, copper: 0.08, manganese: 0.43 },
  { name: 'Couve chinesa', category: 'Vegetais', calories: 13, protein: 1.5, carbs: 2.2, fat: 0.2, fiber: 1, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 4468, vitaminC: 45, vitaminD: 0, vitaminE: 0.1, vitaminK: 45.5, vitaminB1: 0.04, vitaminB2: 0.07, vitaminB3: 0.4, vitaminB6: 0.19, vitaminB12: 0, folicAcid: 66, calcium: 105, iron: 0.3, magnesium: 13, potassium: 252, zinc: 0.2, sodium: 9, phosphorus: 37, selenium: 0.6, copper: 0.02, manganese: 0.16 },
  { name: 'Jiló', category: 'Vegetais', calories: 31, protein: 1.4, carbs: 6.6, fat: 0.2, fiber: 3.9, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 120, vitaminC: 18.7, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.04, vitaminB2: 0.04, vitaminB3: 0.5, vitaminB6: 0.1, vitaminB12: 0, folicAcid: 0, calcium: 15, iron: 0.4, magnesium: 13, potassium: 235, zinc: 0.2, sodium: 1, phosphorus: 30, selenium: 0, copper: 0.05, manganese: 0.15 },
  { name: 'Maxixe', category: 'Vegetais', calories: 19, protein: 1.7, carbs: 3.3, fat: 0.2, fiber: 1.3, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0.1, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 180, vitaminC: 21.2, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0.03, vitaminB2: 0.04, vitaminB3: 0.3, vitaminB6: 0.05, vitaminB12: 0, folicAcid: 0, calcium: 18, iron: 0.4, magnesium: 12, potassium: 150, zinc: 0.2, sodium: 1, phosphorus: 17, selenium: 0, copper: 0.04, manganese: 0.1 },

  // Óleos e Gorduras
  { name: 'Azeite de Oliva', category: 'Óleos', calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, saturatedFat: 13.8, monounsaturatedFat: 73, polyunsaturatedFat: 10.5, cholesterol: 0, omega3: 761, omega6: 9762, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 14.4, vitaminK: 60.2, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 1, iron: 0.4, magnesium: 0, potassium: 1, zinc: 0, sodium: 2, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
  { name: 'Óleo de coco', category: 'Óleos', calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, saturatedFat: 86.5, monounsaturatedFat: 5.8, polyunsaturatedFat: 1.8, cholesterol: 0, omega3: 0, omega6: 1800, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.5, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },

  // Outros
  { name: 'Cacau em Pó', category: 'Outros', calories: 228, protein: 19.6, carbs: 57.9, fat: 13.7, fiber: 33.2, saturatedFat: 8.1, monounsaturatedFat: 4.6, polyunsaturatedFat: 0.4, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.1, vitaminK: 2.5, vitaminB1: 0.08, vitaminB2: 0.24, vitaminB3: 2.2, vitaminB6: 0.12, vitaminB12: 0, folicAcid: 32, calcium: 128, iron: 13.9, magnesium: 499, potassium: 1524, zinc: 6.8, sodium: 21, phosphorus: 734, selenium: 14.3, copper: 3.79, manganese: 3.84 },
  { name: 'Mel', category: 'Outros', calories: 304, protein: 0.3, carbs: 82.4, fat: 0, fiber: 0.2, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0.5, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0, vitaminB2: 0.04, vitaminB3: 0.1, vitaminB6: 0.02, vitaminB12: 0, folicAcid: 2, calcium: 6, iron: 0.4, magnesium: 2, potassium: 52, zinc: 0.2, sodium: 4, phosphorus: 4, selenium: 0.8, copper: 0.04, manganese: 0.08 },
  { name: 'Azeitona', category: 'Outros', calories: 115, protein: 0.8, carbs: 6.3, fat: 10.7, fiber: 3.2, saturatedFat: 1.4, monounsaturatedFat: 7.9, polyunsaturatedFat: 0.9, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 393, vitaminC: 0.9, vitaminD: 0, vitaminE: 3.8, vitaminK: 1.4, vitaminB1: 0.00, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0.01, vitaminB12: 0, folicAcid: 0, calcium: 88, iron: 3.3, magnesium: 4, potassium: 8, zinc: 0.2, sodium: 735, phosphorus: 3, selenium: 0.9, copper: 0.25, manganese: 0.02 },
  { name: 'Tenebre', category: 'Outros', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, saturatedFat: 0, monounsaturatedFat: 0, polyunsaturatedFat: 0, cholesterol: 0, omega3: 0, omega6: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folicAcid: 0, calcium: 0, iron: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0, phosphorus: 0, selenium: 0, copper: 0, manganese: 0 },
];

const dailyRecommendations = {
  vitaminA: 900,
  vitaminC: 90,
  vitaminD: 15,
  vitaminE: 15,
  vitaminK: 120,
  vitaminB1: 1.2,
  vitaminB2: 1.3,
  vitaminB3: 16,
  vitaminB6: 1.3,
  vitaminB12: 2.4,
  folicAcid: 400,
  calcium: 1000,
  iron: 8,
  magnesium: 400,
  potassium: 3500,
  zinc: 11,
  sodium: 2300,
  phosphorus: 700,
  selenium: 55,
  copper: 0.9,
  manganese: 2.3,
};

const categoryIcons: Record<string, any> = {
  Frutas: Apple,
  Proteínas: Beef,
  Carboidratos: Wheat,
  Vegetais: Carrot,
  Laticínios: Milk,
  Óleos: Droplet,
  Oleaginosas: Leaf,
  Outros: Egg,
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedFood, setSelectedFood] = useState<NutritionalInfo | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/auth');
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const categories = ['Todas', ...Array.from(new Set(foods.map(f => f.category)))];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPercentage = (value: number, recommended: number) => {
    return Math.round((value / recommended) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout and Assistant Button */}
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <div className="text-center flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
              🥗 Informações Nutricionais
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Descubra os valores nutricionais de 156 alimentos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/nutritional-assistant')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline">Assistente Plus</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar alimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {filteredFoods.map((food, index) => {
            const Icon = categoryIcons[food.category] || Egg;
            return (
              <button
                key={index}
                onClick={() => setSelectedFood(food)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100 truncate">
                      {food.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{food.category}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Calorias</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{food.calories} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Proteínas</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{food.protein}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Carboidratos</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{food.carbs}g</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed View Modal */}
        {selectedFood && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {selectedFood.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedFood.category} • Por 100g</p>
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-600 dark:text-gray-400">×</span>
                </button>
              </div>

              {/* Macronutrientes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 p-4 rounded-xl">
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">Calorias</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{selectedFood.calories}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">kcal</p>
                </div>
                <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 p-4 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-1">Proteínas</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{selectedFood.protein}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">g</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Carboidratos</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedFood.carbs}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">g</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-xl">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">Gorduras</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{selectedFood.fat}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">g</p>
                </div>
              </div>

              {/* Perfil de Gorduras */}
              <div className="mb-8 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800">
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2">
                  <Droplet className="w-5 h-5" />
                  Perfil de Gorduras
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Saturada</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedFood.saturatedFat}g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Monoinsaturada</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedFood.monounsaturatedFat}g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Poli-insaturada</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedFood.polyunsaturatedFat}g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Colesterol</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedFood.cholesterol}mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Ômega-3</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedFood.omega3}mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Ômega-6</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedFood.omega6}mg</span>
                  </div>
                </div>
              </div>

              {/* Vitaminas */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Vitaminas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Vitamina A', value: selectedFood.vitaminA, unit: 'mcg', rec: dailyRecommendations.vitaminA },
                    { name: 'Vitamina C', value: selectedFood.vitaminC, unit: 'mg', rec: dailyRecommendations.vitaminC },
                    { name: 'Vitamina D', value: selectedFood.vitaminD, unit: 'mcg', rec: dailyRecommendations.vitaminD },
                    { name: 'Vitamina E', value: selectedFood.vitaminE, unit: 'mg', rec: dailyRecommendations.vitaminE },
                    { name: 'Vitamina K', value: selectedFood.vitaminK, unit: 'mcg', rec: dailyRecommendations.vitaminK },
                    { name: 'Vitamina B1', value: selectedFood.vitaminB1, unit: 'mg', rec: dailyRecommendations.vitaminB1 },
                    { name: 'Vitamina B2', value: selectedFood.vitaminB2, unit: 'mg', rec: dailyRecommendations.vitaminB2 },
                    { name: 'Vitamina B3', value: selectedFood.vitaminB3, unit: 'mg', rec: dailyRecommendations.vitaminB3 },
                    { name: 'Vitamina B6', value: selectedFood.vitaminB6, unit: 'mg', rec: dailyRecommendations.vitaminB6 },
                    { name: 'Vitamina B12', value: selectedFood.vitaminB12, unit: 'mcg', rec: dailyRecommendations.vitaminB12 },
                    { name: 'Ácido Fólico', value: selectedFood.folicAcid, unit: 'mcg', rec: dailyRecommendations.folicAcid },
                  ].map((vitamin, idx) => {
                    const percentage = getPercentage(vitamin.value, vitamin.rec);
                    return (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{vitamin.name}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {vitamin.value} {vitamin.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage}% da IDR</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Minerais */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Minerais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Cálcio', value: selectedFood.calcium, unit: 'mg', rec: dailyRecommendations.calcium },
                    { name: 'Ferro', value: selectedFood.iron, unit: 'mg', rec: dailyRecommendations.iron },
                    { name: 'Magnésio', value: selectedFood.magnesium, unit: 'mg', rec: dailyRecommendations.magnesium },
                    { name: 'Potássio', value: selectedFood.potassium, unit: 'mg', rec: dailyRecommendations.potassium },
                    { name: 'Zinco', value: selectedFood.zinc, unit: 'mg', rec: dailyRecommendations.zinc },
                    { name: 'Sódio', value: selectedFood.sodium, unit: 'mg', rec: dailyRecommendations.sodium },
                    { name: 'Fósforo', value: selectedFood.phosphorus, unit: 'mg', rec: dailyRecommendations.phosphorus },
                    { name: 'Selênio', value: selectedFood.selenium, unit: 'mcg', rec: dailyRecommendations.selenium },
                    { name: 'Cobre', value: selectedFood.copper, unit: 'mg', rec: dailyRecommendations.copper },
                    { name: 'Manganês', value: selectedFood.manganese, unit: 'mg', rec: dailyRecommendations.manganese },
                  ].map((mineral, idx) => {
                    const percentage = getPercentage(mineral.value, mineral.rec);
                    return (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mineral.name}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {mineral.value} {mineral.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage}% da IDR</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
