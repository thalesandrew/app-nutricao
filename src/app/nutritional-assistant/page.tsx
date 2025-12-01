'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Plus,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  User,
  Crown,
  Utensils,
  X,
} from 'lucide-react';
import {
  availableNutrients,
  adjustGoalForProfile,
  calculateFoodSuggestions,
  calculateDailyProgress,
  calculateBMI,
  interpretBMI,
  type NutrientInfo,
  type UserProfile,
  type FoodSuggestion,
} from '@/lib/nutritional-calculator';

// Importar dados de alimentos da página principal
const foods = [
  // Aqui você pode importar ou replicar a lista de alimentos
  // Por simplicidade, vou usar uma versão reduzida
];

export default function NutritionalAssistant() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({ planType: 'free' });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedNutrients, setSelectedNutrients] = useState<NutrientInfo[]>([]);
  const [goals, setGoals] = useState<Map<string, number>>(new Map());
  const [consumption, setConsumption] = useState<Map<string, number>>(new Map());
  const [suggestions, setSuggestions] = useState<Map<string, FoodSuggestion[]>>(new Map());

  // Estados do formulário de perfil
  const [profileForm, setProfileForm] = useState({
    age: '',
    weight: '',
    height: '',
  });

  // Estados do formulário de meta
  const [goalForm, setGoalForm] = useState({
    nutrient: '',
    customValue: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Verificar se o Supabase está configurado
      if (!supabase) {
        console.log('Supabase não configurado, usando modo demo');
        setLoading(false);
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        setLoading(false);
        return;
      }

      if (!session) {
        // Modo demo sem autenticação
        setLoading(false);
        return;
      }

      setUser(session.user);
      await loadUserProfile(session.user.id);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      // Continuar sem autenticação em modo demo
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      if (!supabase) return;

      // Tentar carregar perfil do Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setUserProfile({
          age: data.age,
          weight: data.weight,
          height: data.height,
          bmi: data.bmi,
          planType: data.plan_type || 'free',
        });
      }

      // Carregar metas
      const { data: goalsData } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('user_id', userId);

      if (goalsData) {
        const goalsMap = new Map();
        goalsData.forEach(goal => {
          goalsMap.set(goal.nutrient_name, goal.target_value);
        });
        setGoals(goalsMap);
      }

      // Carregar consumo do dia
      const today = new Date().toISOString().split('T')[0];
      const { data: consumptionData } = await supabase
        .from('food_consumption')
        .select('*')
        .eq('user_id', userId)
        .eq('consumption_date', today);

      if (consumptionData) {
        const consumptionMap = new Map();
        consumptionData.forEach(item => {
          const current = consumptionMap.get(item.nutrient_name) || 0;
          consumptionMap.set(item.nutrient_name, current + item.nutrient_value);
        });
        setConsumption(consumptionMap);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      // Continuar com dados locais
    }
  };

  const saveProfile = async () => {
    const age = parseInt(profileForm.age);
    const weight = parseFloat(profileForm.weight);
    const height = parseFloat(profileForm.height);
    const bmi = calculateBMI(weight, height);

    const profile: UserProfile = {
      age,
      weight,
      height,
      bmi,
      planType: 'plus',
    };

    if (user && supabase) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            age,
            weight,
            height,
            bmi,
            plan_type: 'plus',
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Erro ao salvar perfil:', error);
        }
      } catch (error) {
        console.error('Erro ao salvar perfil:', error);
      }
    }

    // Salvar localmente sempre
    setUserProfile(profile);
    setShowProfileModal(false);
  };

  const addGoal = async () => {
    if (!goalForm.nutrient) return;

    const nutrient = availableNutrients.find(n => n.name === goalForm.nutrient);
    if (!nutrient) return;

    const targetValue = goalForm.customValue
      ? parseFloat(goalForm.customValue)
      : adjustGoalForProfile(nutrient, userProfile);

    if (user && supabase) {
      try {
        const { error } = await supabase
          .from('daily_goals')
          .upsert({
            user_id: user.id,
            nutrient_name: nutrient.name,
            target_value: targetValue,
            unit: nutrient.unit,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Erro ao adicionar meta:', error);
        }
      } catch (error) {
        console.error('Erro ao adicionar meta:', error);
      }
    }

    // Adicionar localmente sempre
    const newGoals = new Map(goals);
    newGoals.set(nutrient.name, targetValue);
    setGoals(newGoals);
    
    if (!selectedNutrients.find(n => n.name === nutrient.name)) {
      setSelectedNutrients([...selectedNutrients, nutrient]);
    }

    setShowGoalModal(false);
    setGoalForm({ nutrient: '', customValue: '' });
    
    // Gerar sugestões
    generateSuggestions(nutrient.key, targetValue);
  };

  const generateSuggestions = (nutrientKey: string, targetValue: number) => {
    const currentValue = consumption.get(nutrientKey) || 0;
    const foodSuggestions = calculateFoodSuggestions(
      nutrientKey as any,
      targetValue,
      currentValue,
      foods
    );

    const newSuggestions = new Map(suggestions);
    newSuggestions.set(nutrientKey, foodSuggestions);
    setSuggestions(newSuggestions);
  };

  const registerConsumption = async (nutrientName: string, foodName: string, quantity: number, nutrientValue: number) => {
    if (user && supabase) {
      try {
        const { error } = await supabase
          .from('food_consumption')
          .insert({
            user_id: user.id,
            food_name: foodName,
            quantity,
            nutrient_name: nutrientName,
            nutrient_value: nutrientValue,
            consumption_date: new Date().toISOString().split('T')[0],
          });

        if (error) {
          console.error('Erro ao registrar consumo:', error);
        }
      } catch (error) {
        console.error('Erro ao registrar consumo:', error);
      }
    }

    // Registrar localmente sempre
    const newConsumption = new Map(consumption);
    const current = newConsumption.get(nutrientName) || 0;
    newConsumption.set(nutrientName, current + nutrientValue);
    setConsumption(newConsumption);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar plano Plus
  if (userProfile.planType !== 'plus') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Funcionalidade Exclusiva Plus
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              O Assistente Nutricional Plus está disponível apenas para assinantes do plano Plus.
            </p>
            <button
              onClick={() => {
                // Simular upgrade para Plus
                setUserProfile({ ...userProfile, planType: 'plus' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all"
            >
              Ativar Plano Plus (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl">
            <Crown className="w-5 h-5" />
            <span className="font-bold">Plus</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            🎯 Assistente Nutricional Plus
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Defina metas nutricionais e receba sugestões personalizadas de alimentos
          </p>
        </div>

        {/* Perfil do Usuário */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <User className="w-6 h-6" />
              Seu Perfil
            </h2>
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
            >
              {userProfile.age ? 'Editar' : 'Configurar'}
            </button>
          </div>

          {userProfile.age ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Idade</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{userProfile.age}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">anos</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Peso</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{userProfile.weight}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">kg</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <p className="text-sm text-green-700 dark:text-green-300 mb-1">Altura</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{userProfile.height}</p>
                <p className="text-xs text-green-600 dark:text-green-400">cm</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">IMC</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{userProfile.bmi}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {userProfile.bmi && interpretBMI(userProfile.bmi)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              Configure seu perfil para receber sugestões personalizadas
            </p>
          )}
        </div>

        {/* Metas Nutricionais */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Metas Diárias
            </h2>
            <button
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Adicionar Meta
            </button>
          </div>

          {selectedNutrients.length > 0 ? (
            <div className="space-y-4">
              {selectedNutrients.map(nutrient => {
                const goal = goals.get(nutrient.name) || 0;
                const consumed = consumption.get(nutrient.name) || 0;
                const progress = calculateDailyProgress(goal, consumed);

                return (
                  <div key={nutrient.name} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">{nutrient.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{nutrient.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                          {consumed.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          de {goal} {nutrient.unit}
                        </p>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="relative w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mb-2">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          progress.status === 'complete'
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : progress.status === 'good'
                            ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                            : 'bg-gradient-to-r from-orange-400 to-orange-600'
                        }`}
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-lg">
                          {progress.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Faltam: {progress.remaining} {nutrient.unit}
                      </span>
                      {progress.status === 'complete' ? (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Meta atingida!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                          <TrendingUp className="w-4 h-4" />
                          Continue!
                        </span>
                      )}
                    </div>

                    {/* Sugestões de Alimentos */}
                    {progress.remaining > 0 && suggestions.get(nutrient.key) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <Utensils className="w-4 h-4" />
                          Sugestões para atingir sua meta:
                        </h4>
                        <div className="space-y-2">
                          {suggestions.get(nutrient.key)!.slice(0, 3).map((suggestion, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                  {suggestion.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {suggestion.nutrientValue.toFixed(1)} {nutrient.unit} ({suggestion.percentageOfGoal.toFixed(0)}% da meta)
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  registerConsumption(
                                    nutrient.name,
                                    suggestion.name,
                                    suggestion.quantity,
                                    suggestion.nutrientValue
                                  )
                                }
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-all"
                              >
                                Registrar
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhuma meta definida ainda. Clique em "Adicionar Meta" para começar!
              </p>
            </div>
          )}
        </div>

        {/* Modal de Perfil */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Configurar Perfil
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-purple-500 focus:outline-none"
                    placeholder="Ex: 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.weight}
                    onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-purple-500 focus:outline-none"
                    placeholder="Ex: 70.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileForm.height}
                    onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-purple-500 focus:outline-none"
                    placeholder="Ex: 175"
                  />
                </div>

                <button
                  onClick={saveProfile}
                  disabled={!profileForm.age || !profileForm.weight || !profileForm.height}
                  className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all"
                >
                  Salvar Perfil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Meta */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Adicionar Meta
                </h2>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selecione o Nutriente
                  </label>
                  <select
                    value={goalForm.nutrient}
                    onChange={(e) => setGoalForm({ ...goalForm, nutrient: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Escolha um nutriente...</option>
                    {availableNutrients.map(nutrient => (
                      <option key={nutrient.name} value={nutrient.name}>
                        {nutrient.name} ({nutrient.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {goalForm.nutrient && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                        Recomendação Padrão
                      </p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {adjustGoalForProfile(
                          availableNutrients.find(n => n.name === goalForm.nutrient)!,
                          userProfile
                        )}{' '}
                        {availableNutrients.find(n => n.name === goalForm.nutrient)?.unit}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ou defina sua própria meta (opcional)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={goalForm.customValue}
                        onChange={(e) => setGoalForm({ ...goalForm, customValue: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-green-500 focus:outline-none"
                        placeholder="Deixe em branco para usar a recomendação"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={addGoal}
                  disabled={!goalForm.nutrient}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all"
                >
                  Adicionar Meta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
