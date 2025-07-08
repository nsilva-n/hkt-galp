'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Step5FinalPage from './submission/Step5FinalPage';
import { useParticipation } from '../hooks/useParticipation'

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Edit,
  Import,
  Check,
  X,
  Trash2,
  Camera,
  Upload,
} from 'lucide-react';
import Button from './ui/Button';
import design from '../config/design';
import { CAMPAIGN_CONFIG } from '../config/campaign';
import './submission/submission-modal.css';

const ActivitySubmissionFlow = ({ onClose }) => {
  const router = useRouter();
  const fileInputRefs = useRef({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionType, setSubmissionType] = useState('');
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState({});
  const [stravaActivities, setStravaActivities] = useState([]);  // holds Strava activities
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState({});
  const { submitParticipation } = useParticipation();
  const [activities, setActivities] = useState([
    {
      id: Date.now(),
      type: '',
      distance: '',
      date: new Date().toISOString().split('T')[0],
      isDateRange: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  ]);

  // Prevent unwanted scrolling when step changes
  useEffect(() => {
    const modalContent = document.querySelector('.submission-flow-card');
    if (modalContent && currentStep === 5) {
      // Reset scroll position immediately when review step is set
      modalContent.scrollTop = 0;
    }
  }, [currentStep]);

  const activityTypes = [
    { value: 'walk', label: 'Caminhada', icon: '🚶' },
    { value: 'run', label: 'Corrida', icon: '🏃' },
    { value: 'swim', label: 'Natação', icon: '🏊' },
    { value: 'cycle', label: 'Ciclismo', icon: '🚴' },
    { value: 'dance', label: 'Dança', icon: '💃' },
    { value: 'others', label: 'Outros', icon: '🏋️' },
  ];

  const supportedApps = [
    { name: 'Strava', icon: '🏃', color: 'bg-orange-500', available: true },
    { name: 'Google Fit', icon: '🎯', color: 'bg-blue-500', available: false },
    { name: 'Apple Health', icon: '❤️', color: 'bg-red-500', available: false },
    { name: 'Samsung Health', icon: '💚', color: 'bg-green-500', available: false },
  ];

  const handleImageUpload = (activityId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas ficheiros de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('O ficheiro é muito grande. Por favor, selecione uma imagem até 5MB.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedImages((prev) => ({
      ...prev,
      [activityId]: {
        file,
        preview: imageUrl,
        name: file.name,
      },
    }));

    const handleStravaConnect = async () => {
      try {
        const activities = await fetchStravaActivities(); // sua função que busca dados
        setStravaActivities(activities);
        setSubmissionType('import');
        setCurrentStep(3);
      } catch (error) {
        console.error('Erro ao buscar atividades do Strava:', error);
      }
    };

    // Clear image error if it exists
    if (validationErrors[activityId] && validationErrors[activityId].image) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[activityId]) {
          delete newErrors[activityId].image;
          if (Object.keys(newErrors[activityId]).length === 0) {
            delete newErrors[activityId];
          }
        }
        return newErrors;
      });
    }
  };

  const removeImage = (activityId) => {
    if (uploadedImages[activityId]) {
      URL.revokeObjectURL(uploadedImages[activityId].preview);
      setUploadedImages((prev) => {
        const newImages = { ...prev };
        delete newImages[activityId];
        return newImages;
      });
    }
  };

  const triggerImageUpload = (activityId) => {
    if (fileInputRefs.current[activityId]) {
      fileInputRefs.current[activityId].click();
    }
  };

  const validateActivity = (activity) => {
    const errors = {};
    if (!activity.type) errors.type = 'Por favor, selecione um tipo de atividade';
    // Convert comma to dot for validation
    const distanceValue = activity.distance ? parseFloat(activity.distance.toString().replace(',', '.')) : 0;
    if (!activity.distance || distanceValue <= 0) errors.distance = 'Por favor, introduza uma distância válida';
    if (!uploadedImages[activity.id]) errors.image = 'Por favor, carregue uma imagem que comprove a quilometragem';

    // Date validation
    if (activity.isDateRange) {
      if (!activity.startDate || !activity.endDate) {
        errors.date = 'Por favor, preencha as datas de início e fim';
      } else if (new Date(activity.startDate) > new Date(activity.endDate)) {
        errors.date = 'Data de início deve ser anterior à data de fim';
      } else {
        // Check if dates are within campaign period
        if (CAMPAIGN_CONFIG.isBeforeStart(activity.startDate)) {
          errors.date = `Data não pode ser anterior ao início da campanha (${CAMPAIGN_CONFIG.getStartDateString()})`;
        } else if (CAMPAIGN_CONFIG.isAfterEnd(activity.endDate)) {
          errors.date = `Data não pode ser posterior ao fim da campanha (${CAMPAIGN_CONFIG.getEndDateString()})`;
        }
      }
    } else {
      if (!activity.date) {
        errors.date = 'Por favor, selecione uma data';
      } else {
        // Check if date is within campaign period
        if (CAMPAIGN_CONFIG.isBeforeStart(activity.date)) {
          errors.date = `Data não pode ser anterior ao início da campanha (${CAMPAIGN_CONFIG.getStartDateString()})`;
        } else if (CAMPAIGN_CONFIG.isAfterEnd(activity.date)) {
          errors.date = `Data não pode ser posterior ao fim da campanha (${CAMPAIGN_CONFIG.getEndDateString()})`;
        }
      }
    }

    return errors;
  };

  const updateActivity = (id, field, value) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );

    if (validationErrors[id] && validationErrors[id][field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[id][field];
      if (Object.keys(newErrors[id]).length === 0) {
        delete newErrors[id];
      }
      setValidationErrors(newErrors);
    }
  };

  const addActivityFromReview = () => {
    const newActivity = {
      id: Date.now(),
      type: '',
      distance: '',
      date: new Date().toISOString().split('T')[0],
      isDateRange: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };
    setActivities([...activities, newActivity]);
    setCurrentActivityIndex(activities.length);
    setCurrentStep(1);
  };

  const deleteActivityFromReview = (activityId) => {
    const updatedActivities = activities.filter(activity => activity.id !== activityId);
    setActivities(updatedActivities);

    // Remove associated image
    removeImage(activityId);

    // If we deleted all activities, go back to manual entry
    if (updatedActivities.length === 0) {
      setActivities([{
        id: Date.now(),
        type: '',
        distance: '',
        date: new Date().toISOString().split('T')[0],
        isDateRange: false,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }]);
      setCurrentActivityIndex(0);
      setCurrentStep(1);
    }
  };

  const removeActivity = (id) => {
    if (activities.length > 1) {
      const newActivities = activities.filter((a) => a.id !== id);
      setActivities(newActivities);
      if (currentActivityIndex >= newActivities.length) {
        setCurrentActivityIndex(newActivities.length - 1);
      }
      const newErrors = { ...validationErrors };
      delete newErrors[id];
      setValidationErrors(newErrors);
      removeImage(id);
    }
  };

  const handleStravaConnect = () => {
    const baseTime = Date.now();

    const newStravaActivities = [
      {
        id: baseTime + 1,
        name: "Corrida Matinal",
        type: "run",
        distance: "5.2",
        date: new Date().toISOString().split("T")[0],
        isDateRange: false,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        source: "Strava",
        externalId: "strava_12345",
      },
      {
        id: baseTime + 2,
        name: "Ciclismo no Parque",
        type: "cycle",
        distance: "15.8",
        date: new Date(baseTime - 86400000).toISOString().split("T")[0], // 1 day ago
        isDateRange: false,
        startDate: new Date(baseTime - 86400000).toISOString().split("T")[0],
        endDate: new Date(baseTime - 86400000).toISOString().split("T")[0],
        source: "Strava",
        externalId: "strava_12346",
      },
      {
        id: baseTime + 3,
        name: "Passeio de Bicicleta",
        type: "cycle",
        distance: "22.3",
        date: new Date(baseTime - 2 * 86400000).toISOString().split("T")[0], // 2 days ago
        isDateRange: false,
        startDate: new Date(baseTime - 2 * 86400000).toISOString().split("T")[0],
        endDate: new Date(baseTime - 2 * 86400000).toISOString().split("T")[0],
        source: "Strava",
        externalId: "strava_12347",
      },
      {
        id: baseTime + 4,
        name: "Treino de Natação",
        type: "swim",
        distance: "1.5",
        date: new Date(baseTime - 3 * 86400000).toISOString().split("T")[0], // 3 days ago
        isDateRange: false,
        startDate: new Date(baseTime - 3 * 86400000).toISOString().split("T")[0],
        endDate: new Date(baseTime - 3 * 86400000).toISOString().split("T")[0],
        source: "Strava",
        externalId: "strava_12348",
      },
    ];

    setStravaActivities(newStravaActivities);
    setCurrentStep(3);
  };

  const removeDuplicateActivities = (list) => {
    const seen = new Set();
    return list.filter((activity) => {
      if (activity.externalId) {
        if (seen.has(activity.externalId)) return false;
        seen.add(activity.externalId);
        return true;
      }
      const key = `${activity.type}_${activity.distance}_${activity.date || activity.startDate}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const isAuthenticated = Boolean(token);

      console.log("Activities being submitted:", activities);


      for (const activity of activities) {
        const {
          type: activity_type,
          distance,
          startDate,
          endDate,
          isDateRange,
        } = activity;

        if (!activity.type || !activity.distance) {
          console.warn("Skipping empty activity:", activity);
          continue;
        }

        const payload = {
          activity_type,
          distance_km: parseFloat(distance),
          start_date: startDate,
          end_date: isDateRange ? endDate : startDate,
          participation_mode: submissionType,
        };

        if (!isAuthenticated) {
          // Required for unauthenticated users
          payload.district = "Lisboa";        // TODO: connect to form input
          payload.municipality = "Lisboa";    // TODO: connect to form input

          if (submissionType === "group") {
            payload.association_name = "Associação Genérica"; // TODO: connect to form input
          }
        }

        await submitParticipation(payload);
      }

      // ✅ Reset state
      setCurrentStep(0);
      setSubmissionType('');
      setCurrentActivityIndex(0);
      setValidationErrors({});
      setUploadedImages({});
      setActivities([
        {
          id: Date.now(),
          type: '',
          distance: '',
          date: new Date().toISOString().split('T')[0],
          isDateRange: false,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        },
      ]);

      setCurrentStep(5);
    } catch (err) {
      console.error("Erro ao submeter participação:", err.message);
    }
  };



  const goToReviewStep = () => {
    // Maintain scroll position at top before changing step
    const modalContent = document.querySelector('.submission-flow-card');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
    setCurrentStep(4);
  };

  const nextActivity = () => {
    const current = activities[currentActivityIndex];
    const errors = validateActivity(current);
    if (Object.keys(errors).length > 0) {
      setValidationErrors({ [current.id]: errors });
      return;
    }
    setValidationErrors({});
    goToReviewStep();
  };

  const renderStep0 = () => (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Como gostaria de adicionar as suas atividades?</h2>

      <div className="space-y-4">
        <Button
          onClick={() => {
            setSubmissionType('import');
            setCurrentStep(2);
          }}
          variant="primary"
          size="lg"
          fullWidth
          className="p-6"
        >
          <Import className="button__icon" />
          <span>Importar de Aplicação</span>
        </Button>

        <Button
          onClick={() => {
            setSubmissionType('manual');
            setCurrentStep(1);
          }}
          variant="secondary"
          size="lg"
          fullWidth
          className="p-6"
        >
          <Edit className="button__icon" />
          <span>Introduzir Manualmente</span>
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-2xl">
        <h3 className="font-semibold text-gray-700 mb-2">Aplicações Suportadas:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {supportedApps.map((app) => (
            <span
              key={app.name}
              className={`px-3 py-1 rounded-full text-sm text-white ${app.color} ${!app.available ? 'opacity-50' : ''
                }`}
            >
              {app.icon} {app.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep1Manual = () => {
    const activity = activities[currentActivityIndex];
    const errors = validationErrors[activity.id] || {};

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Adicionar Atividade {currentActivityIndex + 1} de {activities.length}
          </h2>
          {activities.length > 1 && (
            <Button
              onClick={() => removeActivity(activity.id)}
              variant="secondary"
              size="sm"
              className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
            >
              <Minus className="button__icon" />
              <span>Remover</span>
            </Button>
          )}
        </div>

        <div className="border border-gray-300 rounded-2xl p-6 bg-white shadow-sm">
          {/* Activity Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Atividade</label>
            <div className="grid grid-cols-2 gap-2">
              {activityTypes.map((type) => (
                <Button
                  key={type.value}
                  onClick={() => updateActivity(activity.id, 'type', activity.type === type.value ? '' : type.value)}
                  variant="secondary"
                  className={`p-3 font-normal ${errors.type ? 'border-red-500 bg-red-50' : ''
                    }`}
                  style={{
                    backgroundColor: activity.type === type.value ? "#ffd6bc" : undefined,
                    borderColor: activity.type === type.value ? "#be2e00" : undefined,
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.5rem",
                    textAlign: "center"
                  }}>
                    <span className="profile__country-flag">{type.icon}</span>
                    <span className="profile__country-name">{type.label}</span>
                  </div>
                </Button>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Distance */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Distância (km)</label>
            <input
              type="text"
              value={activity.distance}
              onChange={(e) => {
                // Only allow numbers, dots, and commas
                const value = e.target.value;
                const filteredValue = value.replace(/[^0-9.,]/g, '');
                updateActivity(activity.id, 'distance', filteredValue);
              }}
              onBlur={(e) => {
                // Reset warning when field is blurred to recheck
                setDismissedWarnings(prev => ({ ...prev, [activity.id]: false }));

                // Format on blur to ensure decimal place with comma
                const value = e.target.value.trim();
                if (value) {
                  // Replace dots with commas for consistency
                  let processedValue = value.replace('.', ',');

                  // Parse the number (handle both comma and dot)
                  const numValue = parseFloat(processedValue.replace(',', '.'));

                  if (!isNaN(numValue) && numValue > 0) {
                    // Check if user already has decimals
                    const parts = processedValue.split(',');
                    let formatted;

                    if (parts.length > 1 && parts[1].length > 0) {
                      // User has decimals, keep up to 2 decimal places
                      formatted = numValue.toFixed(Math.min(parts[1].length, 2)).replace('.', ',');
                    } else {
                      // No decimals, add ,0
                      formatted = numValue.toFixed(1).replace('.', ',');
                    }

                    updateActivity(activity.id, 'distance', formatted);
                  }
                }
              }}
              className={`w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.distance ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="Introduza a distância em km"
            />
            {errors.distance && (
              <p className="text-red-500 text-sm mt-1">{errors.distance}</p>
            )}
            {(() => {
              const distanceValue = activity.distance ? parseFloat(activity.distance.toString().replace(',', '.')) : 0;
              if (distanceValue > 200 && !dismissedWarnings[activity.id]) {
                return (
                  <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-1">
                    <p className="text-yellow-700 text-sm">
                      O valor inserido realmente refere-se a <u>quilômetros</u>?
                    </p>
                    <button
                      onClick={() => setDismissedWarnings(prev => ({ ...prev, [activity.id]: true }))}
                      className="text-yellow-700 hover:text-yellow-800 text-sm font-medium underline ml-2"
                    >
                      Sim
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!activity.isDateRange}
                    onChange={() => updateActivity(activity.id, 'isDateRange', false)}
                    className="text-blue-500"
                  />
                  <span>Data Única</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={activity.isDateRange}
                    onChange={() => updateActivity(activity.id, 'isDateRange', true)}
                    className="text-blue-500"
                  />
                  <span>Intervalo de Datas</span>
                </label>
              </div>

              {!activity.isDateRange ? (
                <input
                  type="date"
                  value={activity.date}
                  onChange={(e) => updateActivity(activity.id, 'date', e.target.value)}
                  className={`w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">De</label>
                    <input
                      type="date"
                      value={activity.startDate}
                      onChange={(e) => updateActivity(activity.id, 'startDate', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Até</label>
                    <input
                      type="date"
                      value={activity.endDate}
                      onChange={(e) => updateActivity(activity.id, 'endDate', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                  </div>
                </div>
              )}
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem da Atividade (distância)</label>

            {uploadedImages[activity.id] ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={uploadedImages[activity.id].preview}
                    alt="Pré-visualização da atividade"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    onClick={() => removeImage(activity.id)}
                    variant="red"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 text-xs"
                  >
                    <X className="button__icon" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{uploadedImages[activity.id].name}</p>
                <Button
                  onClick={() => triggerImageUpload(activity.id)}
                  variant="blue"
                  size="sm"
                  className=""
                >
                  <Upload className="button__icon" />
                  <span>Alterar Imagem</span>
                </Button>
              </div>
            ) : (
              <button
                onClick={() => triggerImageUpload(activity.id)}
                className={`w-full p-4 border-2 border-dashed rounded-lg transition-colors flex flex-col items-center justify-center space-y-2 ${errors.image
                  ? 'border-red-500 bg-red-50 text-red-600 hover:border-red-600 hover:bg-red-100'
                  : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <Camera className="button__icon" />
                  <Upload className="button__icon" />
                </div>
                <span className="text-sm font-medium">Carregar Imagem</span>
                <span className="text-xs text-gray-500">Clique para tirar foto ou selecionar ficheiro</span>
              </button>
            )}
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              ref={(el) => (fileInputRefs.current[activity.id] = el)}
              onChange={(e) => handleImageUpload(activity.id, e)}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            onClick={handleModalBack}
            variant="secondary"
          >
            <ChevronLeft className="button__icon" />
            <span>Voltar</span>
          </Button>

          <Button
            onClick={nextActivity}
            variant="primary"
            className=""
          >
            <span>Próximo</span>
            <ChevronRight className="button__icon" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep2Import = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 text-center">Escolha uma aplicação para importar</h2>

      <div className="grid grid-cols-2 gap-4">
        {supportedApps.map((app) => (
          <Button
            key={app.name}
            onClick={app.available ? (app.name === 'Strava' ? handleStravaConnect : null) : null}
            disabled={!app.available}
            variant={app.available ? "white" : "white"}
            className={`p-6 border-2 transition-all ${app.available
              ? 'hover:border-[#be2e00] hover:bg-[#ffd6bc]'
              : 'opacity-50 cursor-not-allowed'
              }`}
          >
            <div className="text-4xl mb-2">{app.icon}</div>
            <div className="font-semibold">
              {app.name}
              {!app.available && (
                <div className="text-xs font-normal mt-1">(Em Breve)</div>
              )}
            </div>
          </Button>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Como funciona:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Clique na sua aplicação preferida</li>
          <li>• Faça login com as suas credenciais</li>
          <li>• Selecione as atividades que deseja importar</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={handleModalBack}
          variant="secondary"
        >
          <ChevronLeft size={16} />
          <span>Voltar</span>
        </Button>
      </div>
    </div>
  );

  const renderStep3Select = () => {
    const todayDate = new Date().toISOString().split("T")[0];

    // Filter activities to only show those within campaign period
    const validActivities = stravaActivities.filter(activity =>
      CAMPAIGN_CONFIG.isValidActivityDate(activity.date)
    );

    // Sort: today's first
    const sortedActivities = [...validActivities].sort((a, b) => {
      if (a.date === todayDate && b.date !== todayDate) return -1;
      if (b.date === todayDate && a.date !== todayDate) return 1;
      return new Date(b.date) - new Date(a.date);
    });

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Selecione a atividade do Strava:
        </h2>

        {sortedActivities.length === 0 ? (
          <div className="text-center space-y-2">
            <p className="text-gray-500">
              {stravaActivities.length === 0
                ? "Nenhuma atividade encontrada. Tente conectar novamente."
                : `Nenhuma atividade válida encontrada. As atividades devem estar entre ${CAMPAIGN_CONFIG.getStartDateString()} e ${CAMPAIGN_CONFIG.getEndDateString()}.`
              }
            </p>
            {stravaActivities.length > 0 && validActivities.length === 0 && (
              <p className="text-sm text-orange-600">
                {stravaActivities.length} atividade(s) foram filtradas por estarem fora do período da campanha.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity) => (
              <div
                key={activity.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${selectedActivity?.id === activity.id
                    ? "border-red-500 bg-red-50"
                    : activity.date === todayDate
                      ? "border-gray-300 bg-yellow-50"
                      : "bg-gray-50 border-transparent hover:border-gray-300"
                  }`}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {activity.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Distância: {activity.distance} km
                    </p>
                    <p className="text-gray-600 text-sm">Data: {activity.date}</p>
                  </div>
                  {selectedActivity?.id === activity.id && (
                    <div className="text-red-500 font-semibold text-sm">
                      Selecionada
                    </div>
                  )}
                  {activity.date === todayDate && (
                    <div className="text-xs text-yellow-700 bg-yellow-200 px-2 py-1 rounded ml-2">
                      Hoje
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            onClick={handleModalBack}
            variant="white"
            className="space-x-2"
          >
            <ChevronLeft size={16} />
            <span>Voltar</span>
          </Button>
          <Button
            onClick={() => {
              if (selectedActivity) {
                const newActivity = {
                  id: selectedActivity.id,
                  type: selectedActivity.type,
                  distance: selectedActivity.distance,
                  date: selectedActivity.date,
                  isDateRange: false,
                  startDate: selectedActivity.date,
                  endDate: selectedActivity.date,
                  source: "Strava",
                  externalId:
                    selectedActivity.externalId || `strava_${selectedActivity.id}`,
                };

                const merged = removeDuplicateActivities([
                  ...activities,
                  newActivity,
                ]);
                setActivities(merged);
                goToReviewStep();
              }
            }}
            disabled={!selectedActivity}
            variant="primary"
            className="space-x-2"
          >
            <span>Continuar</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep4Review = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 text-center">Rever as Suas Atividades</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {activityTypes.find(t => t.value === activity.type)?.icon} {' '}
                  {activityTypes.find(t => t.value === activity.type)?.label}
                </h3>
                <p className="text-gray-600">Distância: {activity.distance} km</p>
                <p className="text-gray-600">
                  Data: {activity.isDateRange
                    ? `${activity.startDate} a ${activity.endDate}`
                    : activity.date
                  }
                </p>
                {activity.source && (
                  <p className="text-sm text-blue-600 mt-1">
                    Importado do {activity.source}
                    {activity.externalId && (
                      <span className="text-xs text-gray-500 ml-2">
                        (ID: {activity.externalId.slice(-6)})
                      </span>
                    )}
                  </p>
                )}
                {uploadedImages[activity.id] && (
                  <div className="mt-2">
                    <img
                      src={uploadedImages[activity.id].preview}
                      alt="Imagem da atividade"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <Button
                onClick={() => deleteActivityFromReview(activity.id)}
                variant="outline"
                size="sm"
                className="ml-4 text-red-500 hover:text-red-700 border-transparent hover:bg-red-50"
                title="Eliminar atividade"
              >
                <Trash2 className="button__icon" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add More Activities Button */}
      <div className="border border-dashed border-blue-300 rounded-lg p-2 text-center">
        <Button
          onClick={addActivityFromReview}
          variant="outline"
          fullWidth
          className="py-2 text-blue-600 hover:text-blue-800 border-blue-300 hover:bg-blue-50 flex items-center justify-center gap-2"
        >
          <Plus className="button__icon" />
          <span className="text-base font-medium">Adicionar Mais Atividades</span>
        </Button>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma atividade para rever.</p>
        </div>
      )}

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Pronto para Submeter!</h3>
        <p className="text-sm text-green-700">
          Por favor, reveja as suas atividades acima. Uma vez submetidas, estes dados serão adicionados ao seu perfil.
          {activities.some(a => a.source) && (
            <span className="block mt-1">
              Nota: Atividades duplicadas das importações foram automaticamente removidas.
            </span>
          )}
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={handleModalBack}
          variant="white"
          className="space-x-2"
        >
          <ChevronLeft size={16} />
          <span>Voltar</span>
        </Button>
        <div className="flex space-x-3">
          <Button
            onClick={() => {
              setCurrentStep(0);
              setSubmissionType('');
              setCurrentActivityIndex(0);
              setValidationErrors({});
              setUploadedImages({});
              setActivities([]);
            }}
            variant="red"
            className=""
          >
            <X className="button__icon" />
            <span>Cancelar</span>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={activities.length === 0}
            variant="primary"
            className=""
          >
            <Check className="button__icon" />
            <span>Submeter</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const handleModalBack = () => {
    if (currentStep === 0) {
      if (onClose) onClose();
    } else {
      if (currentStep === 4) {
        setCurrentStep(submissionType === "manual" ? 1 : 2);
      } else if (currentStep === 3) {
        setCurrentStep(2);
      } else if (currentStep === 2 || currentStep === 1) {
        setCurrentStep(0);
      }
    }
  };

  if (currentStep === 5) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Step5FinalPage
          mealsDonated={5}
          onClose={() => {
            setCurrentStep(0);
            setSubmissionType("");
            setCurrentActivityIndex(0);
            setValidationErrors({});
            setUploadedImages({});
            setActivities([]);

            if (onClose) onClose();
          }}
        />
      </div>
    );
  }

  // Render regular modal with header and step indicator for steps 0 to 4
  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      <div
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 relative max-h-[85vh] overflow-y-auto submission-flow-card"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 rounded-t-2xl z-20">
          <div className="relative">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-30"
                aria-label="Fechar"
              >
                <X className="button__icon" />
              </button>
            )}
            <p className="text-center text-gray-600">
              Registe os quilômetros percorridos para cada atividade
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center mt-6">
            {(() => {
              let steps, currentVisualStep;

              if (submissionType === "manual") {
                steps = ["Choose Method", "Enter Details", "Review"];
                if (currentStep === 0) currentVisualStep = 0;
                else if (currentStep === 1) currentVisualStep = 1;
                else if (currentStep === 4) currentVisualStep = 2;
                else currentVisualStep = 1;
              } else if (submissionType === "import") {
                steps = ["Choose Method", "Pick App", "Select Activity", "Review"];
                if (currentStep === 0) currentVisualStep = 0;
                else if (currentStep === 2) currentVisualStep = 1;
                else if (currentStep === 3) currentVisualStep = 2;
                else if (currentStep === 4) currentVisualStep = 3;
                else currentVisualStep = 1;
              } else {
                steps = ["Choose Method"];
                currentVisualStep = 0;
              }

              return steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${index <= currentVisualStep ? "bg-blue-500" : "bg-gray-300"
                    }`}
                />
              ));
            })()}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 0 && renderStep0()}
          {currentStep === 1 && renderStep1Manual()}
          {currentStep === 2 && renderStep2Import()}
          {currentStep === 3 && renderStep3Select()}
          {currentStep === 4 && renderStep4Review()}
        </div>
      </div>
    </div>
  );
};

export default ActivitySubmissionFlow;