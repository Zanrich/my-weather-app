export interface Alert {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }
  
  export interface AlertContextProps {
    alert: Alert | null;
    setAlert: (alert: Alert | null) => void;
  }