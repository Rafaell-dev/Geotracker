export interface TelemetryData {
  _id: string;
  device_id: string;
  timestamp: string;
  gps: {
    lat: number;
    lng: number;
    altitude: number;
    speed: number;
    satellites: number;
    hdop: number;
  };
  sensors: {
    temperature: number;
    battery_mv: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryResponse {
  success: boolean;
  total: number;
  data: TelemetryData[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1';

export async function fetchTelemetry(params?: { device_id?: string; limit?: number }): Promise<TelemetryData[]> {
  const url = new URL(`${API_BASE_URL}/telemetry/telemetry`);
  
  if (params?.device_id) {
    url.searchParams.append('device_id', params.device_id);
  }
  
  if (params?.limit) {
    url.searchParams.append('limit', params.limit.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch telemetry: ${response.statusText}`);
  }

  const result: TelemetryResponse = await response.json();
  if (result.success && result.data) {
    return result.data;
  }
  
  return [];
}

/** Busca telemetria apenas dos devices vinculados aos veículos do usuário autenticado */
export async function fetchMyTelemetry(token: string, params?: { limit?: number }): Promise<TelemetryData[]> {
  const url = new URL(`${API_BASE_URL}/telemetry/telemetry/my`);
  
  if (params?.limit) {
    url.searchParams.append('limit', params.limit.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch my telemetry: ${response.statusText}`);
  }

  const result: TelemetryResponse = await response.json();
  return result.success && result.data ? result.data : [];
}

// --- AUTH & USER METHODS ---

export interface UserData {
  id: string;
  name?: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

export async function loginUser(data: any): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Erro ao fazer login');
  }
  return response.json();
}

export async function registerUser(data: any): Promise<UserData> {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Erro ao criar usuário');
  }
  return response.json();
}

// --- VEHICLE METHODS ---

export interface VehicleFromApi {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  photo?: string;
  userId: string;
  devices: { id: string; deviceId: string; status: string }[];
}

/** Lista os veículos do usuário autenticado (admin vê todos) */
export async function fetchMyVehicles(token: string): Promise<VehicleFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/vehicles/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
  }
  const result = await response.json();
  return result.success && result.data ? result.data : [];
}

export async function createVehicle(data: any, token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/vehicles/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Erro ao cadastrar veículo');
  }
  return response.json();
}

export async function linkDevice(data: { deviceId: string; vehicleId: string }, token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/devices/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Erro ao vincular dispositivo');
  }
  return response.json();
}

export async function unlinkDevice(deviceId: string, token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/devices/unlink`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ deviceId }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Erro ao desvincular dispositivo');
  }
  return response.json();
}

export async function updateVehicle(id: string, data: any, token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Erro ao atualizar veículo');
  }
  return response.json();
}
