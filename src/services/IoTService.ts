// IoT and Smart Farming Service
export interface IoTDevice {
  id: string;
  name: string;
  type: 'soil_sensor' | 'weather_station' | 'camera' | 'irrigation_controller' | 'drone' | 'livestock_tracker';
  location: {
    farmId: string;
    coordinates: [number, number];
    zone: string;
  };
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel: number;
  lastUpdate: string;
  firmware: string;
}

export interface SensorData {
  deviceId: string;
  timestamp: string;
  readings: {
    soilMoisture?: number;
    soilPH?: number;
    soilTemperature?: number;
    airTemperature?: number;
    humidity?: number;
    lightIntensity?: number;
    rainfall?: number;
    windSpeed?: number;
    windDirection?: number;
    co2Level?: number;
    nutrients?: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  farmId: string;
  trigger: {
    sensor: string;
    condition: string;
    value: number;
  };
  action: {
    device: string;
    command: string;
    parameters: Record<string, any>;
  };
  isActive: boolean;
  lastTriggered?: string;
  executionCount: number;
}

export interface DroneData {
  droneId: string;
  flightId: string;
  timestamp: string;
  location: [number, number];
  altitude: number;
  batteryLevel: number;
  mission: 'survey' | 'spray' | 'monitoring' | 'mapping';
  data: {
    images?: string[];
    thermalData?: number[][];
    multispectralData?: {
      red: number[][];
      green: number[][];
      blue: number[][];
      nir: number[][];
    };
    sprayData?: {
      chemical: string;
      concentration: number;
      coverage: number;
    };
  };
}

export interface SmartIrrigation {
  systemId: string;
  farmId: string;
  zones: {
    id: string;
    name: string;
    cropType: string;
    area: number;
    soilType: string;
    currentMoisture: number;
    targetMoisture: number;
    lastWatered: string;
    nextScheduled: string;
    waterUsage: number; // liters
  }[];
  schedule: {
    zoneId: string;
    startTime: string;
    duration: number;
    frequency: string;
    isActive: boolean;
  }[];
  efficiency: {
    waterSaved: number;
    energySaved: number;
    yieldImprovement: number;
  };
}

class IoTService {
  private devices: IoTDevice[] = [];
  private sensorData: SensorData[] = [];
  private automationRules: AutomationRule[] = [];

  // Device management
  async registerDevice(device: Omit<IoTDevice, 'id' | 'lastUpdate'>): Promise<IoTDevice> {
    const newDevice: IoTDevice = {
      ...device,
      id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdate: new Date().toISOString()
    };

    this.devices.push(newDevice);
    return newDevice;
  }

  async getDevices(farmId?: string): Promise<IoTDevice[]> {
    if (farmId) {
      return this.devices.filter(device => device.location.farmId === farmId);
    }
    return this.devices;
  }

  async updateDeviceStatus(deviceId: string, status: IoTDevice['status']): Promise<void> {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.status = status;
      device.lastUpdate = new Date().toISOString();
    }
  }

  // Real-time sensor data collection
  async collectSensorData(deviceId: string): Promise<SensorData> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) throw new Error('Device not found');

    const sensorData: SensorData = {
      deviceId,
      timestamp: new Date().toISOString(),
      readings: this.generateSensorReadings(device.type)
    };

    this.sensorData.push(sensorData);
    
    // Check automation rules
    await this.checkAutomationRules(sensorData);
    
    return sensorData;
  }

  private generateSensorReadings(deviceType: IoTDevice['type']): SensorData['readings'] {
    const baseReadings: SensorData['readings'] = {};

    switch (deviceType) {
      case 'soil_sensor':
        return {
          soilMoisture: 30 + Math.random() * 40, // 30-70%
          soilPH: 6.0 + Math.random() * 2, // 6.0-8.0
          soilTemperature: 20 + Math.random() * 15, // 20-35°C
          nutrients: {
            nitrogen: 50 + Math.random() * 100,
            phosphorus: 20 + Math.random() * 50,
            potassium: 100 + Math.random() * 200
          }
        };

      case 'weather_station':
        return {
          airTemperature: 20 + Math.random() * 20, // 20-40°C
          humidity: 40 + Math.random() * 40, // 40-80%
          rainfall: Math.random() * 10, // 0-10mm
          windSpeed: Math.random() * 20, // 0-20 km/h
          windDirection: Math.random() * 360, // 0-360 degrees
          lightIntensity: 20000 + Math.random() * 80000 // lux
        };

      default:
        return baseReadings;
    }
  }

  // Smart irrigation system
  async getIrrigationSystem(farmId: string): Promise<SmartIrrigation> {
    return {
      systemId: `irrigation_${farmId}`,
      farmId,
      zones: [
        {
          id: 'zone_1',
          name: 'Tomato Field A',
          cropType: 'Tomatoes',
          area: 2.5, // hectares
          soilType: 'Loamy',
          currentMoisture: 45,
          targetMoisture: 60,
          lastWatered: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          nextScheduled: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          waterUsage: 1250 // liters today
        },
        {
          id: 'zone_2',
          name: 'Onion Field B',
          cropType: 'Onions',
          area: 1.8,
          soilType: 'Sandy Loam',
          currentMoisture: 35,
          targetMoisture: 50,
          lastWatered: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          nextScheduled: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
          waterUsage: 890
        }
      ],
      schedule: [
        {
          zoneId: 'zone_1',
          startTime: '06:00',
          duration: 30, // minutes
          frequency: 'daily',
          isActive: true
        },
        {
          zoneId: 'zone_2',
          startTime: '06:30',
          duration: 25,
          frequency: 'daily',
          isActive: true
        }
      ],
      efficiency: {
        waterSaved: 35, // percentage
        energySaved: 25,
        yieldImprovement: 18
      }
    };
  }

  async controlIrrigation(zoneId: string, action: 'start' | 'stop', duration?: number): Promise<void> {
    console.log(`Irrigation ${action} for zone ${zoneId}${duration ? ` for ${duration} minutes` : ''}`);
    
    // Simulate irrigation control
    setTimeout(() => {
      console.log(`Irrigation ${action} completed for zone ${zoneId}`);
    }, 1000);
  }

  // Automation rules engine
  async createAutomationRule(rule: Omit<AutomationRule, 'id' | 'executionCount'>): Promise<AutomationRule> {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      executionCount: 0
    };

    this.automationRules.push(newRule);
    return newRule;
  }

  private async checkAutomationRules(sensorData: SensorData): Promise<void> {
    for (const rule of this.automationRules.filter(r => r.isActive)) {
      const sensorValue = this.extractSensorValue(sensorData, rule.trigger.sensor);
      
      if (this.evaluateCondition(sensorValue, rule.trigger.condition, rule.trigger.value)) {
        await this.executeAutomationAction(rule);
        rule.lastTriggered = new Date().toISOString();
        rule.executionCount++;
      }
    }
  }

  private extractSensorValue(data: SensorData, sensorPath: string): number {
    // Extract nested sensor values like 'readings.soilMoisture'
    const keys = sensorPath.split('.');
    let value: any = data;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return typeof value === 'number' ? value : 0;
  }

  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case '<': return value < threshold;
      case '>': return value > threshold;
      case '<=': return value <= threshold;
      case '>=': return value >= threshold;
      case '==': return value === threshold;
      default: return false;
    }
  }

  private async executeAutomationAction(rule: AutomationRule): Promise<void> {
    console.log(`Executing automation rule: ${rule.name}`);
    
    switch (rule.action.command) {
      case 'start_irrigation':
        await this.controlIrrigation(
          rule.action.parameters.zoneId,
          'start',
          rule.action.parameters.duration
        );
        break;
      
      case 'send_alert':
        console.log(`Alert: ${rule.action.parameters.message}`);
        break;
      
      case 'adjust_climate':
        console.log(`Adjusting climate control: ${JSON.stringify(rule.action.parameters)}`);
        break;
    }
  }

  // Drone operations
  async deployDrone(
    farmId: string,
    mission: DroneData['mission'],
    flightPlan: { coordinates: [number, number][]; altitude: number }
  ): Promise<DroneData> {
    const droneData: DroneData = {
      droneId: `drone_${Date.now()}`,
      flightId: `flight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      location: flightPlan.coordinates[0],
      altitude: flightPlan.altitude,
      batteryLevel: 85 + Math.random() * 15,
      mission,
      data: this.generateDroneData(mission)
    };

    return droneData;
  }

  private generateDroneData(mission: DroneData['mission']): DroneData['data'] {
    switch (mission) {
      case 'survey':
        return {
          images: [
            'survey_001.jpg',
            'survey_002.jpg',
            'survey_003.jpg'
          ],
          thermalData: Array(10).fill(0).map(() => 
            Array(10).fill(0).map(() => 25 + Math.random() * 10)
          )
        };

      case 'spray':
        return {
          sprayData: {
            chemical: 'Organic Pesticide',
            concentration: 2.5, // %
            coverage: 95.2 // %
          }
        };

      case 'monitoring':
        return {
          multispectralData: {
            red: Array(20).fill(0).map(() => Array(20).fill(0).map(() => Math.random())),
            green: Array(20).fill(0).map(() => Array(20).fill(0).map(() => Math.random())),
            blue: Array(20).fill(0).map(() => Array(20).fill(0).map(() => Math.random())),
            nir: Array(20).fill(0).map(() => Array(20).fill(0).map(() => Math.random()))
          }
        };

      default:
        return {};
    }
  }

  // Livestock tracking (for mixed farming)
  async trackLivestock(farmId: string): Promise<any> {
    return {
      farmId,
      animals: [
        {
          id: 'cow_001',
          type: 'dairy_cow',
          breed: 'Holstein',
          age: 4,
          health: 'good',
          location: [19.123, 73.456],
          activity: 'grazing',
          vitals: {
            temperature: 38.5,
            heartRate: 65,
            respirationRate: 25
          },
          milkProduction: {
            daily: 25.5, // liters
            weekly: 178.5,
            quality: 'Grade A'
          }
        }
      ],
      alerts: [
        {
          animalId: 'cow_001',
          type: 'health',
          message: 'Slight temperature elevation detected',
          severity: 'low',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }

  // Environmental monitoring
  async monitorEnvironment(farmId: string): Promise<any> {
    return {
      farmId,
      airQuality: {
        aqi: 45, // Good
        pm25: 12,
        pm10: 25,
        co2: 410,
        ozone: 0.06
      },
      soilHealth: {
        organicMatter: 3.2, // %
        microbialActivity: 85, // index
        compaction: 'low',
        erosionRisk: 'minimal'
      },
      waterQuality: {
        ph: 7.2,
        tds: 450, // ppm
        salinity: 0.3,
        contamination: 'none'
      },
      biodiversity: {
        beneficialInsects: 'high',
        pollinators: 'abundant',
        soilOrganisms: 'diverse',
        birdSpecies: 15
      }
    };
  }

  // Energy management for smart farms
  async manageEnergy(farmId: string): Promise<any> {
    return {
      farmId,
      solarPanels: {
        capacity: 50, // kW
        currentGeneration: 35.2,
        dailyGeneration: 280, // kWh
        efficiency: 18.5 // %
      },
      energyConsumption: {
        irrigation: 45, // kWh/day
        lighting: 12,
        cooling: 28,
        equipment: 35,
        total: 120
      },
      batteryStorage: {
        capacity: 100, // kWh
        currentCharge: 75,
        cycleCount: 245
      },
      gridConnection: {
        import: 15, // kWh today
        export: 85, // kWh today
        netMetering: true
      },
      carbonOffset: {
        dailySavings: 85, // kg CO2
        monthlySavings: 2550,
        yearlyProjection: 31025
      }
    };
  }
}

export const iotService = new IoTService();