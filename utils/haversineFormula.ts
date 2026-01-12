export interface GeolocationResponse {
  timestamp: number;
  coords: {
    speed: number;
    heading: number;
    altitude: number;
    accuracy: number;
    longitude: number;
    latitude: number;
  };
  extras: {
    meanCn0: number;
    maxCn0: number;
    satellites: number;
  };
}

export interface Waypoint {
  longitude: number;
  latitude: number;
}

const haversineFormula = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};

const calculateTotalDistance = (coordinates: GeolocationResponse[]) => {
  let totalDistance = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i].coords;
    const end = coordinates[i + 1].coords;

    const distance = haversineFormula(
      start.latitude,
      start.longitude,
      end.latitude,
      end.longitude,
    );

    totalDistance += distance;
  }

  return totalDistance;
};

const calculateAverageSpeed = (coordinates: GeolocationResponse[]) => {
  let totalDistance = 0; // in kilometers
  let totalTime = 0; // in hours

  for (let i = 1; i < coordinates.length; i++) {
    const prevPoint = coordinates[i - 1];
    const currentPoint = coordinates[i];

    const distance = haversineFormula(
      prevPoint.coords.latitude,
      prevPoint.coords.longitude,
      currentPoint.coords.latitude,
      currentPoint.coords.longitude,
    );

    // Convert timestamp from milliseconds to hours
    const timeElapsed =
      (currentPoint.timestamp - prevPoint.timestamp) / (1000 * 60 * 60); // Convert ms to hours

    totalDistance += distance;
    totalTime += timeElapsed;
  }

  const averageSpeed = totalTime > 0 ? totalDistance / totalTime : 0; // in km/h
  return averageSpeed;
};

const calculateSpeedMetrics = (coordinates: GeolocationResponse[]) => {
  let maxSpeed = 0;
  let minSpeed = Infinity;
  const speeds: number[] = [];

  for (let i = 0; i < coordinates.length; i++) {
    const speed = coordinates[i].coords.speed * 3.6; // Convert m/s to km/h
    if (speed > 0) {
      speeds.push(speed);
      maxSpeed = Math.max(maxSpeed, speed);
      minSpeed = Math.min(minSpeed, speed);
    }
  }

  return {
    maxSpeed: maxSpeed > 0 ? maxSpeed : 0,
    minSpeed: minSpeed !== Infinity ? minSpeed : 0,
    speeds,
  };
};

const calculateElevationMetrics = (coordinates: GeolocationResponse[]) => {
  let elevationGain = 0;
  let elevationLoss = 0;
  let maxElevation = -Infinity;
  let minElevation = Infinity;

  for (let i = 1; i < coordinates.length; i++) {
    const prevElevation = coordinates[i - 1].coords.altitude;
    const currentElevation = coordinates[i].coords.altitude;

    if (prevElevation > 0 && currentElevation > 0) {
      const elevationChange = currentElevation - prevElevation;
      if (elevationChange > 0) {
        elevationGain += elevationChange;
      } else {
        elevationLoss += Math.abs(elevationChange);
      }
    }

    if (currentElevation > 0) {
      maxElevation = Math.max(maxElevation, currentElevation);
      minElevation = Math.min(minElevation, currentElevation);
    }
  }

  return {
    elevationGain: elevationGain > 0 ? elevationGain : 0,
    elevationLoss: elevationLoss > 0 ? elevationLoss : 0,
    maxElevation: maxElevation !== -Infinity ? maxElevation : 0,
    minElevation: minElevation !== Infinity ? minElevation : 0,
  };
};

const calculateStops = (
  coordinates: GeolocationResponse[],
  speedThreshold: number = 1,
) => {
  let stops = 0;
  let isStopped = false;

  for (let i = 0; i < coordinates.length; i++) {
    const speed = coordinates[i].coords.speed * 3.6; // Convert m/s to km/h
    if (speed < speedThreshold && !isStopped) {
      stops++;
      isStopped = true;
    } else if (speed >= speedThreshold) {
      isStopped = false;
    }
  }

  return stops;
};

const calculateAverageHeading = (coordinates: GeolocationResponse[]) => {
  let totalHeading = 0;
  let validHeadings = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const heading = coordinates[i].coords.heading;
    if (heading >= 0 && heading <= 360) {
      totalHeading += heading;
      validHeadings++;
    }
  }

  return validHeadings > 0 ? totalHeading / validHeadings : 0;
};

const calculateDuration = (coordinates: GeolocationResponse[]) => {
  if (coordinates.length < 2) {
    return 0;
  }
  const startTime = coordinates[0].timestamp;
  const endTime = coordinates[coordinates.length - 1].timestamp;
  return endTime - startTime; // in milliseconds
};

const formatDuration = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

const calculateSegments = (coordinates: GeolocationResponse[]) => {
  const segments: Array<{
    distance: number;
    speed: number;
    time: number;
    startIndex: number;
    endIndex: number;
  }> = [];

  for (let i = 1; i < coordinates.length; i++) {
    const prevPoint = coordinates[i - 1];
    const currentPoint = coordinates[i];

    const distance = haversineFormula(
      prevPoint.coords.latitude,
      prevPoint.coords.longitude,
      currentPoint.coords.latitude,
      currentPoint.coords.longitude,
    );

    const timeElapsed = currentPoint.timestamp - prevPoint.timestamp; // in ms
    const timeInHours = timeElapsed / (1000 * 60 * 60);
    const speed = timeInHours > 0 ? distance / timeInHours : 0; // in km/h

    segments.push({
      distance,
      speed,
      time: timeElapsed,
      startIndex: i - 1,
      endIndex: i,
    });
  }

  return segments;
};

const buildDirectionWaypoints = (path: GeolocationResponse[]) => {
  const waypoints: Waypoint[] = path.map(point => {
    return {
      latitude: point.coords.latitude,
      longitude: point.coords.longitude,
    };
  });

  return waypoints;
};

export interface RoadRecordAnalysis {
  // Original metrics
  distance: number;
  averageSpeed: number;
  waypoints: Waypoint[];
  startTime: Date;
  endTime: Date;
  // Extended metrics
  maxSpeed: number;
  minSpeed: number;
  duration: number; // in milliseconds
  durationFormatted: string;
  elevationGain: number; // in meters
  elevationLoss: number; // in meters
  maxElevation: number; // in meters
  minElevation: number; // in meters
  pickupAddress: string;
  destinationAddress: string;
  stops: number;
  averageHeading: number; // in degrees (0-360)
  numberOfWaypoints: number;
  segments: Array<{
    distance: number;
    speed: number;
    time: number;
    startIndex: number;
    endIndex: number;
  }>;
}

export const analyzeRoadRecord = (
  record: GeolocationResponse[],
): RoadRecordAnalysis => {
  if (!record || record.length === 0) {
    throw new Error('Record array is empty or undefined');
  }

  const distance = calculateTotalDistance(record);
  const averageSpeed = calculateAverageSpeed(record);
  const waypoints = buildDirectionWaypoints(record);
  const startTime = new Date(record[0].timestamp);
  const endTime = new Date(record[record.length - 1].timestamp);
  const duration = calculateDuration(record);
  const durationFormatted = formatDuration(duration);
  const speedMetrics = calculateSpeedMetrics(record);
  const elevationMetrics = calculateElevationMetrics(record);
  const stops = calculateStops(record);
  const averageHeading = calculateAverageHeading(record);
  const segments = calculateSegments(record);

  return {
    // Original metrics
    distance,
    averageSpeed,
    waypoints,
    startTime,
    endTime,
    // Extended metrics
    maxSpeed: speedMetrics.maxSpeed,
    minSpeed: speedMetrics.minSpeed,
    duration,
    durationFormatted,
    elevationGain: elevationMetrics.elevationGain,
    elevationLoss: elevationMetrics.elevationLoss,
    maxElevation: elevationMetrics.maxElevation,
    minElevation: elevationMetrics.minElevation,
    stops,
    averageHeading,
    numberOfWaypoints: waypoints.length,
    segments,
  };
};
