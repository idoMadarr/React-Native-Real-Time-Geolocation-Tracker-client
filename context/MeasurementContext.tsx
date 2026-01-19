import React, {createContext, useRef} from 'react';
import {GeolocationResponse} from '../utils/haversineFormula';

export const MeasurementContext = createContext<{
  directionRef: React.RefObject<GeolocationResponse[]>;
}>({
  directionRef: {current: []},
});

export const MeasurementProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const directionRef = useRef<GeolocationResponse[]>([]);

  return (
    <MeasurementContext.Provider value={{directionRef}}>
      {children}
    </MeasurementContext.Provider>
  );
};
