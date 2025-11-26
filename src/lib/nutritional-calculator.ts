// Lógica de cálculo nutricional e sugestões de alimentos

export interface NutrientInfo {
  name: string;
  key: keyof FoodNutrients;
  unit: string;
  defaultGoal: number;
  description: string;
}

export interface FoodNutrients {
  protein: number;
  fiber: number;
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
  selenium: number;
  copper: number;
  manganese: number;
}

export interface FoodSuggestion {
  name: string;
  quantity: number; // em gramas
  nutrientValue: number;
  percentageOfGoal: number;
}

export interface UserProfile {
  age?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  planType: 'free' | 'plus';
}

// Lista de nutrientes disponíveis
export const availableNutrients: NutrientInfo[] = [
  { name: 'Proteína', key: 'protein', unit: 'g', defaultGoal: 60, description: 'Essencial para músculos e tecidos' },
  { name: 'Fibra', key: 'fiber', unit: 'g', defaultGoal: 25, description: 'Importante para digestão' },
  { name: 'Ômega-3', key: 'omega3', unit: 'mg', defaultGoal: 1600, description: 'Gordura saudável anti-inflamatória' },
  { name: 'Ômega-6', key: 'omega6', unit: 'mg', defaultGoal: 17000, description: 'Gordura essencial' },
  { name: 'Vitamina A', key: 'vitaminA', unit: 'mcg', defaultGoal: 900, description: 'Saúde da visão' },
  { name: 'Vitamina C', key: 'vitaminC', unit: 'mg', defaultGoal: 90, description: 'Antioxidante e imunidade' },
  { name: 'Vitamina D', key: 'vitaminD', unit: 'mcg', defaultGoal: 15, description: 'Saúde óssea' },
  { name: 'Vitamina E', key: 'vitaminE', unit: 'mg', defaultGoal: 15, description: 'Antioxidante' },
  { name: 'Vitamina K', key: 'vitaminK', unit: 'mcg', defaultGoal: 120, description: 'Coagulação sanguínea' },
  { name: 'Vitamina B1', key: 'vitaminB1', unit: 'mg', defaultGoal: 1.2, description: 'Metabolismo energético' },
  { name: 'Vitamina B2', key: 'vitaminB2', unit: 'mg', defaultGoal: 1.3, description: 'Produção de energia' },
  { name: 'Vitamina B3', key: 'vitaminB3', unit: 'mg', defaultGoal: 16, description: 'Metabolismo celular' },
  { name: 'Vitamina B6', key: 'vitaminB6', unit: 'mg', defaultGoal: 1.3, description: 'Função cerebral' },
  { name: 'Vitamina B12', key: 'vitaminB12', unit: 'mcg', defaultGoal: 2.4, description: 'Formação de células' },
  { name: 'Ácido Fólico', key: 'folicAcid', unit: 'mcg', defaultGoal: 400, description: 'Desenvolvimento celular' },
  { name: 'Cálcio', key: 'calcium', unit: 'mg', defaultGoal: 1000, description: 'Saúde óssea e dental' },
  { name: 'Ferro', key: 'iron', unit: 'mg', defaultGoal: 8, description: 'Transporte de oxigênio' },
  { name: 'Magnésio', key: 'magnesium', unit: 'mg', defaultGoal: 400, description: 'Função muscular e nervosa' },
  { name: 'Potássio', key: 'potassium', unit: 'mg', defaultGoal: 3500, description: 'Pressão arterial' },
  { name: 'Zinco', key: 'zinc', unit: 'mg', defaultGoal: 11, description: 'Sistema imunológico' },
  { name: 'Selênio', key: 'selenium', unit: 'mcg', defaultGoal: 55, description: 'Antioxidante' },
  { name: 'Cobre', key: 'copper', unit: 'mg', defaultGoal: 0.9, description: 'Formação de glóbulos vermelhos' },
  { name: 'Manganês', key: 'manganese', unit: 'mg', defaultGoal: 2.3, description: 'Metabolismo ósseo' },
];

// Ajustar meta baseado no perfil do usuário
export function adjustGoalForProfile(nutrient: NutrientInfo, profile: UserProfile): number {
  let goal = nutrient.defaultGoal;

  if (!profile.weight || !profile.age) return goal;

  // Ajustes baseados em peso e idade
  if (nutrient.key === 'protein') {
    // Proteína: 0.8-1g por kg de peso corporal
    goal = profile.weight * 0.8;
  } else if (nutrient.key === 'fiber') {
    // Fibra: ajuste baseado em peso
    goal = 14 * (profile.weight / 70); // 14g por 1000 kcal (aproximado)
  }

  // Ajustes por idade
  if (profile.age > 50) {
    if (nutrient.key === 'calcium') goal *= 1.2; // Mais cálcio para idosos
    if (nutrient.key === 'vitaminD') goal *= 1.3; // Mais vitamina D
  }

  return Math.round(goal * 100) / 100;
}

// Calcular sugestões de alimentos para atingir meta
export function calculateFoodSuggestions(
  nutrientKey: keyof FoodNutrients,
  targetValue: number,
  currentValue: number,
  allFoods: any[]
): FoodSuggestion[] {
  const remaining = targetValue - currentValue;
  if (remaining <= 0) return [];

  // Filtrar alimentos ricos no nutriente (top 30%)
  const foodsWithNutrient = allFoods
    .map(food => ({
      name: food.name,
      value: food[nutrientKey] || 0,
    }))
    .filter(f => f.value > 0)
    .sort((a, b) => b.value - a.value);

  const topFoods = foodsWithNutrient.slice(0, Math.ceil(foodsWithNutrient.length * 0.3));

  // Gerar sugestões
  const suggestions: FoodSuggestion[] = [];

  // Estratégia 1: Alimento único que atende a meta
  for (const food of topFoods) {
    const quantity = Math.ceil((remaining / food.value) * 100);
    if (quantity <= 500) { // Máximo 500g de um único alimento
      suggestions.push({
        name: food.name,
        quantity,
        nutrientValue: (food.value * quantity) / 100,
        percentageOfGoal: ((food.value * quantity) / 100 / targetValue) * 100,
      });
    }
  }

  // Estratégia 2: Combinação de 2-3 alimentos
  if (topFoods.length >= 2) {
    for (let i = 0; i < Math.min(3, topFoods.length); i++) {
      const food1 = topFoods[i];
      const food2 = topFoods[i + 1] || topFoods[0];
      
      // Dividir meta entre os dois alimentos
      const quantity1 = Math.ceil((remaining * 0.6 / food1.value) * 100);
      const quantity2 = Math.ceil((remaining * 0.4 / food2.value) * 100);

      if (quantity1 <= 300 && quantity2 <= 300) {
        const totalValue = (food1.value * quantity1 + food2.value * quantity2) / 100;
        suggestions.push({
          name: `${food1.name} (${quantity1}g) + ${food2.name} (${quantity2}g)`,
          quantity: quantity1 + quantity2,
          nutrientValue: totalValue,
          percentageOfGoal: (totalValue / targetValue) * 100,
        });
      }
    }
  }

  // Ordenar por proximidade da meta (100%)
  return suggestions
    .sort((a, b) => {
      const diffA = Math.abs(100 - a.percentageOfGoal);
      const diffB = Math.abs(100 - b.percentageOfGoal);
      return diffA - diffB;
    })
    .slice(0, 5); // Top 5 sugestões
}

// Calcular progresso diário
export function calculateDailyProgress(
  targetValue: number,
  consumedValue: number
): {
  percentage: number;
  remaining: number;
  status: 'low' | 'good' | 'complete' | 'exceeded';
} {
  const percentage = (consumedValue / targetValue) * 100;
  const remaining = Math.max(0, targetValue - consumedValue);

  let status: 'low' | 'good' | 'complete' | 'exceeded' = 'low';
  if (percentage >= 100) status = 'complete';
  else if (percentage > 100) status = 'exceeded';
  else if (percentage >= 70) status = 'good';

  return {
    percentage: Math.round(percentage * 10) / 10,
    remaining: Math.round(remaining * 100) / 100,
    status,
  };
}

// Calcular IMC
export function calculateBMI(weight: number, height: number): number {
  // height em cm, converter para metros
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
}

// Interpretar IMC
export function interpretBMI(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}
